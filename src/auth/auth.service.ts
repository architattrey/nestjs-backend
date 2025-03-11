import { Res, Inject, forwardRef } from '@nestjs/common';
import { Response } from 'express';
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
    /**
     * Validates a user by checking their email and password.
     * @param email - The email of the user.
     * @param password - The plaintext password to verify.
     * @returns The user object with roles if authentication is successful, otherwise throws UnauthorizedException.
     */
    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersRepository.findOne({
            where: { email },
            relations: ['roles'], // Include the 'roles' relationship defined in the User entity 
        }); // Finds a user by email.

        if (!user) throw new UnauthorizedException('Invalid credentials');

        // Compare the provided password with the stored hashed password
        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) throw new UnauthorizedException('Invalid credentials');

        const roles = user.roles; // The roles will be automatically populated due to the relationship

        return { ...user, roles };// Returns user details including roles
    }
    /**
     * Generates a JWT token for an authenticated user.
     * @param user - The authenticated user object.
     * @returns An object containing the access token.
     */
    async login(user: any) {
        const payload = { email: user.email, sub: user.id, roles: user.roles };
        return {
            access_token: this.jwtService.sign(payload),// Generates JWT token with user information
        };
    }
    /**
     * Logs out a user by clearing the JWT token stored in cookies.
     * @param res - The response object to manipulate cookies.
     * @returns A JSON response indicating successful logout.
     */
    async logout(@Res() res: Response) {  
        res.clearCookie('jwt'); // Clear the JWT token from cookies
        return res.json({ message: 'Logout successful' });
    }
}
