import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiBearerAuth, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Role } from 'src/auth/roles/roles.enum';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Order } from './entities/order.entity';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  //


  // GET ALL ORDERS
  @Roles(Role.BUYER)
  @Get('my-orders')
  @ApiOperation({ 
    summary: 'Get all orders for the authenticated buyer',
    description: 'Retrieves all orders placed by the currently authenticated buyer with order items included'
  })
  @ApiOkResponse({
    description: 'Orders retrieved successfully',
    type: [Order],
    schema: {
      example: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          buyerId: '123e4567-e89b-12d3-a456-426614174001',
          adminId: '123e4567-e89b-12d3-a456-426614174002',
          totalAmount: 299.99,
          status: 'pending',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
          orderItems: [
            {
              id: '123e4567-e89b-12d3-a456-426614174003',
              orderId: '123e4567-e89b-12d3-a456-426614174000',
              productId: '123e4567-e89b-12d3-a456-426614174004',
              quantity: 2,
              price: 149.99
            }
          ]
        }
      ]
    }
  })
  @ApiUnauthorizedResponse({ 
    description: 'User is not authenticated',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized'
      }
    }
  })
  @ApiForbiddenResponse({ 
    description: 'User does not have the required BUYER role',
    schema: {
      example: {
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden'
      }
    }
  })
  findAll(@Req() req) {
    return this.orderService.findAllBuyerOrders(req.user.id);
  }


  // FIND ONE ORDER BY ADMIN ID
  @Roles(Role.ADMIN)
  @Get(':id')
  @ApiOperation({ 
    summary: 'Get a specific order by ID (Admin only)',
    description: 'Retrieves a single order by its ID. Only accessible by authenticated admin users. Includes order items and related data.'
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier (UUID) of the order',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiOkResponse({
    description: 'Order retrieved successfully',
    type: Order,
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        buyerId: '123e4567-e89b-12d3-a456-426614174001',
        adminId: '123e4567-e89b-12d3-a456-426614174002',
        totalAmount: 299.99,
        status: 'pending',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
        orderItems: [
          {
            id: '123e4567-e89b-12d3-a456-426614174003',
            orderId: '123e4567-e89b-12d3-a456-426614174000',
            productId: '123e4567-e89b-12d3-a456-426614174004',
            quantity: 2,
            price: 149.99,
            product: {
              id: '123e4567-e89b-12d3-a456-426614174004',
              name: 'Sample Product',
              description: 'Product description',
              price: 149.99
            }
          }
        ]
      }
    }
  })
  @ApiUnauthorizedResponse({ 
    description: 'User is not authenticated',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized'
      }
    }
  })
  @ApiForbiddenResponse({ 
    description: 'User does not have the required ADMIN role',
    schema: {
      example: {
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden'
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'Order not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Order with ID 123e4567-e89b-12d3-a456-426614174000 not found',
        error: 'Not Found'
      }
    }
  })
  findOne(@Req() req, @Param('id') orderId: string) {
    return this.orderService.findOneByAdminId(req.user.id, orderId);
  }




 
}
