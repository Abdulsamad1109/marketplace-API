import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsBoolean, IsNumber, Min, IsPositive } from 'class-validator';

export class QueryProductDto {
  @ApiPropertyOptional({ description: 'Search by category name', example: 'Electronics', })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by active status', example: true, })
  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Page number for pagination', example: 1, default: 1, })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Number of items per page', example: 10, default: 10, })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  limit?: number = 10;
}