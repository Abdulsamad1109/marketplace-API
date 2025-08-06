import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, IsUUID } from 'class-validator';

export enum Role {
  ADMIN = 'admin',
  BUYER = 'buyer',
}

export class CreateUserDto {
  @ApiProperty({ example: 'John', description: 'First name of the user' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Email address of the user' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'hashedpassword123', description: 'Hashed password of the user' })
  @IsString()
  password: string;

  @ApiProperty({ enum: Role, example: Role.BUYER, description: 'Role assigned to the user' })
  @IsEnum(Role)
  roles: Role;

  @ApiProperty({ example: '2025-08-06T17:12:45.000Z', description: 'Date the user was created' })
  createdAt: Date;

  @ApiProperty({ example: '2025-08-06T17:12:45.000Z', description: 'Date the user was last updated' })
  updatedAt: Date;
  userRepository: any;
}
