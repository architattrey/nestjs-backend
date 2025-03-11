    import { Controller, Post, Body, UseGuards, Request, Req, Res } from '@nestjs/common';
    import { AuthService } from './auth.service';
    import { LocalAuthGuard } from './local-auth.guard';
    import { UsersService } from '../users/users.service';
    import { RegisterDto } from './dto/register.dto';
    import { Response } from 'express';  // Correct import

    // AuthController handles authentication-related operations such as user registration, login, and logout.
    @Controller('auth')// Defines the base route as '/auth'
    export class AuthController {
        constructor(
            private readonly authService: AuthService,// Injecting AuthService for authentication logic
            private readonly usersService: UsersService,// Injecting UsersService to manage user-related operations
        ) { }
        /**
         * Handles user registration.
         * @param registerDto - DTO containing user registration details.
         * @returns The newly created user object.
         */
        @Post('register')
        async register(@Body() registerDto: RegisterDto) {
            const user = await this.usersService.create(registerDto);// Create a new user

            // Assign default role "viewer" after registration
            await this.usersService.assignRoles(String(user.id)); // Assuming "viewer" has ID 3 at the time of new registration
            return user;// Return the newly registered user
        }
        /**
         * Handles user login using the LocalAuthGuard.
         * This guard verifies user credentials using passport-local strategy.
         * @param req - Request object containing user data.
         * @returns JWT token for authentication.
         */
        @UseGuards(LocalAuthGuard)// Protects the login route using LocalAuthGuard
        @Post('login')
        async login(@Request() req) {
            return this.authService.login(req.user);// Authenticate and return JWT token
        }
        /**
         * Handles user logout by clearing the JWT token.
         * @param res - Express Response object to send the logout response.
         * @returns Success message confirming logout.
         */
        @Post('logout')
        async logout(@Res() res: Response) {   
            return this.authService.logout(res);// Calls AuthService to handle logout
        }

    }

