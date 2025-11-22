import { Controller, Get, Post, Body,  Headers, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CheckoutDto } from './dto/Checkout.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/roles.enum';
import { PaystackWebhookDto } from './dto/webhook-event.dto';

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
  @Post('checkout')
  async checkOut(@Req() req, @Body() checkoutDto: CheckoutDto) {
    return this.paymentService.checkOut(req.user.id, checkoutDto);
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle Paystack webhook events' })
  async handleWebhook(
    @Body() payload: PaystackWebhookDto,
    @Headers() headers: Record<string, string>,
  ) {
    const signature = headers['x-paystack-signature'];
    return this.paymentService.handleWebhook(payload, signature);
  }


  // // VERIFY PAYMENT  

  // @ApiOperation({ summary: 'Verify a payment transaction' })
  // @ApiResponse({
  //   status: 200, 
  
  //   description: 'Payment verified successfully',
  // })
  // @ApiResponse({
  //   status: 404,
  //   description: 'Transaction not found',
  // })
  // @Get('verify/:reference')
  // async verifyPayment(@Param('reference') reference: string) {
  //   return this.paymentService.verifyPayment(reference);
  // }


}
