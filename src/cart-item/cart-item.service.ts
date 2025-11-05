import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from './entities/cart-item.entity';
import { Product } from 'src/product/entities/product.entity';
import { Buyer } from 'src/buyer/entities/buyer.entity';
import { Repository } from 'typeorm';
import { Admin } from 'src/admin/entities/admin.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class CartItemService {

  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,

    @InjectRepository(Buyer)
    private readonly buyerRepository: Repository<Buyer>,

    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,

    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,

    @InjectDataSource()
    private dataSource: DataSource,

  ) {}




  async addToCart(userIdFromRequest: string, createCartItemDto: CreateCartItemDto) {
  return await this.dataSource.transaction(async (manager) => {

    const {productId, priceAtTime} = createCartItemDto;


    // Find buyer existence
    const buyer = await this.dataSource.transaction(async (manager) => {
      return await manager.findOne(Buyer, {
        where:{user: {id: userIdFromRequest}}
      });
    });

    if (!buyer) {
      throw new NotFoundException('buyer not found');
    }

    // Validate product exists
    const product = await manager.findOne(Product, {
      where: { id: productId },
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
    if (priceAtTime !== Number(product.price)) {
      throw new BadRequestException('Price mismatch');
    }

    // Find or create cart for buyer
    let cart = await manager.findOne(Cart, {
      where: { buyer: { id: buyer.id } },
      relations: ['buyer'],
    });

    if (!cart) {
      cart = manager.create(Cart, {
        buyer,
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
        product,
        quantity: 1,
        priceAtTime,
        total: 1 * priceAtTime,
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


// GET SINGLE CART ITEM BY ID (ADMIN ONLY)
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
async updateCartItem( userIdFromRequest: string,  cartItemId: string,  updateCartItemDto: UpdateCartItemDto,) {
  const { action } = updateCartItemDto; 
  return await this.dataSource.transaction(async (manager) => {

    // Find buyer existence
    const buyer = await manager.findOne(Buyer, {
      where: { user: { id: userIdFromRequest } },
    });

    if (!buyer) {
      throw new NotFoundException('buyer not found');
    }


    // Find cart item with relations
    const cartItem = await manager.findOne(CartItem, {
      where: { 
        id: cartItemId,
        cart: { buyer: { id: buyer.id } } // Ensure it belongs to this buyer
      },
      relations: ['cart', 'product'],
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }


    // Calculate new quantity
    const newQuantity = action === 'increase' ? cartItem.quantity + 1 : cartItem.quantity - 1;


    // Validate minimum quantity
    if (newQuantity < 1) {
      throw new BadRequestException('Quantity cannot be less than 1. Use delete to remove item.');
    }


    // Check stock availability (for increment)
    if (action === 'increase') {
      if (cartItem.product.stock < newQuantity) {
        throw new BadRequestException(
          `Insufficient stock. Only ${cartItem.product.stock} unit(s) left`
        );
      }
    }


    // Update cart item
    cartItem.quantity = newQuantity;
    cartItem.total = cartItem.quantity * cartItem.priceAtTime;
    await manager.save(CartItem, cartItem);


    // Recalculate cart's totalAmount
    const allCartItems = await manager.find(CartItem, {
      where: { cart: { id: cartItem.cart.id } },
    });

    cartItem.cart.totalAmount = allCartItems.reduce((sum, item) => {
      return Number(sum) + Number(item.total);
    }, 0);

    await manager.save(Cart, cartItem.cart);


    // Return cartItem without cart relation but include cartTotalAmount
    const { cart, ...cartItemWithoutCart } = cartItem;

    return {
      ...cartItemWithoutCart,
      cartTotalAmount: cartItem.cart.totalAmount,
    };
  });
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

