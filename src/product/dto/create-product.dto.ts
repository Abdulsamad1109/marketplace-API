import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNumber, IsNotEmpty, IsUUID, IsArray, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Samsung Galaxy S23', description: 'Name of the product' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Latest Samsung flagship phone', description: 'Detailed description' })
  @IsString()
  description?: string;

  @ApiProperty({ example: 1200, description: 'Price of the product in NGN' })
  @Type(() => Number) // converts string to number
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 50, description: 'Available stock for this product' })
  @Type(() => Number) // converts string to number
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({ example: 'uuid-of-category-or-subcategory', description: 'Category ID (parent or subcategory)' })
  @IsUUID()
  categoryId: string;

  // SellerId is derived from the authenticated user
}
