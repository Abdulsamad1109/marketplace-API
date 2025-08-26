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

  async fetchProfile(req: any) {
    const adminProfile = await this.adminRepository.findOne({
      where: { user: { id: req.user.id } },
      relations: ['user'], // Include user in the response
    });

    return adminProfile;
  }

  async findAll() {
    return this.adminRepository.find({
      relations: ['user'], // Include user in the response
    });
  }

  // FIND A USER BY ID
  async findOne(id: string) {
  if (!id) {
    throw new BadRequestException('Admin ID is required');
  }

    const admin = await this.adminRepository.findOne({ where: {id}, relations: ['user'] });

    if (!admin) {
      throw new NotFoundException(`Admin not found`);
    }

    return admin;
  }

  // UPDATE AN ADMIN BY ID
  async update(userId: string, updateAdminDto: UpdateAdminDto) {
    // find admin by userId
    const admin = await this.adminRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!admin) {
      throw new NotFoundException(`Admin profile not found for this user`);
    }

    await this.adminRepository.update(admin.id, updateAdminDto);

    return { message: 'Admin profile updated successfully' };
  }

  // REMOVE AN ADMIN BY ID
  async remove(id: string) {

  const admin = await this.adminRepository.findOneBy({ id });


  if (!admin) {
    throw new NotFoundException(`Admin not found`);
  }

    const result = await this.adminRepository.delete(id);
    return `admin deleted successfully`;

  }

}
