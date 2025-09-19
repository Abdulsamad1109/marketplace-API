import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CategoryModule } from 'src/category/category.module';
import { SellerModule } from 'src/seller/seller.module';
import { ImageModule } from 'src/image/image.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]),
  CategoryModule,
  SellerModule,
  ImageModule,
  CloudinaryModule
  ],
  
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService, TypeOrmModule]
})
export class ProductModule {}
