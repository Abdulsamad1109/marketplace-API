import { Injectable } from '@nestjs/common';
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

  // Adress creation is handled in AuthService, 
  // so this controller is focused on address management

  findAll() {
    return this.addressRepository.find({
      // relations: ['seller'], // Include seller in the response  
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} address`;
  }

  update(id: number, updateAddressDto: UpdateAddressDto) {
    return `This action updates a #${id} address`;
  }

  remove(id: number) {
    return `This action removes a #${id} address`;
  }
}
