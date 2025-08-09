import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {

    constructor(
        private userService: UserService ,
        private jwtService: JwtService,
        
    ) {}
    
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
       

    // async login(user: any): Promise<{ acces_token: string }> {
    //     const payload = { email: user.email, sub: user.id, roles: user.roles };
    //     return { acces_token: this.jwtService.sign(payload) };
    // }
    }

}
