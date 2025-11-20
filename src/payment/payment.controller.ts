import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { InitializePaymentDto } from './dto/initialize-payment.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';


@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}


  @Post('initialize')
  @ApiOperation({ summary: 'Initialize a new payment' })
  @ApiResponse({
    status: 201,
    description: 'Payment initialized successfully',
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to initialize payment',
  })
  async initializePayment(@Body() initializePaymentDto: InitializePaymentDto) {
    return this.paymentService.initializePayment(initializePaymentDto);
  }
  

  @Get('verify/:reference')
  @ApiOperation({ summary: 'Verify a payment transaction' })
  @ApiResponse({
    status: 200,
    description: 'Payment verified successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Transaction not found',
  })
  async verifyPayment(@Param('reference') reference: string) {
    return this.paymentService.verifyPayment(reference);
  }


}
