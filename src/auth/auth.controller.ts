import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBody } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { CreateSellerDto } from 'src/seller/dto/create-seller.dto';
import { CreateBuyerDto } from 'src/buyer/dto/create-buyer.dto';
import { CreateAdminDto } from 'src/admin/dto/create-admin.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'user login' }) 
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ description: 'JWT access token and user data' })
  @Post('login')
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  @ApiOperation({ summary: 'Create a new seller' })
  @ApiBody({ type: CreateSellerDto })
  @ApiOkResponse({ description: 'JWT access token and user data' })
  @Post('seller')
  createSeller(@Body() sellerDto: CreateSellerDto, @Req() req) {
    return this.authService.createSeller(sellerDto, req.user);
  }

  @ApiOperation({ summary: 'Create a new buyer' })
  @ApiBody({ type: CreateBuyerDto })
  @ApiOkResponse({ description: 'JWT access token and user data' })
  @Post('buyer')
  createBuyer(@Body() buyerDto: CreateBuyerDto, @Req() req) {
    return this.authService.createBuyer(buyerDto, req.user);
  }

  @ApiOperation({ summary: 'Create a new admin' })
  @ApiBody({ type: CreateAdminDto })
  @ApiOkResponse({ description: 'JWT access token and user data' })
  @Post('admin')
  createAdmin(@Body() adminDto: CreateAdminDto, @Req() req) {
    return this.authService.createAdmin(adminDto, req.user);
  }


}





// @UseGuards(LocalAuthGuard)
// @Post('auth/logout')
// async logout(@Request() req) {
//   return req.logout();
// }


