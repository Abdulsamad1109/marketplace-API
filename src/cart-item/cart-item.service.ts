import { Injectable } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartItemService {
  create(createCartItemDto: CreateCartItemDto) {
    return 'This action adds a new cartItem';
  }

  findAll() {
    return `This action returns all cartItem`;
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
