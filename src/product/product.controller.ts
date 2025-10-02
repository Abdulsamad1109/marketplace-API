import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, UseGuards, Req } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
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

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a product with at least 1 image and maximum of 4 images (logged-in-seller only)' })
  @ApiBody({
  schema: {
    type: 'object',
    properties: {
      name: { type: 'string', example: 'Samsung Galaxy S23' },
      description: { type: 'string', example: 'Latest Samsung flagship' },
      price: { type: 'number', example: 1200 },
      stock: { type: 'number', example: 50 },
      categoryId: { type: 'string', format: 'uuid' },
      images: {
        type: 'array',
        items: { type: 'string', format: 'binary' },
      },
    },
  },
})

  async create(
    @Req() req,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productService.create(req.user.id, files, createProductDto);
  }


  // A LOGGED IN SELLER CAN VIEW ALL THEIR OWN PRODUCTS
  @ApiTags('Products') // groups under "Products"
  @ApiOperation({ summary: 'Get all products belonging to the logged-in seller' })
  @ApiBearerAuth() // shows lock icon in Swagger (JWT auth required)
  @ApiOkResponse({
    description: 'List of products owned by the seller',
    // type: [Product], 
  })
  @Get('all-my-products')
  findAllSellerProduct(@Req() req) {
    return this.productService.findAllSellerProducts(req.user.id);
  }


  // ONLY ADMIN CAN VIEW ALL PRODUCTS
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all products (Admin only)' })
  @ApiOkResponse({ description: 'List of all products'})
  @ApiForbiddenResponse({ description: 'You do not have permission to access this resource' })
  @Get()
  @Roles(Role.ADMIN)
  findAll(@Req() req) {
    return this.productService.findAllProducts(req.user.id);
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
  @ApiForbiddenResponse({ description: 'You do not have permission to access this resource' })
  @Delete(':id')
  @Roles(Role.SELLER, Role.ADMIN)
  remove(@Req() req, @Param('id') productId: string) {
    console.log('User Roles:', req.user.roles); // Debugging line
    return this.productService.remove(req.user.id, productId, req.user.roles);
  }


}
