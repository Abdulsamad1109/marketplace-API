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

  @ApiProperty({ example: "GreenTech Solutions" })
  @IsString()
  @IsNotEmpty()
  businessName: string;

  @ApiProperty({ example: "Renewable Energy" })
  @IsString()
  @IsNotEmpty()
  businessType: string;

  @ApiProperty({ example: "08098765432" })
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