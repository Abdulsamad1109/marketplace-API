import { Injectable } from '@nestjs/common';
// import { CreateBuyerDto } from './dto/create-buyer.dto';
import { UpdateBuyerDto } from './dto/update-buyer.dto';
import { Repository } from 'typeorm';
import { Buyer } from './entities/buyer.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BuyerService {

  constructor(
    @InjectRepository(Buyer) private readonly buyerRepository: Repository<Buyer>,
    
  ) {}
  
  // Buyer creation is handled in AuthService,
  // so this service is focused on buyer management

  findAll() {
    return this.buyerRepository.find({
      relations: ['user']
  });
  }

  findOne(id: number) {
    return `This action returns a #${id} buyer`;
  }

  update(id: number, updateBuyerDto: UpdateBuyerDto) {
    return `This action updates a #${id} buyer`;
  }

  remove(id: number) {
    return `This action removes a #${id} buyer`;
  }
}
