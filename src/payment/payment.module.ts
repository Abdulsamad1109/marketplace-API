import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Transaction } from './entities/transaction.entity';
import { OrderModule } from 'src/order/order.module';
import { Order } from 'src/order/entities/order.entity';
import { OrderItem } from 'src/order-item/entities/order-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Order, OrderItem]),
    ConfigModule,
    OrderModule,
    
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
