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



@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true, }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
      type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [User, Seller, Address, Buyer, Admin],
        synchronize: true,
    }),
  }),
    UserModule,
    AuthModule,
    SellerModule,
    AddressModule,
    BuyerModule,
    AdminModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
