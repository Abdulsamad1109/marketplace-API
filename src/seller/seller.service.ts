import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Seller } from './entities/seller.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SellerService {

    constructor(
      @InjectRepository(Seller) private readonly sellerRepository: Repository<Seller>,
    ) {}
  
  async create(sellerDto: CreateSellerDto) {
    try {
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(sellerDto.password, 10);

      // Create a new seller entity
      const seller = this.sellerRepository.create({
        ...sellerDto,
        password: hashedPassword,
      });

      // Save the seller to database
      const savedSeller = await this.sellerRepository.save(seller);
      
      // Return seller data without password
      const { password, ...result } = savedSeller;
      return result;

    } catch (error) {
      throw new Error(`Error creating seller: ${error.message}`);
    }
  }



  // FETCH ALL SELLERS
  async findAll() {
    return this.sellerRepository.find();
  }



  // Find a seller by ID
  async findOne(id: string) {
  // Check if the ID exists and is a valid UUID
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
    const seller = await this.sellerRepository.findOneBy({ id });
    
    // If seller not found, throw a NotFoundException
    if (!seller) {
      throw new NotFoundException(`Seller not found`);
    }

    // Return seller data without password
    const { password, ...result } = seller;
    return result;

}


  // find a seller by email
  async findOneByEmail(email: string){
    return await this.sellerRepository.findOne({
      where: {email},
      select: ['id', 'email', 'password', 'roles']
    })
  }


  // UPDATE A SELLER BY ID
  async update(id: string, updateSellerDto: UpdateSellerDto) {

    // Validate UUID format
    // This regex checks for a valid UUID format (version 1-5)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new BadRequestException('Invalid UUID format');
    }

    // Using findOneBy to find a seller by ID to ensure we get a single seller entity
    const seller = await this.sellerRepository.findOneBy({ id });

    // If seller not found, throw a NotFoundException
    if (!seller) {
      throw new NotFoundException(`Seller not found`);
    }

      await this.sellerRepository.update(seller.id, updateSellerDto);
      return `seller updated succesfully`;
    
  }

  // REMOVE A SELLER BY ID
  async remove(id: string) {

    // Validate UUID format
    // This regex checks for a valid UUID format (version 1-5)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new BadRequestException('Invalid UUID format');
    }

    // Using findOneBy to find a seller by ID to ensure we get a single seller entity
    const seller = await this.sellerRepository.findOneBy({ id });

    // If seller not found, throw a NotFoundException
    if (!seller) {
      throw new NotFoundException(`Seller with ID ${id} not found`);
    }

      const result = await this.sellerRepository.delete(id);
      return `seller deleted successfully`;

    }


}






