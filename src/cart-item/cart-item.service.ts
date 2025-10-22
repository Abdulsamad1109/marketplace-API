import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from './entities/cart-item.entity';
import { Product } from 'src/product/entities/product.entity';
import { Buyer } from 'src/buyer/entities/buyer.entity';
import { Repository } from 'typeorm';
import { CartService } from 'src/cart/cart.service';
import { Admin } from 'src/admin/entities/admin.entity';
import { Cart } from 'src/cart/entities/cart.entity';

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

    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,

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


  findOne( adminId: string, id: string) {

    // check if admin exists
    const admin = this.adminRepository.findOne({ where: { user: { id: adminId } } });
    if (!admin) throw new NotFoundException('Admin not found');


    return this.cartItemRepository.findOne({
    where: { id },
    relations: ['product', 'cart', 'cart.buyer'],
    });

  }


  async updateQuantity(
    buyerId: string,
    cartItemId: string,
    updateCartItemDto: UpdateCartItemDto,
    action: 'increase' | 'decrease',
  ) {
 
    // Validate action 
    if (!['increase', 'decrease'].includes(action)) {
      throw new BadRequestException('Action must be either "increase" or "decrease"');
    }

    // Check if buyer exists
    const buyer = await this.buyerRepository.findOne({
      where: { user: { id: buyerId } },
    });
    if (!buyer) throw new NotFoundException('Buyer not found');

    // Find buyer’s active cart
    const cart = await this.cartRepository.findOne({
      where: { buyer: { id: buyer.id }, status: 'active' },
      relations: ['cartItems', 'cartItems.product'],
    });
    if (!cart) throw new NotFoundException('Active cart not found for this buyer');

    // Find the specific cart item within that cart
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: cartItemId, cart: { id: cart.id } },
      relations: ['product'],
    });
    if (!cartItem) throw new NotFoundException('Cart item not found in your cart');

    // Increase or decrease quantity
    if (action === 'increase') {
      cartItem.quantity += 1;
    } else if (action === 'decrease') {
      // prevent quantity from dropping below 1
      if (cartItem.quantity > 1) {
        cartItem.quantity -= 1;
      } else {
        throw new BadRequestException('Quantity cannot be less than 1');
      }
    }

    // Recalculate tota
    cartItem.total = cartItem.priceAtTime * cartItem.quantity;

    // Save the updated cart item
    await this.cartItemRepository.save(cartItem);

    return 'Cart item quantity updated successfully';
  }



  remove(id: string ) {
    return `This action removes a #${id} cartItem`;
  }
}
