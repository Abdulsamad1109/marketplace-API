import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './guards/local-aith.guard';

@Controller('auth')
export class AuthController {
  
    constructor(private authService: AuthService) {}

@UseGuards(LocalAuthGuard)
@Post('login')
 async  login(@Req() req) {
    return req.user;
  }
}


// @UseGuards(LocalAuthGuard)
// @Post('auth/logout')
// async logout(@Request() req) {
//   return req.logout();
// }


