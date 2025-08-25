import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

  async fetchProfile(id: string) {

    const buyerProfile = await this.buyerRepository.findOne({
      where: { user: { id} },
      relations: ['user'], // Include user in the response
    });

    return buyerProfile;
  }

  async findAll() {
  return this.buyerRepository.find({
    relations: ['user'], // Include user in the response
  });
}

async findOne(id: string) {
 
if (!id) {
    throw new BadRequestException('Buyer ID is required');
  }

    // Using findOneBy to find a buyer by ID to ensure we get a single buyer entity
    const buyer = await this.buyerRepository.findOne({ where: {id}, relations: ['user', 'addresses'] });
    
    // If buyer not found, throw a NotFoundException
    if (!buyer) {
      throw new NotFoundException(`Buyer not found`);
    }

    // Return buyer data without password
    return buyer;
}


  // UPDATE A BUYER BY ID
  async updateProfile(userId: string, updateBuyerDto: UpdateBuyerDto) {
    // find buyer by linked user
    const buyer = await this.buyerRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!buyer) {
      throw new NotFoundException(`Buyer profile not found for this user`);
    }

    await this.buyerRepository.update(buyer.id, updateBuyerDto);

    return { message: 'Buyer profile updated successfully' };
  }

// REMOVE A BUYER BY ID
async remove(id: string) {

  // Validate UUID format
  // This regex checks for a valid UUID format (version 1-5)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    throw new BadRequestException('Invalid UUID format');
  }

  // Using findOneBy to find a buyer by ID to ensure we get a single buyer entity
  const buyer = await this.buyerRepository.findOneBy({ id });

  // If buyer not found, throw a NotFoundException
  if (!buyer) {
    throw new NotFoundException(`Buyer not found`);
  }

    const result = await this.buyerRepository.delete(id);
    return `buyer deleted successfully`;

}

}
