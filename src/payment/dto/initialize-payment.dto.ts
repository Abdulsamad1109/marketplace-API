import { IsEmail, IsNumber, IsString, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InitializePaymentDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 5000, description: 'Amount in Naira' })
  @IsNumber()
  @Min(100)
  amount: number;

  @ApiProperty({ example: 'Payment for Order #12345', required: false })
  @IsString()
  @IsOptional()
  metadata?: string;

  @ApiProperty({ example: 'https://yourapp.com/payment/callback', required: false })
  @IsString()
  @IsOptional()
  callback_url?: string;
}
