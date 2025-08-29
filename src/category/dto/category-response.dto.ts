import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({ description: 'Category ID', example: 'uuid-string-here', })
  id: string;

  @ApiProperty({ description: 'Category name', example: 'Electronics', })
  name: string;

  @ApiPropertyOptional({ description: 'Category description', example: 'Electronic devices and accessories', })
  description?: string;

  @ApiPropertyOptional({ description: 'Category image URL', example: 'https://example.com/images/electronics.jpg', })
  image?: string;

  @ApiProperty({ description: 'Whether the category is active', example: true, })
  isActive: boolean;

  @ApiPropertyOptional({ description: 'Parent category ID', example: 'uuid-string-here', })
  parentId?: string;

  @ApiProperty({ description: 'Creation date', example: '2023-01-01T00:00:00.000Z', })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date', example: '2023-01-01T00:00:00.000Z', })
  updatedAt: Date;
}