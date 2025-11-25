import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { Admin } from 'src/admin/entities/admin.entity';

@Injectable()
export class OrderService {

  constructor(
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    @InjectRepository(Admin) private readonly adminRepository: Repository<Admin>,
  ) {}

 
  // Find a single order by admin ID
  async findOneByAdminId(userIdFromRequest: string, orderId: string): Promise<Order> {

    // validate admin by ID
    const admin = await this.adminRepository.findOne({
      where: { user: { id: userIdFromRequest } },
    });
    if (!admin) {
      throw new NotFoundException(`Admin not found`);
    }

    // validate order by ID
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['orderItems'],
    });

    if (!order) {
      throw new NotFoundException(`Order not found`);
    }

    return order;
  }






}
