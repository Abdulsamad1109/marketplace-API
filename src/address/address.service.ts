import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AddressService {

  constructor(
    @InjectRepository(Address) private readonly addressRepository: Repository<Address> 
  ) {}

  // Address creation is handled in AuthService, 
  // so this service is focused on address management


  async findAll(): Promise<Address[]> {
    return await this.addressRepository.find({
      // relations: ['seller'], // Include seller in the response  
    });
  }



}