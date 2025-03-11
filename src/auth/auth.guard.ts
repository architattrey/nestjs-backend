import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtAuthGuard implements CanActivate {

    constructor(
        private jwtService: JwtService,// Injecting JWT service to verify and decode tokens
        @InjectRepository(User) private usersRepository: Repository<User>// Injecting User repository to fetch user data from DB
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();// Extract HTTP request from the execution context
        const token = request.headers.authorization?.split(' ')[1];// Extract JWT token from the Authorization header
        if (!token) throw new UnauthorizedException('Token required');// Throw error if no token is provided

        try {
            const user = this.jwtService.verify(token);// Verify and decode the JWT token
             // Fetch the user from the database using the email from the token payload
            request.user = await this.usersRepository.find({ where: { email: user.email } });
            return true;// Grant access if the token is valid
        } catch (err) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}
// This guard is used to protect routes that require authentication.
// It checks if the request contains a valid JWT token in the Authorization header.
// If valid, it attaches the user object to the request for further processing.