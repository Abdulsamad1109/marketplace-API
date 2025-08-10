
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService, 
    private userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET')!,
    });
  }

  async validate(payload: any) {
  // fetch other user properties after validating the JWT
  const user =  await this.userService.findOne(payload.sub);

  // return the full user object without paassword
    return {
    userId: user.id,
    email: user.email,
    firstName: user.firstName, 
    lastName: user.lastName,
    roles: user.roles};
  }
}


// hjghfxcgv 