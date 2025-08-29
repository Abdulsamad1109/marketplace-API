import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cloudinary from './config/cloudinary.provider';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // // Test Cloudinary connection
  // try {
  //   const result = await cloudinary.api.ping();
  //   console.log('Cloudinary connected ✅', result);
  // } catch (error) {
  //   console.error('Cloudinary connection failed ❌', error);
  // }
  
   app.useGlobalPipes(new ValidationPipe({whitelist: true, forbidNonWhitelisted: true, transform: true}))

  const config = new DocumentBuilder()
    .setTitle('Marketplace API')
    .setDescription('Backend API for the Marketplace platform connecting buyers and sellers')
    .setVersion('1.0')
    .addBearerAuth() // Enables JWT token authentication in Swagger UI
    .addTag('auth')
    .addTag('users')       // Admin, buyers
    .addTag('sellers')
    .addTag('products')
    .addTag('payments')
    .addTag('orders')
    .addTag('order-items')
    .addTag('reviews')
    .addTag('deliveries')
    .addTag('categories')
    .addTag('addresses')
    .addTag('carts')
    .addTag('cart-items')
    .addTag('wishlists')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('marketplace-api', app, documentFactory, {
    jsonDocumentUrl: 'marketplace-api/json',
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
