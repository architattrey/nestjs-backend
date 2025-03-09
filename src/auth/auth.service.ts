import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)// Injects the repository for the User entity, enabling interaction with the users table.
        private usersRepository: Repository<User>,
        private readonly jwtService: JwtService
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersRepository.findOne({
            where: { email },
            relations: ['roles'], // Include the 'roles' relationship defined in the User entity 
        }); // Finds a user by email.

        if (!user) throw new UnauthorizedException('Invalid credentials');

        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) throw new UnauthorizedException('Invalid credentials');

        const roles = user.roles; // The roles will be automatically populated due to the relationship

        return { ...user, roles };
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id, roles: user.roles };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
