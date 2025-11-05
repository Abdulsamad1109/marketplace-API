import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CartResponseDto } from './dto/cart-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Adjust path as needed
import { Role } from 'src/auth/roles/roles.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';

@ApiTags('Carts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}


  // GET ALL CARTS - ADMIN ONLY
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Get all carts (admin only)' })
  @ApiResponse({ status: 200, description: 'List of carts', type: [CartResponseDto] })
  async findAll( @Request() req) {
    return await this.cartService.findAll(req.user.id);
  }


  // GET ACTIVE CART FOR THE LOGGED IN BUYER
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BUYER)
  @ApiOperation({ summary: 'Get logged-in buyer\'s cart' })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully', type: CartResponseDto })
  @Get('my-cart')
  async getMyCart(@Request() req) {
    return await this.cartService.getBuyerActiveCart(req.user.id);
  }

  // UPDATE CART FOR LOGGED IN BUYER
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.BUYER)
  // @ApiOperation({ summary: 'Update cart details for logged-in buyer' })
  // @ApiResponse({ status: 200, description: 'Cart updated successfully', type: CartResponseDto })
  // @Patch()
  // async update(@Request() req, @Body() updateCartDto: UpdateCartDto) {
  //   return await this.cartService.update(req.user.id, updateCartDto);
  // }

  // DELETE CART FOR LOGGED IN BUYER
  // @ApiOperation({ summary: 'Delete cart' })
  // @ApiResponse({ status: 200, description: 'Cart deleted successfully' })
  // @ApiResponse({ status: 404, description: 'Cart not found' })
  // @Delete(':id')
  // async remove(@Param('id') id: string, @Request() req) {
  //   return await this.cartService.remove(req.user.id, id);
  // }


}