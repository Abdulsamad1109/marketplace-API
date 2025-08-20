import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Seller } from './entities/seller.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SellerService {

  constructor( @InjectRepository(Seller) private readonly sellerRepository: Repository<Seller> ) {}

  async findAll() {
    return this.sellerRepository.find({
      relations: ['user', 'addresses'], // Include user and addresses in the response
    });
  }

  async findOne(id: string) {
   
  if (!id) {
      throw new BadRequestException('Seller ID is required');
    }
    
    // Validate UUID format
    // This regex checks for a valid UUID format (version 1-5)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
  
      // Using findOneBy to find a seller by ID to ensure we get a single seller entity
      const seller = await this.sellerRepository.findOne({ where: {id}, relations: ['user', 'addresses'] });
      
      // If seller not found, throw a NotFoundException
      if (!seller) {
        throw new NotFoundException(`Seller not found`);
      }
  
      // Return seller data without password
      return seller;
  }

  async update(id: number, updateSellerDto: UpdateSellerDto) {
    return `This action updates a #${id} seller`;
  }

  async remove(id: number) {
    return `This action removes a #${id} seller`;
  }
}
