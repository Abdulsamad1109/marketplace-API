import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum Role {
  ADMIN = 'admin',
  BUYER = 'buyer',
}

export class CreateUserDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com'})
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123',})
  @IsString()
  password: string;

  @ApiProperty({
  enum: Role,
  isArray: true,
  example: [Role.ADMIN, Role.BUYER],
  description: 'Roles assigned to the user',
})
  @IsArray()
  @ArrayNotEmpty()
  @IsNotEmpty()
  @IsEnum(Role, {each: true})
  roles: Role[]
}
