import { IsString, IsNumber, IsOptional, IsPositive, IsUrl } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @IsPositive()
  price: number;

  // image URL or file path
  @IsOptional()
  @IsString()
  image?: string;
}
