import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SellerModule } from './seller/seller.module';
import { AddressModule } from './address/address.module';
import { BuyerModule } from './buyer/buyer.module';
import { AdminModule } from './admin/admin.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { ImageModule } from './image/image.module';
import { CartModule } from './cart/cart.module';



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
    ProductModule,
    CategoryModule,
    CloudinaryModule,
    ImageModule,
    CartModule
  ],
  controllers: [AppController],
  providers: [AppService, CloudinaryService],
})
export class AppModule {}
