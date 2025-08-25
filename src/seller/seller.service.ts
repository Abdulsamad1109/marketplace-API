import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Seller } from './entities/seller.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SellerService {

  constructor( @InjectRepository(Seller) private readonly sellerRepository: Repository<Seller> ) {}

  // Seller creation is handled in AuthService,
  // so this service is focused on seller management

  async fetchProfile(id: string) {
    const sellerProfile = await this.sellerRepository.findOne({
      where: { user: { id } },
      relations: ['user'], // Include user in the response
    });

    return sellerProfile;
  }

  async findAll() {
    return this.sellerRepository.find({
      relations: ['user'], // Include user in the response
    });
  }

  async findOne(id: string) {
   
  if (!id) {
      throw new BadRequestException('Seller ID is required');
    }
  
      const seller = await this.sellerRepository.findOne({ where: {id}, relations: ['user', 'addresses'] });
      
      if (!seller) {
        throw new NotFoundException(`Seller not found`);
      }
  
      return seller;
  }

  // UPDATE A SELLER BY ID
  async update(id: string, updateSellerDto: UpdateSellerDto) {

    const seller = await this.sellerRepository.findOneBy({ id });

    if (!seller) {
      throw new NotFoundException(`Seller not found`);
    }

      await this.sellerRepository.update(seller.id, updateSellerDto);
      return 'updated successfully';
    
  }

// REMOVE A SELLER BY ID
async remove(id: string) {

  // Using findOneBy to find a seller by ID to ensure we get a single usellerentity
  const seller = await this.sellerRepository.findOneBy({ id });

  if (!seller) {
    throw new NotFoundException(`Seller with ID ${id} not found`);
  }

    const result = await this.sellerRepository.delete(id);
    return `seller deleted successfully`;

  }
}
