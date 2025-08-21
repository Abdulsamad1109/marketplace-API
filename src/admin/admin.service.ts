import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {

  constructor(
    @InjectRepository(Admin) private readonly adminRepository: Repository<Admin>,
  ) {}
  
  // Admin creation is handled in AuthService,
  // so this service is focused on admin management

async findAll() {
  return this.adminRepository.find({
    relations: ['user'], // Include user and addresses in the response
  });
}

async findOne(id: string) {
 
if (!id) {
    throw new BadRequestException('Admin ID is required');
  }
  
  // Validate UUID format
  // This regex checks for a valid UUID format (version 1-5)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    throw new BadRequestException('Invalid UUID format');
  }

    // Using findOneBy to find an admin by ID to ensure we get a single admin entity
    const admin = await this.adminRepository.findOne({ where: {id}, relations: ['user', 'addresses'] });
    
    // If admin not found, throw a NotFoundException
    if (!admin) {
      throw new NotFoundException(`Admin not found`);
    }

    // Return admin data without password
    return admin;
}

// find an admin by email
//   async findOneByEmail(email: string){
//   return await this.adminRepository.findOne({
//     where: {email},
//     select: ['id', 'email', 'password', 'roles']
//   })
// }

// UPDATE AN ADMIN BY ID
async update(id: string, updateAdminDto: UpdateAdminDto) {

  // Validate UUID format
  // This regex checks for a valid UUID format (version 1-5)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    throw new BadRequestException('Invalid UUID format');
  }

  // Using findOneBy to find an admin by ID to ensure we get a single admin entity
  const admin = await this.adminRepository.findOneBy({ id });

  // If admin not found, throw a NotFoundException
  if (!admin) {
    throw new NotFoundException(`Admin not found`);
  }

    await this.adminRepository.update(admin.id, updateAdminDto);
    return 'updated successfully';
  
}

// REMOVE AN ADMIN BY ID
async remove(id: string) {

  // Validate UUID format
  // This regex checks for a valid UUID format (version 1-5)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    throw new BadRequestException('Invalid UUID format');
  }

  // Using findOneBy to find an admin by ID to ensure we get a single admin entity
  const admin = await this.adminRepository.findOneBy({ id });

  // If admin not found, throw a NotFoundException
  if (!admin) {
    throw new NotFoundException(`Admin with ID ${id} not found`);
  }

    const result = await this.adminRepository.delete(id);
    return `admin deleted successfully`;

}


}
