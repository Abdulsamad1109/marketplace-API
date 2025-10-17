import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { Buyer } from 'src/buyer/entities/buyer.entity';
import { Admin } from 'src/admin/entities/admin.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Buyer) private readonly buyerRepository: Repository<Buyer>,
    @InjectRepository(Admin) private readonly adminRepository: Repository<Admin>,
  ) {}

  async create(buyerId: string, createCartDto: CreateCartDto): Promise<Cart> {
    // Find if buyer exists
    const buyer = await this.buyerRepository.findOne({ where: { user: { id: buyerId } } }); 
      if (!buyer) throw new BadRequestException('Invalid buyer');

    // save cart with buyer
    const cart = this.cartRepository.create({
      ...createCartDto,
      buyer,
    });
    return await this.cartRepository.save(cart);
  }

  async findAll(userId: string): Promise<Cart[]> {
    // verify admin
    const admin = await this.adminRepository.findOne({ where: { user: { id: userId } } }); 
      if (!admin) throw new BadRequestException('Invalid admin');
    return await this.cartRepository.find({
      relations: ['buyer', 'cartItems', 'cartItems.product'],
    });
  }

  async findActiveCartsByBuyerId(userId: string): Promise<Cart[]> {
    // Find if related buyer exists
    const buyer = await this.buyerRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!buyer) throw new BadRequestException('Invalid buyer');

    // Find all active carts for the buyer
    const carts = await this.cartRepository.find({
      where: {
        buyer: { id: buyer.id },
        status: 'active',
      },
      relations: ['buyer', 'cartItems', 'cartItems.product'],
    });

    return carts;
  }

  // async findOne(id: string): Promise<Cart> {
  //   const cart = await this.cartRepository.findOne({
  //     where: { id },
  //     relations: ['buyer', 'cartItems', 'cartItems.product'],
  //   });

  //   if (!cart) {
  //     throw new NotFoundException(`Cart not found`);
  //   }

  //   return cart;
  // }

  async remove(userId: string, cartId: string): Promise<string> {
  // Find the buyer related to this user
  const buyer = await this.buyerRepository.findOne({
    where: { user: { id: userId } },
  });
  if (!buyer) throw new BadRequestException('Invalid buyer');

  // Find the cart with buyer ownership
  const cart = await this.cartRepository.findOne({
    where: {
      id: cartId,
      buyer: { id: buyer.id },
    },
    relations: ['buyer'],
  });

  if (!cart) {
    throw new NotFoundException('Cart not found');
  }

  // Delete the cart
  await this.cartRepository.remove(cart);
  return 'Cart deleted successfully';
}

  
}