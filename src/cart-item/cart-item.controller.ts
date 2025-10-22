import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Role } from 'src/auth/roles/roles.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';

@ApiBearerAuth()
@Controller('cart-item')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BUYER)
  @Post()
  addToCart(@Req() req,@Body() createCartItemDto: CreateCartItemDto) {
    return this.cartItemService.addToCart(req.user.id, createCartItemDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)  
  @Get()
  findAll(@Req() req) {
    return this.cartItemService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    return this.cartItemService.findOne(req.user.id, id);
  }

  @Patch(':cartItemId/update-quantity')
  @ApiOperation({ summary: 'Increase or decrease quantity of a cart item' })
  @ApiParam({ name: 'cartItemId', description: 'ID of the cart item to update' })
  @ApiResponse({ status: 200, description: 'Cart item quantity updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid request or quantity less than 1.' })
  @ApiResponse({ status: 404, description: 'Buyer or cart item not found.' })
  update(@Req() req, 
  @Param('id') cartItemId: string, 
  @Body() updateCartItemDto: UpdateCartItemDto,
  @Body() action: 'increase' | 'decrease',
  ) {
    return this.cartItemService.updateQuantity(req.user.id, cartItemId, updateCartItemDto, action);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartItemService.remove(id);
  }
}
