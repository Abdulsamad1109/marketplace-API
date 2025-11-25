import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Role } from 'src/auth/roles/roles.enum';
import { Roles } from 'src/auth/roles/roles.decorator';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  //


    // GET ALL ORDERS
  @Roles(Role.BUYER)
  @Get('my-orders')
  findAll(@Req() req) {
    return this.orderService.findAllBuyerOrders(req.user.id);
  }
  

  // FIND ONE ORDER BY ADMIN ID
  @Roles(Role.ADMIN)
  @Get(':id')
  findOne(@Req() req, @Param('id') orderId: string) {
    return this.orderService.findOneByAdminId(req.user.id, orderId);
  }




 
}
