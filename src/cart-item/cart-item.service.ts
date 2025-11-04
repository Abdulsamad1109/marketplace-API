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
import { User } from 'src/user/entities/user.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

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

    @InjectDataSource()
    private dataSource: DataSource,

    private readonly cartService: CartService,
  ) {}




  async addToCart(userId: string, createCartItemDto: CreateCartItemDto) {
  return await this.dataSource.transaction(async (manager) => {
    // Find user and their buyer relationship
    const user = await manager.findOne(User, {
      where: { id: userId },
      relations: ['buyer'],
    });

    if (!user || !user.buyer) {
      throw new NotFoundException('buyer not found');
    }

    // Validate product exists
    const product = await manager.findOne(Product, {
      where: { id: createCartItemDto.productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check stock availability
    if (product.stock <= 0) {
      throw new BadRequestException('out of stock');
    }

    if (product.stock < 1) {
      throw new BadRequestException(
        `Insufficient stock. Only ${product.stock} unit(s) left`
      );
    }

    // Validate price matches
    if (createCartItemDto.priceAtTime !== Number(product.price)) {
      throw new BadRequestException('Price mismatch');
    }

    // Find or create cart for buyer
    let cart = await manager.findOne(Cart, {
      where: { buyer: { id: user.buyer.id } },
      relations: ['buyer'],
    });

    if (!cart) {
      cart = manager.create(Cart, {
        buyer: user.buyer,
        totalAmount: 0,
      });
      cart = await manager.save(Cart, cart);
    }

    // Check if product already exists in cart
    let cartItem = await manager.findOne(CartItem, {
      where: {
        cart: { id: cart.id },
        product: { id: product.id },
      },
      relations: ['product'],
    });

    if (cartItem) {
      // Update existing cart item
      const newQuantity = cartItem.quantity + 1;

      // Check stock for new quantity
      if (product.stock < newQuantity) {
        throw new BadRequestException(
          `Insufficient stock. Only ${product.stock} unit(s) left`
        );
      }

      cartItem.quantity = newQuantity;
      cartItem.total = cartItem.quantity * cartItem.priceAtTime;
      cartItem = await manager.save(CartItem, cartItem);
    } else {
      // Create new cart item
      cartItem = manager.create(CartItem, {
        cart: cart,
        product: product,
        quantity: 1,
        priceAtTime: createCartItemDto.priceAtTime,
        total: 1 * createCartItemDto.priceAtTime,
      });
      cartItem = await manager.save(CartItem, cartItem);
    }

    // Recalculate cart's totalAmount
    const allCartItems = await manager.find(CartItem, {
      where: { cart: { id: cart.id } },
    });

    cart.totalAmount = allCartItems.reduce((sum, item) => {
    return Number(sum) + Number(item.total);
    }, 0);
    await manager.save(Cart, cart);

    // Return cartItem without cart relation but include cartTotalAmount
    const { cart: _, ...cartItemWithoutCart } = cartItem;

    return {
      ...cartItemWithoutCart,
      cartTotalAmount: cart.totalAmount,
    };
  });
}




  // GET ALL CART ITEMS (ADMIN ONLY)
  async findAll(adminId: string): Promise<CartItem[]> {

  // check if admin exists
  const admin = await this.adminRepository.findOne({ where: { user: { id: adminId } } });
  if (!admin) throw new NotFoundException('Admin not found');

  return this.cartItemRepository.find({
    relations: ['product', 'cart', 'cart.buyer'],
  });
  
}


// GET SINGLE CART ITEM BY ID (FOR THE LOGGED-IN BUYER)
async findOne( adminId: string, id: string) {

  // check if admin exists
  const admin = await this.adminRepository.findOne({ where: { user: { id: adminId } } });
  if (!admin) throw new NotFoundException('Admin not found');


  return this.cartItemRepository.findOne({
  where: { id },
  relations: ['product', 'cart', 'cart.buyer'],
  });

}



// UPDATE CART ITEM QUANTITY (INCREASE OR DECREASE)
async updateQuantity(
  buyerId: string,
  cartItemId: string,
  updateCartItemDto: UpdateCartItemDto,
) {

  const { quantity: action } = updateCartItemDto;


  // Check if buyer exists
  const buyer = await this.buyerRepository.findOne({
    where: { user: { id: buyerId } }});
  if (!buyer) throw new NotFoundException('Buyer not found');



  // Find buyer’s active cart
  const cart = await this.cartRepository.findOne({
    where: { buyer: { id: buyer.id }, status: 'active' },
    relations: ['cartItems', 'cartItems.product', 'cartItems.product.images'],
  });
  if (!cart) throw new NotFoundException('Active cart not found for this buyer');



  // Find the specific cart item within that cart
  const cartItem = await this.cartItemRepository.findOne({
    where: { id: cartItemId, cart: { id: cart.id } },
    relations: ['product', 'product.images'],
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

  // Recalculate total
  cartItem.total = cartItem.priceAtTime * cartItem.quantity;

  // Save the updated cart item
  const updatedItem = await this.cartItemRepository.save(cartItem);


  //  Recalculate cart totalAmount 
  const cartItems = await this.cartItemRepository.find({
    where: { cart: { id: cart.id } },
  });

  
  cart.totalAmount = cartItems.reduce((sum, item) => sum + Number(item.total), 0);
  await this.cartRepository.save(cart);

  return updatedItem;

  }



  // DELETE CART ITEM
  async remove(buyerId: string, cartItemId: string ) {
    // verify buyer
    const buyer = await this.buyerRepository.findOne({ where: { user: { id: buyerId } } });
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
      relations: ['product', 'product.images'],
    });
    if (!cartItem) throw new NotFoundException('Cart item not found in your cart');


    //  Recalculate cart totalAmount 
    const cartItems = await this.cartItemRepository.find({
      where: { cart: { id: cart.id } },
    });

    
    cart.totalAmount = cartItems.reduce((sum, item) => Number(sum) + Number(item.total), 0);
    await this.cartRepository.save(cart);


    // Delete the cart item
    await this.cartItemRepository.remove(cartItem);
    return 'Cart item removed successfully' ;
  }
}

