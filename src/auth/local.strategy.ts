import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        // Configuring the strategy to use 'email' as the username field instead of the default 'username'
        super({ usernameField: 'email' });
    }
    /**
     * Validates user credentials during authentication.
     * @param email - The user's email address.
     * @param password - The user's password.
     * @returns The authenticated user object if credentials are valid.
     * @throws UnauthorizedException if authentication fails.
     */
    async validate(email: string, password: string): Promise<any> {
        const user = await this.authService.validateUser(email, password);
        if (!user) throw new UnauthorizedException();
        return user;
    }
}
