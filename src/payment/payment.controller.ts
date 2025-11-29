import { Controller, Get, Post, Body,  Headers, UseGuards, Req, HttpCode, HttpStatus, Param, ValidationPipe, UsePipes } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CheckoutDto } from './dto/Checkout.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/roles.enum';


@ApiBearerAuth()
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
  @UseGuards(JwtAuthGuard)
  @Roles(Role.BUYER)
  @Post('checkout')
  async checkOut(@Req() req, @Body() checkoutDto: CheckoutDto) {
    return this.paymentService.checkOut(req.user.id, checkoutDto);
  }


  // PAYSTACK WEBHOOK HANDLER
  @Post('ps-webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Body() payload: any,
    @Headers('x-paystack-signature') signature: string,
    @Req() req: any,
  ) {
    const rawBody = req.rawBody ? req.rawBody.toString() : JSON.stringify(payload);
    return this.paymentService.handleWebhook(payload, signature, rawBody);
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
