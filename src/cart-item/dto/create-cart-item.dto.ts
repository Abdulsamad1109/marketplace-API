import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsInt, IsNumber, Min } from 'class-validator';

export class CreateCartItemDto {
  @ApiProperty({
    description: 'The UUID of the cart',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  cartId: string;

  @ApiProperty({
    description: 'The UUID of the product',
    example: '987e6543-e21b-12d3-a456-426614174000',
  })
  @IsUUID()
  productId: string;

  @ApiProperty({
    description: 'The quantity of the product',
    example: 2,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'The price of the product at the time of adding to cart',
    example: 29.99,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  priceAtTime: number;

  @ApiProperty({
    description: 'The total price (quantity * priceAtTime)',
    example: 59.98,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  total: number;
}