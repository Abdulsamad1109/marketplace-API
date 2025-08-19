import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {

    constructor(
        private userService: UserService ,
        private jwtService: JwtService,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        
    ) {}
    

      async createSeller(userDto: CreateUserDto) {
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


























          async validateUser(email: string, password: string) {
            
        // checks if the email exists in the DB
        const user = await this.userService.findOneByEmail(email)
        if (!user) throw new UnauthorizedException('Invalid credentials');

        // checks if the password is correct
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        throw new UnauthorizedException('Invalid credentials');

    }


      

    async login(user: any): Promise<{ access_token: string }> {
        const payload = { email: user.email, sub: user.id, roles: user.roles };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
