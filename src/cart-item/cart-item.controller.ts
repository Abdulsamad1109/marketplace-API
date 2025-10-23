import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Role } from 'src/auth/roles/roles.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { CartItem } from './entities/cart-item.entity';

@ApiBearerAuth()
@Controller('cart-item')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  // CREATE CART ITEM - ADD TO CART
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BUYER)
  @Post()
  @ApiOperation({ summary: 'Add a product to the buyer’s active cart' })
  @ApiBody({
    description: 'Data required to add an item to the cart',
    type: CreateCartItemDto,
    examples: {
      example1: {
        summary: 'Example request body',
        value: {
          productId: 'bfa3e7ad-74d4-4e7e-8f4b-74b122a6c6f9',
          quantity: 2,
          priceAtTime: 15000,
          total: 30000,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Product added to cart successfully.',
    type: CartItem,
  })
  @ApiResponse({ status: 400, description: 'Invalid product or request data.' })
  @ApiResponse({ status: 404, description: 'Buyer or product not found.' })
  async addToCart(@Req() req, @Body() createCartItemDto: CreateCartItemDto) {
    return await this.cartItemService.addToCart(req.user.id, createCartItemDto);
  }



  // GET ALL CART ITEMS (ADMIN ONLY)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Get all cart items (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'List of all cart items retrieved successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized. Missing or invalid token.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Only admins can access this.' })
  async findAll(@Req() req) {
    return await this.cartItemService.findAll(req.user.id);
  }



  // GET SINGLE CART ITEM BY ID (FOR THE LOGGED-IN BUYER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get(':id')
  @ApiOperation({ summary: 'Get a single cart item by its ID for the logged-in buyer' })
  @ApiParam({
    name: 'id',
    description: 'The unique ID of the cart item to retrieve',
    example: 'd3f9c17c-872b-4d6c-b45a-0cdd229b23d9',
  })
  @ApiResponse({
    status: 200,
    description: 'Cart item quantity updated successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Cart item not found or does not belong to this buyer.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Missing or invalid token.',
  })
  async findOne(@Req() req, @Param('id') id: string) {
    return await this.cartItemService.findOne(req.user.id, id);
  }



  // UPDATE CART ITEM QUANTITY (INCREASE OR DECREASE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BUYER)
  @Patch(':id')
  @Patch(':id')
  @ApiOperation({ summary: 'Increase or decrease a cart item quantity' })
  @ApiParam({ name: 'id', description: 'Cart item ID' })
  @ApiBody({ type: UpdateCartItemDto })
  @ApiResponse({ status: 200, description: 'Cart item quantity updated successfully' })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  update(@Req() req, 
  @Param('id') cartItemId: string, 
  @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartItemService.updateQuantity(req.user.id, cartItemId, updateCartItemDto);
  }


  // DELETE CART ITEM
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.BUYER)
  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    return this.cartItemService.remove(req.user.id, id);
  }
}
