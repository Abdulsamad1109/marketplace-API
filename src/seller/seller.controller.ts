import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SellerService } from './seller.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';


@ApiTags('seller')
@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @ApiOperation({ summary: 'Create a new seller' })
  @ApiResponse({ status: 201, description: 'Seller created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Post()
  create(@Body() createSellerDto: CreateSellerDto) {
    return this.sellerService.create(createSellerDto);
  }

  @ApiOperation({ summary: 'Get all sellers' })
  @ApiResponse({ status: 200, description: 'List of sellers.' })
  @Get()
  findAll() {
    return this.sellerService.findAll();
  }

  @ApiOperation({ summary: 'Get a seller by ID' })
  @ApiResponse({ status: 200, description: 'Seller found.' })
  @ApiResponse({ status: 404, description: 'Seller not found.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sellerService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a seller by ID' })
  @ApiResponse({ status: 200, description: 'Seller updated successfully.' })
  @ApiResponse({ status: 404, description: 'Seller not found.' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSellerDto: UpdateSellerDto) {
    return this.sellerService.update(id, updateSellerDto);
  }

  @ApiOperation({ summary: 'Delete a seller by ID' })
  @ApiResponse({ status: 200, description: 'Seller deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Seller not found.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sellerService.remove(id);
  }
}
