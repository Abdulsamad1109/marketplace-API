import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {rawBody: true});




  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Marketplace API')
    .setDescription('Backend API for the Marketplace platform connecting buyers and sellers')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'access-token', // 
    )
    // .addTag('auth')
    // .addTag('users') // Admin, buyers
    // .addTag('sellers')
    // .addTag('products')
    // .addTag('payments')
    // .addTag('orders')
    // .addTag('order-items')
    // .addTag('reviews')
    // .addTag('deliveries')
    // .addTag('categories')
    // .addTag('addresses')
    // .addTag('carts')
    // .addTag('cart-items')
    // .addTag('wishlists')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('marketplace-api', app, document, {
    jsonDocumentUrl: 'marketplace-api/json',
  });




  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
