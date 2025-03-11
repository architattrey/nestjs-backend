import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector, private jwtService: JwtService) { }
    /**
     * Determines whether the request is allowed based on user roles.
     * @param context - The execution context for the request.
     * @returns A boolean indicating whether access is granted.
     */
    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Retrieve the required roles from metadata set by @Roles() decorator
        const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true; // No role restriction
        }
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(' ')[1];// Extract JWT token from Authorization header

        if (!token) {
            throw new ForbiddenException('Access Denied: No token provided');
        }
        try {
            // Verify and decode JWT token
            const user = this.jwtService.verify(token);
            request.user = user;// Attach user data to request for further use
            // Convert user roles to uppercase.
            const userRoles = user.roles.map(role => role.name.toUpperCase());
            // Check if the user has at least one of the required roles
            return requiredRoles.some(role => userRoles.includes(role));
        } catch (error) {
            throw new ForbiddenException('Access Denied: Invalid token');
        }
    }
}
// This guard is used to protect routes that require specific roles.
// It checks if the request contains a valid JWT token in the Authorization header.