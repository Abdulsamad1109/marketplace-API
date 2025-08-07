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
  
  // Add UUID validation if you're using UUIDs
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    throw new BadRequestException('Invalid UUID format');
  }

  try {
    const user = await this.userRepository.findOneBy({ id });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Return user data without password
    const { password, ...result } = user;
    return result;

  } catch (error) {
    console.error('Error in findOne:', error.message);
    
    // Re-throw known exceptions as-is
    if (error instanceof BadRequestException || error instanceof NotFoundException) {
      throw error;
    }
    
    // Handle unexpected errors
    throw new InternalServerErrorException('An error occurred while fetching the user');
  }
}


  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      await this.userRepository.update(id, updateUserDto);
      return this.findOne(id);
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  async remove(id: string) {
    try {
      const result = await this.userRepository.delete(id);
      return result?.affected && result.affected > 0;
    } catch (error) {
      throw new Error(`Error removing user: ${error.message}`);
    }
  }
}
