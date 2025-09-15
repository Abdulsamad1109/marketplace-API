import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'iPhone 15 Pro', description: 'The name of the product' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Latest Apple flagship phone', description: 'Detailed description of the product' })
  @IsString()
  description: string;

  @ApiProperty({ example: 1499.99, description: 'Price of the product in USD' })
  @IsNumber()
  @IsPositive()
  price: number;


}
