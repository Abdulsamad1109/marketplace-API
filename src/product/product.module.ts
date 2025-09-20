import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { Category } from 'src/category/entities/category.entity';
import { Image } from 'src/image/entities/image.entity';
import { Seller } from 'src/seller/entities/seller.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, Seller, Image,]),
  CloudinaryModule
  ],
  
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService, TypeOrmModule]
})
export class ProductModule {}
