import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsBoolean, IsNumber, Min } from 'class-validator';

export class QueryCategoryDto {
  @ApiProperty({ description: 'Search by category name', example: 'Electronics', })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ description: 'Filter by active status', example: true, })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isActive?: boolean;

  @ApiProperty({ description: 'Page number for pagination', example: 1, default: 1, })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @ApiProperty({ description: 'Number of items per page', example: 10, default: 10, })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  limit?: number = 10;
}