import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, UseGuards, Req } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Role } from 'src/auth/roles/roles.enum';

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

  @Get()
  findAll(@Req() req) {
    return this.productService.findAll(req.user.id);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.productService.findOne(id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
  //   return this.productService.update(id, updateProductDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.productService.remove(id);
  // }
}
