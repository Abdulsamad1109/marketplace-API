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

@Injectable()
export class PaymentService {
  verifyPayment(reference: string) {
    throw new Error('Method not implemented.');
  }
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
        where: {id: checkoutDto.cartId, buyer: {id: buyer.id}}
      });
      if (!cart) {
        throw new BadRequestException('cart not found');
      }


      // Create Order - pending
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
      
      

        
      
    },);





  }


}