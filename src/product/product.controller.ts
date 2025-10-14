import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, UseGuards, Req, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Role } from 'src/auth/roles/roles.enum';
import { PaginationParams } from './decorators/pagination-params.decorator';
import type { Pagination } from './decorators/pagination-params.decorator';
import { ProductFiltersDto } from './dto/product-filters.dto';

@ApiBearerAuth('access-token')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiTags('Products')
  @Post()
  @ApiBearerAuth()
  @UseInterceptors(FilesInterceptor('images'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new product (seller only)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Samsung Galaxy S23' },
        description: { type: 'string', example: 'Latest Samsung flagship smartphone' },
        price: { type: 'number', example: 1200 },
        stock: { type: 'number', example: 50 },
        categoryId: { type: 'string', format: 'uuid', example: '8d4f28e2-f45b-4e17-a2a8-40b0b1e2a589' },
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden (seller only)' })
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.SELLER)
  async create(
    @Req() req,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productService.create(req.user.id, files, createProductDto);
  }


  // A LOGGED IN SELLER CAN VIEW ALL THEIR OWN PRODUCTS
  @ApiOperation({ summary: 'Get all products belonging to the logged-in seller' })
  @ApiBearerAuth() 
  @ApiOkResponse({
    description: 'List of products owned by the seller',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.SELLER)
  @Get('all-my-products')
  findAllSellerProduct(@Req() req) {
    return this.productService.findAllSellerProducts(req.user.id);
  }



 @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Get all products with filters and pagination',
    description: 'Retrieve products with optional filtering by name, category, price range, and sorting options'
  })
  
  // Define query parameters for Swagger UI
  // @ApiQuery({ 
  //   name: 'page', 
  //   required: false, 
  //   type: Number, 
  //   description: 'Page number (starts from 0)',
  //   example: 0 
  // })
  // @ApiQuery({ 
  //   name: 'size', 
  //   required: false, 
  //   type: Number, 
  //   description: 'Number of items per page (max 100)',
  //   example: 10
  // })
  @ApiQuery({ 
    name: 'search', 
    required: false, 
    type: String, 
    description: 'Search by product name',
    example: 'phone' 
  })
  @ApiQuery({ 
    name: 'category', 
    required: false, 
    type: String, 
    description: 'Filter by category name',
    example: 'Electronics' 
  })
  @ApiQuery({ 
    name: 'minPrice', 
    required: false, 
    type: Number, 
    description: 'Minimum price filter',
    example: 5000 
  })
  @ApiQuery({ 
    name: 'maxPrice', 
    required: false, 
    type: Number, 
    description: 'Maximum price filter',
    example: 50000 
  })
  @ApiQuery({ 
    name: 'sortBy', 
    required: false, 
    enum: ['price_asc', 'price_desc', 'name_asc', 'name_desc', 'newest'],
    description: 'Sort products by specified field',
    example: 'price_asc' 
  })

  // Define response structure for Swagger - Use existing classes!
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
    schema: {
      properties: {
        totalItems: { type: 'number', example: 150 },
        items: { type: 'array', items: { type: 'object' } }, // Ideally, reference a Product schema here
        page: { type: 'number', example: 0 },
        size: { type: 'number', example: 10 },
        totalPages: { type: 'number', example: 8 },
        hasNextPage: { type: 'boolean', example: true },
        hasPreviousPage: { type: 'boolean', example: false }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid query parameters',
  })
  @Get()
  async findAll(@Query() filters: ProductFiltersDto, @PaginationParams() pagination: Pagination ) {
    return this.productService.findAll(filters, pagination);
  }


  //  ONLY ADMIN CAN VIEW A PARTICULAR PRODUCT
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a single product by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'Product ID (UUID)', type: String })
  @ApiOkResponse({ description: 'Product retrieved successfully'})
  @ApiNotFoundResponse({ description: 'No products found' })
  @ApiForbiddenResponse({ description: 'You do not have permission to access this resource' })
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.ADMIN)
  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.productService.findOne(req.user.id, id);
  }


  // ONLY A LOGGED IN SELLER CAN UPDATE THEIR OWN PRODUCT
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product (only the logged-in seller can update their own product)' })
  @ApiParam({ name: 'id', description: 'Product ID (UUID)', type: String })
  @ApiBody({ type: UpdateProductDto })
  @ApiOkResponse({ description: 'Product updated successfully' })
  @ApiNotFoundResponse({ description: 'Invalid product' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.SELLER)
  @Patch(':id')
  update(
    @Req() req,
    @Param('id') productId: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const sellerId = req.user.id;
    return this.productService.update(sellerId, productId, updateProductDto);
  }

  
  // ONLY A LOGGED IN SELLER CAN DELETE THEIR OWN PRODUCT
  // ONLY ADMIN CAN DELETE ANY PRODUCT
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Delete a product (Seller: only their own, Admin: any product)' 
  })
  @ApiParam({ name: 'id', description: 'Product ID (UUID)', type: String })
  @ApiOkResponse({ description: 'Product deleted successfully' })
  @ApiNotFoundResponse({ description: 'Invalid product'})
  @ApiForbiddenResponse({ description: 'You are not allowed to delete this product' })
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.SELLER, Role.ADMIN)
  @Delete(':id')
  remove(@Req() req, @Param('id') productId: string) {
    return this.productService.remove(req.user.id, productId, req.user.roles);
  }


}
