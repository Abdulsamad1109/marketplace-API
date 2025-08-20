import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBody } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { CreateSellerDto } from 'src/seller/dto/create-seller.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @UseGuards(LocalAuthGuard)
  // @ApiOperation({ summary: 'user login' }) // short description
  // @ApiBody({ type: LoginDto }) // expected request body format
  // @ApiOkResponse({ description: 'JWT access token and user data' })
  // @Post('login')
  // async login(@Req() req) {
  //   return this.authService.login(req.user);
  // }


  @ApiOperation({ summary: 'Create a new seller' })
  @ApiBody({ type: CreateSellerDto })
  @Post('seller')
  createSeller(@Body() sellerDto: CreateSellerDto) {
    return this.authService.createSeller(sellerDto);
  }
}





// @UseGuards(LocalAuthGuard)
// @Post('auth/logout')
// async logout(@Request() req) {
//   return req.logout();
// }


