
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
          signOptions: {expiresIn: '1h'}
        }
      }
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}




