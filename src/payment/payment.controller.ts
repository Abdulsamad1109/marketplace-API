import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { InitializePaymentDto } from './dto/initialize-payment.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/roles.enum';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}


  // INITIALIZE PAYMENT
  @ApiOperation({ summary: 'Initialize a new payment' })
  @ApiResponse({
    status: 201,
    description: 'Payment initialized successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to initialize payment',
  })
  @Roles(Role.BUYER)
  @Post('initialize')
  async initializePayment(@Req() req, @Body() initializePaymentDto: InitializePaymentDto) {
    return this.paymentService.initializePayment(req.user.id, initializePaymentDto);
  }

  // VERIFY PAYMENT
  @ApiOperation({ summary: 'Verify a payment transaction' })
  @ApiResponse({
    status: 200,
    description: 'Payment verified successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Transaction not found',
  })
  @Get('verify/:reference')
  async verifyPayment(@Param('reference') reference: string) {
    return this.paymentService.verifyPayment(reference);
  }


}
