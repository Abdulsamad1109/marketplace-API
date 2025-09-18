import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, IsOptional, IsUUID, IsArray, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Samsung Galaxy S23', description: 'Name of the product' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Latest Samsung flagship phone', description: 'Detailed description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 1200, description: 'Price of the product in USD' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 50, description: 'Available stock for this product' })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({ example: 'uuid-of-category-or-subcategory', description: 'Category ID (parent or subcategory)' })
  @IsUUID()
  categoryId: string;

  @ApiProperty({
    example: ['uuid-of-image1', 'uuid-of-image2'],
    description: 'List of image IDs associated with the product',
  })
  @IsArray()
  @IsUUID("4", { each: true })
  imageIds: string[];

  @ApiProperty({ example: 'uuid-of-seller', description: 'ID of the seller who owns this product' })
  @IsUUID()
  sellerId: string;
}
