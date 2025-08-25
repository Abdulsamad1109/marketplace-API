import { BadRequestException, Get, Injectable, InternalServerErrorException, NotFoundException, Req } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  // User creation is handled in AuthService,
  // so this service is focused on user management


  async fetchProfile(id: string) {
  const userProfile = await this.userRepository.findOne({
    where: { id},
  });

   return userProfile;
  }


  // FETCH ALL USERS
   async findAll() {
    return this.userRepository.find();
  }


  // Find a user by ID
async findOne(id: string) {
  // Check if the ID exists and is a valid UUID
  if (!id) {
    throw new BadRequestException('User ID is required');
  }

    const user = await this.userRepository.findOneBy({ id });
    
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    // Return user data without password
    const { password, ...result } = user;
    return result;

}


  // find a user by email
    async findOneByEmail(email: string){
    return await this.userRepository.findOne({
      where: {email},
      select: ['id', 'email', 'password', 'roles']
    })
  }


  // UPDATE A USER BY ID
  async update(id: string, updateUserDto: UpdateUserDto) {

    // Using findOneBy to find a user by ID to ensure we get a single user entity
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

      await this.userRepository.update(user.id, updateUserDto);
      return `user updated succesfully`;
    
  }


  // REMOVE A USER BY ID
  async remove(id: string) {

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new BadRequestException('Invalid UUID format');
    }

    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

      const result = await this.userRepository.delete(id);
      return `user deleted successfully`;

    }
  
}
