import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { Buyer } from 'src/buyer/entities/buyer.entity';
import { Admin } from 'src/admin/entities/admin.entity';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Buyer) private readonly buyerRepository: Repository<Buyer>,
    @InjectRepository(Admin) private readonly adminRepository: Repository<Admin>,
  ) {}

  async create(buyerId: string, createCartDto: CreateCartDto): Promise<Cart> {

    // Check if buyer exists
    const buyer = await this.buyerRepository.findOneBy({ id: buyerId });
    if (!buyer) throw new NotFoundException('Buyer not found');


    // Check if buyer already has an active cart
    const existingCart = await this.cartRepository.findOne({
      where: { buyer: { id: buyer.id }, status: 'active' },
      relations: ['cartItems'], 
    });
    if (existingCart) return existingCart;


    // Create and save new cart
    const cart = this.cartRepository.create({
      ...createCartDto,
      buyer,
    });
    return this.cartRepository.save(cart);
  }

  

  async findAll(userId: string): Promise<Cart[]> {

    // verify admin
    const admin = await this.adminRepository.findOne({ where: { user: { id: userId } } });
      if (!admin) throw new BadRequestException('Invalid admin');


    return await this.cartRepository.find({
      relations: [ 'cartItems', 'cartItems.product'],
    });
  }

  async findActiveCartByBuyerId(userIdFromRequest: string): Promise<Cart | null> {
  const cart = await this.cartRepository.findOne({
    where: { 
      buyer: { user: { id: userIdFromRequest } }, 
      status: 'active' 
    },
    relations: ['buyer', 'cartItems', 'cartItems.product', 'cartItems.product.images'],
  });

  // if (!cart) {
  //   throw new NotFoundException('No active cart found for this buyer');
  // }

  return cart;
}





  async update(buyerId: string, updateCartDto: UpdateCartDto): Promise<Cart> {
    // Check if buyer exists
    const buyer = await this.buyerRepository.findOne({
      where: { user: { id: buyerId } },
    });

    if (!buyer) throw new NotFoundException('Buyer not found');


    // Find the active cart for the buyer
    const cart = await this.cartRepository.findOne({
      where: { buyer: { id: buyer.id }, status: 'active' },
    });


    if (!cart) throw new NotFoundException('Active cart not found for this buyer');


    // Update cart details
    Object.assign(cart, updateCartDto);

    return this.cartRepository.save(cart);
  }

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