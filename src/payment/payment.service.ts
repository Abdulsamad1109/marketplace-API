import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Transaction, TransactionStatus } from "./entities/transaction.entity";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { InitializePaymentDto } from "./dto/initialize-payment.dto";
import { DataSource } from "typeorm";
import axios from "axios";
import { Buyer } from "src/buyer/entities/buyer.entity";

@Injectable()
export class PaymentService {
  private readonly paystackSecretKey: string;
  private readonly paystackBaseUrl = 'https://api.paystack.co';

  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
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


  // Initialize payment
async initializePayment(userIdFromRequest : string, initializePaymentDto: InitializePaymentDto) {
    const reference = this.generateReference();
    const amountInKobo = initializePaymentDto.amount * 100; // Convert to kobo

    return await this.dataSource.transaction(
      async (manager) => {

        // Find buyer existence
          const buyer = await this.dataSource.transaction(async (manager) => {
            return await manager.findOne(Buyer, {
              where:{user: {id: userIdFromRequest}}
            });
          });


        
        try {
          // Call Paystack API
          const response = await axios.post(
            `${this.paystackBaseUrl}/transaction/initialize`,
            {
              email: initializePaymentDto.email,
              amount: amountInKobo,
              reference,
              callback_url: `${this.configService.get('APP_URL') || 'http://localhost:3000'}/payments/callback`,
              metadata: initializePaymentDto.metadata,
            },
            {
              headers: {
                Authorization: `Bearer ${this.paystackSecretKey}`,
                'Content-Type': 'application/json',
              },
            },
          );


          // Save payment transaction to database within the transaction
          const transaction = manager.create(Transaction, {
            reference,
            email: initializePaymentDto.email,
            amount: amountInKobo / 100, // convert and store in naira
            status: TransactionStatus.PENDING,
            access_code: response.data.data.access_code,
            authorization_url: response.data.data.authorization_url,
            metadata: initializePaymentDto.metadata,
          });

          await manager.save(transaction);

          return {
            success: true,
            message: 'Payment initialized successfully',
            data: {
              authorization_url: response.data.data.authorization_url,
              access_code: response.data.data.access_code,
              reference,
            },
          };
        } catch (error) {
          throw new InternalServerErrorException(
            error.response?.data?.message || 'Failed to initialize payment',
          );
        }
      },
    );
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