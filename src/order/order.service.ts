import { Injectable, NotFoundException } from '@nestjs/common';;
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { Admin } from 'src/admin/entities/admin.entity';
import { Buyer } from 'src/buyer/entities/buyer.entity';

@Injectable()
export class OrderService {

  constructor(
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    @InjectRepository(Admin) private readonly adminRepository: Repository<Admin>,
    @InjectRepository(Buyer) private readonly buyerRepository: Repository<Buyer>,
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


  // Find all my orders - logged-in buyer
  async findAllBuyerOrders(userIdFromRequest: string): Promise<Order[]> {

    // validate buyer by ID
    const buyer = await this.buyerRepository.findOne({
      where: { user: { id: userIdFromRequest } },
    });
    if (!buyer) {
      throw new NotFoundException(`Buyer not found`);
    }

    const myOrders = await this.orderRepository.find({
      where: { buyer: { id: buyer.id } },
      relations: ['orderItems', 'orderItems.product', 'orderItems.product.images',],   
      order: { createdAt: 'DESC' },
    });

    return myOrders;
  }




}
