import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';
import { Role } from 'src/auth/roles/roles.enum';

export class CreateSellerDto {

  @ApiProperty({ type: 'string', description: 'Business name of the seller' })
  @IsString()
  @IsNotEmpty()
  businessName: string;

  @ApiProperty({ type: 'string', description: 'Owner name of the business' })
  @IsString()
  @IsNotEmpty()
  ownerName: string;

  @ApiProperty({ type: 'string', format: 'email', description: 'Email address of the seller' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ type: 'string', description: 'Phone number of the seller' })
  @Matches(/^\d{11}$/, { message: 'Phone number must be exactly 11 digits' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ type: 'string', description: 'Password for seller account' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ type: 'string', description: 'Address of the seller, where the goods are stored for shipping' })
  @IsString()
  @IsNotEmpty()
  address: string;

}