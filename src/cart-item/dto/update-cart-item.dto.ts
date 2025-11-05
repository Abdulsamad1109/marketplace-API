import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartItemDto {
  @ApiProperty({
    description: 'Choose whether to increase or decrease the cart item quantity',
    example: 'increase',
    enum: ['increase', 'decrease'],
  })
  @IsEnum(['increase', 'decrease'])
  action: 'increase' | 'decrease';
}
