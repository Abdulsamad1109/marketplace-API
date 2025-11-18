import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Transaction } from "./entities/transaction.entity";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { InitializePaymentDto } from "./dto/initialize-payment.dto";
import axios from "axios";

@Injectable()
export class PaymentService {
  private readonly paystackSecretKey: string;
  private readonly paystackBaseUrl = 'https://api.paystack.co';

  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private configService: ConfigService,
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

      
    } catch (error) {
      throw new InternalServerErrorException(
        error.response?.data?.message || 'Failed to initialize payment',
      );
    }
    }


}