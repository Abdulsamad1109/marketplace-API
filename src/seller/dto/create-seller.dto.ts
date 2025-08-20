import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsEmail, IsEnum, IsNotEmpty, IsString, Matches, ValidateNested } from 'class-validator';
import { Role } from 'src/auth/roles/roles.enum';
import { CreateAddressDto } from 'src/address/dto/create-address.dto';
import { Type } from 'class-transformer';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

export class CreateSellerDto {

  @ApiProperty({ type: CreateUserDto, description: 'User details for the seller' })
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;

  @ApiProperty({ type: 'string', description: 'Business name of the seller' })
  @IsString()
  @IsNotEmpty()
  businessName: string;

  @ApiProperty({ type: 'string', description: 'Type of business' })
  @IsString()
  @IsNotEmpty()
  businessType: string;

  @ApiProperty({ type: 'string', description: 'Phone number of the seller' })
  @Matches(/^\d{11}$/, { message: 'Phone number must be exactly 11 digits' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ type: [CreateAddressDto], description: 'Addresses of the seller' })
  @ValidateNested({ each: true })
  @Type(() => CreateAddressDto)
  @IsArray()
  addresses: CreateAddressDto[];  

}