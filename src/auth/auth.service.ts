import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { CreateSellerDto } from 'src/seller/dto/create-seller.dto';
import { Seller } from 'src/seller/entities/seller.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {

  constructor(
    private userService: UserService ,
    private jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Seller) private readonly sellerRepository: Repository<Seller>
      
  ) {}
  

  async createSeller(sellerDto: CreateSellerDto){
    const existingUser = await this.userRepository.findOne({ where: { email: sellerDto.email } });
    if (existingUser) throw new NotFoundException('User with this email already exists');
    const hashedPassword = await bcrypt.hash(sellerDto.password, 10);

    // Create a new user entity
    const newUser = this.userRepository.create({
      firstName: sellerDto.firstName,
      lastName: sellerDto.lastName,
      email: sellerDto.email,
      password: hashedPassword,
      roles: sellerDto.roles,
    });
    await this.userRepository.save(newUser);

    // Create a new seller entity
    // const newSeller = this.sellerRepository.create({
    //   user: newUser,
    //   businessName: sellerDto.businessName,
    //   businessType: sellerDto.businessType,
    //   phoneNumber: sellerDto.phoneNumber,
    // }
    // await this.seller.createSeller(newSeller);
  }

























    //       async validateUser(email: string, password: string) {
            
    //     // checks if the email exists in the DB
    //     const user = await this.userService.findOneByEmail(email)
    //     if (!user) throw new UnauthorizedException('Invalid credentials');

    //     // checks if the password is correct
    //     if (user && (await bcrypt.compare(password, user.password))) {
    //         const { password, ...result } = user;
    //         return result;
    //     }
    //     throw new UnauthorizedException('Invalid credentials');

    // }


      

//     async login(user: any): Promise<{ access_token: string }> {
//         const payload = { email: user.email, sub: user.id, roles: user.roles };
//         return {
//             access_token: this.jwtService.sign(payload),
//         };
//     }

}
