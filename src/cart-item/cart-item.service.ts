import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from './entities/cart-item.entity';
import { Product } from 'src/product/entities/product.entity';
import { Buyer } from 'src/buyer/entities/buyer.entity';
import { Repository } from 'typeorm';
import { CartService } from 'src/cart/cart.service';
import { Admin } from 'src/admin/entities/admin.entity';

@Injectable()
export class CartItemService {

  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Buyer)
    private readonly buyerRepository: Repository<Buyer>,

    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,

    private readonly cartService: CartService,
  ) {}




  async addToCart(buyerId: string, createCartItemDto: CreateCartItemDto) {
  const { productId, quantity, priceAtTime } = createCartItemDto;


  // Find or create an active cart for this buyer
  let cart = await this.cartService.findActiveCartByBuyerId(buyerId);
  if (!cart) {
    cart = await this.cartService.create(buyerId, { status: 'active' });
  }


  // Check if product exists in the database
  const product = await this.productRepository.findOne({ where: { id: productId } });
  if (!product) throw new NotFoundException('Product not found');


  // Check if this product is already in the buyer’s cart
  const existingItem = await this.cartItemRepository.findOne({
    where: { cart: { id: cart.id }, product: { id: product.id } },
  });


  // If it exists, update quantity + total
  if (existingItem) {
    existingItem.quantity += quantity;
    existingItem.total = existingItem.quantity * existingItem.priceAtTime;
    return await this.cartItemRepository.save(existingItem);
  }


  // If not, create new cart item
  const total = quantity * priceAtTime;

  const newItem = this.cartItemRepository.create({
    cart,
    product,
    quantity,
    priceAtTime,
    total,
  });
  const newSavedItem = await this.cartItemRepository.save(newItem);

  const { cart: _, ...itemWithoutCart } = newSavedItem;
  return itemWithoutCart;

}




  findAll(adminId: string): Promise<CartItem[]> {

    // check if admin exists
    const admin = this.adminRepository.findOne({ where: { user: { id: adminId } } });
    if (!admin) throw new NotFoundException('Admin not found');

    return this.cartItemRepository.find({
      relations: ['product', 'cart', 'cart.buyer'],
    });
    
  }


  findOne(id: string ) {
    return `This action returns a #${id} cartItem`;
  }


  update(id: string , updateCartItemDto: UpdateCartItemDto) {
    return `This action updates a #${id} cartItem`;
  }


  remove(id: string ) {
    return `This action removes a #${id} cartItem`;
  }
}
