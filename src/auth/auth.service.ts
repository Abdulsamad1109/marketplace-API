import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Address } from 'src/address/entities/address.entity';
import { CreateBuyerDto } from 'src/buyer/dto/create-buyer.dto';
import { CreateSellerDto } from 'src/seller/dto/create-seller.dto';
import { Seller } from 'src/seller/entities/seller.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {

  constructor(
    // private userService: UserService ,
    // private jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Seller) private readonly sellerRepository: Repository<Seller>,
    @InjectRepository(Address) private readonly addressRepository: Repository<Address>
      
  ) {}
  

  // This method is used to create a new seller
  // It checks if the user already exists, hashes the password, and saves the seller details
  async createSeller(sellerDto: CreateSellerDto){
    const existingUser = await this.userRepository.findOne({ where: { email: sellerDto.user.email } });
    if (existingUser) throw new NotFoundException('email already exists');
    const hashedPassword = await bcrypt.hash(sellerDto.user.password, 10);

    // Create a new user entity
    const user = this.userRepository.create({...sellerDto.user, password: hashedPassword });
    await this.userRepository.save(user);

    // Create a new seller address
    const address = this.addressRepository.create(sellerDto.addresses);
    await this.addressRepository.save(address);

    // Create a new seller entity
    const newSeller = this.sellerRepository.create({
      businessName: sellerDto.businessName,
      businessType: sellerDto.businessType,
      phoneNumber: sellerDto.phoneNumber,
      user,
      addresses: address // Assuming a seller can have multiple addresses, but starting with one
    })
    const savedSeller = await this.sellerRepository.save(newSeller);
    return savedSeller;
    
  }


  async createBuyer(buyerDto: CreateBuyerDto) {
    const existingUser = await this.userRepository.findOne({ where: { email: buyerDto.user.email } });
    if (existingUser) throw new NotFoundException('email already exists');
    const hashedPassword = await bcrypt.hash(buyerDto.user.password, 10);

    // Create a new user entity
    const user = this.userRepository.create({...buyerDto.user, password: hashedPassword });
    await this.userRepository.save(user);

    // Create a new buyer address
    const address = this.addressRepository.create(buyerDto.addresses);
    await this.addressRepository.save(address);

    // Create a new buyer entity
    const newBuyer = this.sellerRepository.create({
      user,
      addresses: address // Assuming a buyer can have multiple addresses, but starting with one
    });
    
    return newBuyer;
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
