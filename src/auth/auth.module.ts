
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { SellerModule } from 'src/seller/seller.module';
import { AddressModule } from 'src/address/address.module';
import { BuyerModule } from 'src/buyer/buyer.module';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [
    UserModule,
    SellerModule,
    AddressModule,
    BuyerModule,
    AdminModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return{
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {expiresIn: '25m'}
        }
      }
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}


// Validate stock availability for each cart item
      // for (const cartItem of cart.cartItems) {
      //   const product = cartItem.product;
      //   if (product.stock < cartItem.quantity) {
      //     throw new BadRequestException(`${product.name} is out of stock`);
      //   }

