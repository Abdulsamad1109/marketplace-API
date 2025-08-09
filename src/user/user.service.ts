import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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

  async create(userDto: CreateUserDto) {
    try {
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(userDto.password, 10);

      // Create a new user entity
      const user = this.userRepository.create({
        ...userDto,
        password: hashedPassword,
      });

      // Save the user to database
      const savedUser = await this.userRepository.save(user);
      
      // Return user data without password
      const { password, ...result } = savedUser;
      return result;

    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  findAll() {
    return this.userRepository.find();
  }


  // Find a user by ID
async findOne(id: string) {
  // Check if the ID exists and is a valid UUID
  if (!id) {
    throw new BadRequestException('User ID is required');
  }
  
  // Validate UUID format
  // This regex checks for a valid UUID format (version 1-5)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    throw new BadRequestException('Invalid UUID format');
  }

    // Using findOneBy to find a user by ID to ensure we get a single user entity
    const user = await this.userRepository.findOneBy({ id });
    
    // If user not found, throw a NotFoundException
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

  async update(id: string, updateUserDto: UpdateUserDto) {

    // Validate UUID format
    // This regex checks for a valid UUID format (version 1-5)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new BadRequestException('Invalid UUID format');
    }

    // Using findOneBy to find a user by ID to ensure we get a single user entity
    const user = await this.userRepository.findOneBy({ id });

    // If user not found, throw a NotFoundException
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

      await this.userRepository.update(user.id, updateUserDto);
      return `user updated succesfully`;
    
  }

  // Remove a user by ID
  async remove(id: string) {

    // Validate UUID format
    // This regex checks for a valid UUID format (version 1-5)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new BadRequestException('Invalid UUID format');
    }

    // Using findOneBy to find a user by ID to ensure we get a single user entity
    const user = await this.userRepository.findOneBy({ id });

    // If user not found, throw a NotFoundException
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

      const result = await this.userRepository.delete(id);
      return `user deleted successfully`;

    }
  
}
