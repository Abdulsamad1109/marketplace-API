import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateCartDto {

  @ApiProperty({
    description: 'The status of the cart',
    example: 'active',
    default: 'active',
    required: false,
  })
  @IsString()
  @IsOptional()
  status?: string;
}