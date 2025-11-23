import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Transaction, TransactionStatus } from "./entities/transaction.entity";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { CheckoutDto } from "./dto/Checkout.dto";
import { DataSource } from "typeorm";
import axios from "axios";
import { Buyer } from "src/buyer/entities/buyer.entity";
import { Order, OrderStatus } from "src/order/entities/order.entity";
import { OrderItem } from "src/order-item/entities/order-item.entity";
import { Cart } from "src/cart/entities/cart.entity";
import { PaystackWebhookDto } from "./dto/webhook-event.dto";
import * as crypto from 'crypto';

@Injectable()
export class PaymentService {
  private readonly paystackSecretKey: string;
  private readonly paystackBaseUrl = 'https://api.paystack.co';

  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    
    private configService: ConfigService,
    private dataSource: DataSource,
  ) {
     const secretKey = this.configService.get<string>('PAYSTACK_SECRET_KEY');
    if (!secretKey) {
      throw new Error('PAYSTACK_SECRET_KEY is not defined in environment variables');
    }
    this.paystackSecretKey = secretKey;
  }

  // Generate reference
  private generateReference(): string {
    return `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }


  // Checkout - Create order and Initialize payment
  async checkOut(userIdFromRequest : string, checkoutDto: CheckoutDto) {

    return await this.dataSource.transaction(async (manager) => {

      // validate buyer existence
      const buyer =  await manager.findOne(Buyer, {
        where: {user: {id: userIdFromRequest}}
      });
      if (!buyer) {
        throw new NotFoundException('Buyer not found');
      }

      // check if cart belongs to buyer
      const cart = await manager.findOne(Cart, {
        where: {id: checkoutDto.cartId, buyer: {id: buyer.id}},
        relations: ['cartItems', 'cartItems.product', 'buyer', 'buyer.user']
      });
      if (!cart) {
        throw new BadRequestException('cart not found');
      }


      // Create Order
      const order = manager.create(Order, {
        buyer: buyer,
        totalAmount: cart.totalAmount,
        status: OrderStatus.PENDING,
      });
      await manager.save(order);

      // Create OrderItems from CartItems
      const cartItems = cart.cartItems;
      for (const cartItem of cartItems) {
        const orderItem = manager.create(OrderItem, {
          order: order,
          product: cartItem.product,
          quantity: cartItem.quantity,
          price: cartItem.priceAtTime,
          total: cartItem.priceAtTime * cartItem.quantity,
        });
        await manager.save(orderItem);
      }
      
      // Generate payment reference
      const reference = this.generateReference();
      const amountInKobo = cart.totalAmount * 100; // Convert to kobo

      // Initialize payment with Paystack
      try {
        const response = await axios.post(
          `${this.paystackBaseUrl}/transaction/initialize`,
          {
            email: cart.buyer.user.email, 
            amount: amountInKobo,
            reference,
            callback_url: `${this.configService.get('APP_URL') || 'https://kali-hebdomadal-pinkie.ngrok-free.dev'}/payment/callback`,
            metadata: {
              order_id: order.id,
              buyer_id: buyer.id,
              cartId: checkoutDto.cartId,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${this.paystackSecretKey}`,
              'Content-Type': 'application/json',
            },
          },
        );
        
         // Create transaction record
        const transaction = manager.create(Transaction, {
          reference,
          email: cart.buyer.user.email,
          amount: cart.totalAmount,
          status: TransactionStatus.PENDING,
          buyer,
          order,
          cart,
          access_code: response.data.data.access_code,
          authorization_url: response.data.data.authorization_url,
          metadata: {
            orderId: order.id,
            cartId: checkoutDto.cartId,
          },
        });
        await manager.save(transaction);

         // Link payment reference to order
        order.paymentReference = reference;
        await manager.save(order);

        return {
          success: true,
          message: 'Checkout successful, proceed to payment',
          data: {
            order_id: order.id,
            authorization_url: response.data.data.authorization_url,
            reference,
          },
        };
      } catch (error) {
        console.error("PAYSTACK ERROR:", error.response?.data || error);
        throw new InternalServerErrorException(
          error.response?.data?.message || 'Failed to initialize payment',
  
        );
      }
    });
  }

  //Handle webhook - complete order after payment
  async handleWebhook(payload: any, signature: string, rawBody: any,) {

      // Verify signature
      const hash = crypto
      .createHmac('sha512', this.paystackSecretKey)
      .update(rawBody)
      .digest('hex');

    if (hash !== signature) {
      throw new BadRequestException('Invalid signature');
    }


    // Handle successful payment
    if (payload.event === 'charge.success') {
       return await this.dataSource.transaction(async (manager) => {
    //     // Update transaction
        const transaction = await manager.findOne(Transaction, {
          where: { reference: payload.data.reference },
        });


        if (transaction) {
          transaction.status = TransactionStatus.SUCCESS;
          transaction.gateway_response = payload.data.gateway_response;
          transaction.paid_at = new Date(payload.data.paid_at);
          transaction.channel = payload.data.channel;

          if (payload.data.authorization) {
            transaction.card_type = payload.data.authorization.card_type;
            transaction.bank = payload.data.authorization.bank;
          }

          await manager.save(transaction);


          // Update order status
          const order = await manager.findOne(Order, {
            where: { paymentReference: payload.data.reference },
          });

          if (order) {
            order.status = OrderStatus.PAID;
            await manager.save(order);

            // Clear cart and cart items
            const cartId = payload.data.metadata?.cart_id;
            console.log('Clearing cart with ID:', cartId);
    
            if (cartId) {
              console.log('cart found, proceeding to clear it.', cartId);
              // Delete cart items first (due to foreign key)
              await manager.delete('CartItem', { cart_id: cartId });
              // Delete cart
              await manager.delete('Cart', { id: cartId });
            }

            console.log(`Order ${order.id} paid successfully. Cart cleared.`);
          }
        }


        return { success: true };
      });
    }

    return { success: true };

    
  }


  
  // Verify payment
  async verifyPayment(reference: string) {
    try {
      // Call Paystack verification endpoint
      const response = await axios.get(
        `${this.paystackBaseUrl}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${this.paystackSecretKey}`,
          },
        },
      );

      const paymentData = response.data.data;

      console.log('Payment Data:', paymentData);

      // Find payment transaction in database
      const transaction = await this.transactionRepository.findOne({
        where: { reference },
      });

      if (!transaction) {
        throw new NotFoundException('Transaction not found');
      }

      // Update transaction status in database
      transaction.status = paymentData.status === 'success' ? TransactionStatus.SUCCESS : TransactionStatus.FAILED;
      transaction.gateway_response = paymentData.gateway_response;
      transaction.paid_at = paymentData.paid_at ? new Date(paymentData.paid_at) : null;
      transaction.channel = paymentData.channel;

      if (paymentData.authorization) {
        transaction.card_type = paymentData.authorization.card_type;
        transaction.bank = paymentData.authorization.bank;
      }

      await this.transactionRepository.save(transaction);

      return {
        success: true,
        message: 'Payment verification completed',
        data: {
          reference: transaction.reference,
          amount: transaction.amount,
          status: transaction.status,
          paid_at: transaction.paid_at,
          channel: transaction.channel,
        },
      };
    } catch (error) {
      throw new BadRequestException(
        error.response?.data?.message || 'Payment verification failed',
      );
    }
  }

}