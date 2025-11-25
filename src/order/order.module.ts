import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Admin } from 'src/admin/entities/admin.entity';
import { Buyer } from 'src/buyer/entities/buyer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Admin, Buyer])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
