import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, UseGuards, Req, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Role } from 'src/auth/roles/roles.enum';
import { Product } from './entities/product.entity';

@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard,RolesGuard)
@Roles(Role.SELLER)
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
  @Get('all-my-products')
  findAllSellerProduct(@Req() req) {
    return this.productService.findAllSellerProducts(req.user.id);
  }



  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all products (Admin only)' })
  @ApiOkResponse({ description: 'List of all products'})
  @ApiForbiddenResponse({ description: 'You do not have permission to access this resource' })
  @Get()
  findAll(@Query() query) {
    return this.productService.findAllProducts();
  }


  //  ONLY ADMIN CAN VIEW A PARTICULAR PRODUCT
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a single product by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'Product ID (UUID)', type: String })
  @ApiOkResponse({ description: 'Product retrieved successfully'})
  @ApiNotFoundResponse({ description: 'No products found' })
  @ApiForbiddenResponse({ description: 'You do not have permission to access this resource' })
  @Get(':id')
  @Roles(Role.ADMIN)
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
  @Delete(':id')
  @Roles(Role.SELLER, Role.ADMIN)
  remove(@Req() req, @Param('id') productId: string) {
    return this.productService.remove(req.user.id, productId, req.user.roles);
  }


}
