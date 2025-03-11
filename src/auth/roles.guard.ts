import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector, private jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true; // No role restriction
        }

        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(' ')[1];

        if (!token) {
            throw new ForbiddenException('Access Denied: No token provided');
        }

        try {
            const user = this.jwtService.verify(token);
            request.user = user;

            const userRoles = user.roles.map(role => role.name);
            return requiredRoles.some(role => userRoles.includes(role));
        } catch (error) {
            throw new ForbiddenException('Access Denied: Invalid token');
        }
    }
}
// This guard is used to protect routes that require specific roles.
// It checks if the request contains a valid JWT token in the Authorization header.