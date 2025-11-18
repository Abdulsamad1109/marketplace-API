import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Transaction, TransactionStatus } from "./entities/transaction.entity";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { InitializePaymentDto } from "./dto/initialize-payment.dto";
import { DataSource } from "typeorm";
import axios from "axios";

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

  // Generate unique reference
  private generateReference(): string {
    return `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  

  // Initialize payment
async initializePayment(initializePaymentDto: InitializePaymentDto) {
    const reference = this.generateReference();
    const amountInKobo = initializePaymentDto.amount;

    return await this.dataSource.transaction(
      async (manager) => {
        try {
          // Call Paystack API
          const response = await axios.post(
            `${this.paystackBaseUrl}/transaction/initialize`,
            {
              email: initializePaymentDto.email,
              amount: amountInKobo,
              reference,
              callback_url: initializePaymentDto.callback_url,
              metadata: initializePaymentDto.metadata,
            },
            {
              headers: {
                Authorization: `Bearer ${this.paystackSecretKey}`,
                'Content-Type': 'application/json',
              },
            },
          );

          // Save transaction to database within the transaction
          const transaction = manager.create(Transaction, {
            reference,
            email: initializePaymentDto.email,
            amount: amountInKobo / 100, // Store in naira
            status: TransactionStatus.PENDING,
            paystack_reference: response.data.data.reference,
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
          // Transaction will automatically rollback on error
          throw new InternalServerErrorException(
            error.response?.data?.message || 'Failed to initialize payment',
          );
        }
      },
    );
  }
}