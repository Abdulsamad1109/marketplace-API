import { Module } from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { CartItemController } from './cart-item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './entities/cart-item.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { Product } from 'src/product/entities/product.entity';
import { Buyer } from 'src/buyer/entities/buyer.entity';
import { CartModule } from 'src/cart/cart.module';

@Module({
  imports: [
  TypeOrmModule.forFeature([CartItem, Cart, CartItem, Product, Buyer,]),
  CartModule
],
  controllers: [CartItemController],
  providers: [CartItemService],
  exports: [CartItemService, TypeOrmModule],
})
export class CartItemModule {}
