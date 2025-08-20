import { Module } from '@nestjs/common';
import { BuyerService } from './buyer.service';
import { BuyerController } from './buyer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Buyer } from './entities/buyer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Buyer])],
  controllers: [BuyerController],
  providers: [BuyerService],
  exports: [BuyerService, TypeOrmModule],
})
export class BuyerModule {}
