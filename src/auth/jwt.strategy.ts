import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        super({
            // Extract JWT token from Authorization header as a Bearer token
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,// Reject expired tokens
            secretOrKey: configService.get<string>('JWT_SECRET') || 'default_secret_key',  // Fetch secret key from env config
        });
    }
    /**
     * Validates the JWT payload and returns user information.
     * @param payload - The decoded JWT payload.
     * @returns An object containing user ID, email, and roles.
     */
    async validate(payload: any) {
        return { id: payload.sub, email: payload.email, roles: payload.roles };
    }
}
