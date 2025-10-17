import { ApiProperty } from '@nestjs/swagger';
import { CartItemResponseDto } from 'src/cart-item/dto/cart-item-response.dto';

export class CartResponseDto {
  @ApiProperty({
    description: 'The UUID of the cart',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The UUID of the buyer',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  buyerId: string;

  @ApiProperty({
    description: 'The status of the cart',
    example: 'active',
  })
  status: string;

  @ApiProperty({
    description: 'The cart items',
    type: [CartItemResponseDto],
  })
  cartItems: CartItemResponseDto[];

  @ApiProperty({
    description: 'The date the cart was created',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date the cart was last updated',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt: Date;
}