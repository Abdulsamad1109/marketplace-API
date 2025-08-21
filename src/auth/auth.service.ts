import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Address } from 'src/address/entities/address.entity';
import { CreateAdminDto } from 'src/admin/dto/create-admin.dto';
import { Admin } from 'src/admin/entities/admin.entity';
import { CreateBuyerDto } from 'src/buyer/dto/create-buyer.dto';
import { Buyer } from 'src/buyer/entities/buyer.entity';
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
    @InjectRepository(Seller) private readonly sellerRepository: Repository<Seller>,
    @InjectRepository(Address) private readonly addressRepository: Repository<Address>,
    @InjectRepository(Buyer) private readonly buyerRepository: Repository<Buyer>,
    @InjectRepository(Admin) private readonly adminRepository: Repository<Admin>
      
  ) {}
  

  // This method is used to create a new seller
  // It checks if the user already exists, hashes the password, and saves the seller details
  async createSeller(sellerDto: CreateSellerDto, user: any) {
    const existingUser = await this.userRepository.findOne({ where: { email: sellerDto.user.email } });
    if (existingUser) throw new NotFoundException('email already exists');
    const hashedPassword = await bcrypt.hash(sellerDto.user.password, 10);

    // Create a new user entity
    const newUser = this.userRepository.create({...sellerDto.user, password: hashedPassword });
    await this.userRepository.save(newUser);

    // Create a new seller address
    const address = this.addressRepository.create(sellerDto.addresses);
    await this.addressRepository.save(address);

    // Create a new seller entity
    const newSeller = this.sellerRepository.create({
      businessName: sellerDto.businessName,
      businessType: sellerDto.businessType,
      phoneNumber: sellerDto.phoneNumber,
      user: newUser,
      addresses: address // Assuming a seller can have multiple addresses, but starting with one
    })
    const savedSeller = await this.sellerRepository.save(newSeller);
    
    // Generate JWT token for the new seller
    const payload = { email: newSeller.user.email, sub: newSeller.user.id, roles: newSeller.user.roles }
    return { access_token: this.jwtService.sign(payload) };
    
  }


  async createBuyer(buyerDto: CreateBuyerDto, user: any) {
    const existingUser = await this.userRepository.findOne({ where: { email: buyerDto.user.email } });
    if (existingUser) throw new NotFoundException('email already exists');
    const hashedPassword = await bcrypt.hash(buyerDto.user.password, 10);

    // Create a new user entity
    const newUser = this.userRepository.create({...buyerDto.user, password: hashedPassword });
    await this.userRepository.save(newUser);

    // Create a new buyer entity
    const newBuyer = this.buyerRepository.create({
      phoneNumber: buyerDto.phoneNumber, 
      user: newUser,
    });
    await this.buyerRepository.save(newBuyer);

    // Generate JWT token for the new buyer
    const payload = { email: newBuyer.user.email, sub: newBuyer.user.id, roles: newBuyer.user.roles }
    return { access_token: this.jwtService.sign(payload) };
  }


  async createAdmin(adminDto: CreateAdminDto, user: any) {
    const existingUser = await this.userRepository.findOne({ where: { email: adminDto.user.email } });
    if (existingUser) throw new NotFoundException('email already exists');
    const hashedPassword = await bcrypt.hash(adminDto.user.password, 10);

    // Create a new user entity
    const newUser = this.userRepository.create({...adminDto.user, password: hashedPassword });
    await this.userRepository.save(newUser);

    // Create a new admin entity
    const newAdmin = this.adminRepository.create({
      phoneNumber: adminDto.phoneNumber,
      user: newUser
    });
    await this.adminRepository.save(newAdmin);

    // Generate JWT token for the new admin
    const payload = { email: newAdmin.user.email, sub: newAdmin.user.id, roles: newAdmin.user.roles }
    return { access_token: this.jwtService.sign(payload) };

  }
  

  // This method is used to validate the user credentials during login
  async validateUser(email: string, password: string) {
          
    // checks if the email exists in the DB
    const user = await this.userService.findOneByEmail(email)
    if (!user) throw new UnauthorizedException('Invalid credentials');

    // checks if the password is correct
    if (user && (await bcrypt.compare(password, user.password))) {
        const { password, ...result } = user;
        return result;
    }
    throw new UnauthorizedException('Invalid credentials');

  }


  // This method generates a JWT token for the user after successful login
  async login(user: any): Promise<{ access_token: string }> {
    const payload = { email: user.email, sub: user.id, roles: user.roles };
    return {
        access_token: this.jwtService.sign(payload),
    };
  }

}
