import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsEmail, IsEnum, IsNotEmpty, IsString, Matches, ValidateNested } from 'class-validator';
import { Role } from 'src/auth/roles/roles.enum';
import { CreateAddressDto } from 'src/address/dto/create-address.dto';
import { Type } from 'class-transformer';

export class CreateSellerDto {

  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com'})
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123',})
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
  enum: Role,
  isArray: true,
  example: [Role.ADMIN, Role.BUYER, Role.SELLER],
  description: 'Roles assigned to the user',
  })
  @IsArray()
  @ArrayNotEmpty()  
  @IsNotEmpty()
  @IsEnum(Role, {each: true})
  roles: Role[]

  @ApiProperty({ type: 'string', description: 'Business name of the seller' })
  @IsString()
  @IsNotEmpty()
  businessName: string;

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