import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(' ')[1];

        if (!token) throw new UnauthorizedException('Token required');

        try {
            request.user = this.jwtService.verify(token);
            return true;
        } catch (err) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}
// This guard is used to protect routes that require authentication.
// It checks if the request contains a valid JWT token in the Authorization header.