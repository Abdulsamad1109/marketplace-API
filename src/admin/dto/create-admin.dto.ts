import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MinLength, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from 'src/auth/roles/roles.enum';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Type } from 'class-transformer';

export class CreateAdminDto {
  
  @ApiProperty({ type: CreateUserDto, description: 'User details for the admin' })
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;

  @ApiProperty({ example: "08098765432" })
  @Matches(/^\d{11}$/, { message: 'Phone number must be exactly 11 digits' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}

