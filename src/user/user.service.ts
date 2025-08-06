import { Injectable } from '@nestjs/common';
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

  findOne(id: string) {
    return this.userRepository.findOne({ where: { id } });
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
