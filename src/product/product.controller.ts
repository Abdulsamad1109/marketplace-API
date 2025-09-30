import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, UseGuards, Req } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
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


  // A LOGGED IN SELLER CAN VIEW ALL HIS/HER PRODUCTS
  @ApiTags('Products') // groups under "Products"
  @ApiOperation({ summary: 'Get all products belonging to the logged-in seller' })
  @ApiBearerAuth() // shows lock icon in Swagger (JWT auth required)
  @ApiOkResponse({
    description: 'List of products owned by the seller',
    type: [Product], // replace with your Product DTO/Entity
  })
  @Get('all-my-products')
  findAllSellerProduct(@Req() req) {
    return this.productService.findAllSellerProducts(req.user.id);
  }


  // ONLY ADMIN CAN VIEW ALL PRODUCTS
  @Roles(Role.ADMIN)
  @Get()
  findAll(@Req() req) {
    return this.productService.findAllProducts(req.user.id);
  }


  //  ONLY ADMIN CAN VIEW A PARTICULAR PRODUCT
  @Roles(Role.ADMIN)
  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.productService.findOne(req.user.id, id);
  }


  // ONLY A LOGGED IN SELLER CAN UPDATE HIS/HER PRODUCT
  @Patch(':id')
    update(
      @Req() req,
      @Param('id') ProductId: string,
      @Body() updateProductDto: UpdateProductDto,
    ) {
      const sellerId = req.user.id;
      return this.productService.update(sellerId, ProductId, updateProductDto);
    }

  
  // ONLY A LOGGED IN SELLER CAN DELETE HIS/HER PRODUCT
  // ONLY ADMIN CAN DELETE ANY PRODUCT
  @Roles(Role.SELLER, Role.ADMIN)
  @Delete(':id')
  remove(@Req() req, @Param('sellerId') sellerId: string, @Param('id') id: string) {
    return this.productService.remove(req.user.id, sellerId, id);
  }
}
