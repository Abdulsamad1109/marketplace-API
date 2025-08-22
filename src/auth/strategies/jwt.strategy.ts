
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { SellerService } from 'src/seller/seller.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Seller } from 'src/seller/entities/seller.entity';
import { Repository } from 'typeorm';
import { Role } from '../roles/roles.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService, 
    private userService: UserService,
    private readonly sellerService: SellerService,
    @InjectRepository(Seller) private readonly sellerRepository: Repository<Seller>
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

  // get seller id
  if (user.roles.includes(Role.SELLER)) {
    const sellerProfile = await this.sellerRepository.findOne({ where: { user: { id: user.id } }, relations: ['user', 'addresses'] });
  return sellerProfile
  }
  

  // return the full user object without paassword and timestamps
  // const { createdAt, updatedAt, ...rest} = user;
  return 'good boy';
  
  }
}


// hjghfxcgv 