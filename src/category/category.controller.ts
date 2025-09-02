import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CategoryResponseDto } from './dto/category-response.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/roles.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard,RolesGuard)
@Roles(Role.ADMIN)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}


@ApiOperation({ 
    summary: 'Create a new category',
    description: 'Create a new category. Admin access required.'
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Category created successfully',
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Admin access required',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Category with this name already exists',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.create(createCategoryDto);
  }

  @ApiOperation({ summary: 'Get all categories with pagination and filtering' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by category name',
    example: 'Electronics',
    type: String,
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    description: 'Filter by active status',
    example: true,
    type: Boolean,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    example: 1,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
    example: 10,
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Categories retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/CategoryResponseDto' },
        },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            page: { type: 'number' },
            limit: { type: 'number' },
            totalPages: { type: 'number' },
          },
        },
      },
    },
  })
  @Get()
  findAll(@Query() queryDto: QueryCategoryDto) {
    return this.categoryService.findAll(queryDto);
  }

  @ApiOperation({ summary: 'Get a category by ID' })
  @ApiParam({
    name: 'id',
    description: 'Category ID',
    example: 'uuid-string-here',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Category retrieved successfully',
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Category not found',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

    @ApiOperation({ summary: 'Update a category' })
  @ApiParam({
    name: 'id',
    description: 'Category ID',
    example: 'uuid-string-here',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Category updated successfully',
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Category not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Category with this name already exists',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @ApiOperation({ summary: 'Delete a category' })
  @ApiParam({
    name: 'id',
    description: 'Category ID',
    example: 'uuid-string-here',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Category deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Category not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cannot delete category with associated products or subcategories',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
