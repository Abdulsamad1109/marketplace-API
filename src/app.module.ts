import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { User } from './user/entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SellerModule } from './seller/seller.module';
import { AddressModule } from './address/address.module';
import { Seller } from './seller/entities/seller.entity';
import { Address } from './address/entities/address.entity';
import { BuyerModule } from './buyer/buyer.module';
import { Buyer } from './buyer/entities/buyer.entity';
import { AdminModule } from './admin/admin.module';
import { Admin } from './admin/entities/admin.entity';
import { ProductModule } from './product/product.module';



@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true, }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DB_URL'),
        autoLoadEntities: true,
        synchronize: true, // only use in dev, disable in prod
      }),
    }),
    UserModule,
    AuthModule,
    SellerModule,
    AddressModule,
    BuyerModule,
    AdminModule,
    ProductModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
