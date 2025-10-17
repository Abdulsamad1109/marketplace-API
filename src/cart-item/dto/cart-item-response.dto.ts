import { ApiProperty } from '@nestjs/swagger';

export class CartItemResponseDto {
  @ApiProperty({
    description: 'The UUID of the cart item',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The UUID of the cart',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  cartId: string;

  @ApiProperty({
    description: 'The UUID of the product',
    example: '987e6543-e21b-12d3-a456-426614174000',
  })
  productId: string;

  @ApiProperty({
    description: 'The quantity of the product',
    example: 2,
  })
  quantity: number;

  @ApiProperty({
    description: 'The price of the product at the time of adding to cart',
    example: 29.99,
  })
  priceAtTime: number;

  @ApiProperty({
    description: 'The total price (quantity * priceAtTime)',
    example: 59.98,
  })
  total: number;

  @ApiProperty({
    description: 'The date the cart item was created',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date the cart item was last updated',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt: Date;
}