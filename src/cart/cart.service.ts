import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { Buyer } from 'src/buyer/entities/buyer.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Buyer) private readonly buyerRepository: Repository<Buyer>,
  ) {}

  async create(buyerId: string, createCartDto: CreateCartDto): Promise<Cart> {
      // Find related buyer
    const seller = await this.buyerRepository.findOne({ where: { user: { id: buyerId } } }); 
      if (!seller) throw new BadRequestException('Invalid buyer');

    const cart = this.cartRepository.create(createCartDto);
    return await this.cartRepository.save(cart);
  }

  // async findAll(): Promise<Cart[]> {
  //   return await this.cartRepository.find({
  //     relations: ['buyer', 'cartItems', 'cartItems.product'],
  //   });
  // }

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

  // async remove(id: string): Promise<void> {
  //   const cart = await this.findOne(id);
  //   await this.cartRepository.remove(cart);
  // }
  
}