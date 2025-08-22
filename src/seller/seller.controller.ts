import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { SellerService } from './seller.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  // seller creation is implemented in AuthService, 
  // so this controller is focused on seller management


  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get seller profile (JWT protected)' })
  @ApiResponse({ status: 200, description: 'Seller profile returned.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  userProfile(@Req() req) {
    return req.user;
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
