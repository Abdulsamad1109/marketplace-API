import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Adjust path as needed

@ApiTags('Carts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new cart for logged-in buyer' })
  @ApiResponse({ status: 201, description: 'Cart created successfully' })
  async create(@Request() req, @Body() createCartDto: CreateCartDto) {
    return await this.cartService.create(req.user.id, createCartDto);
  }


  
}