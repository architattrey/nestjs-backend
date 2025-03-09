import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { UsersService } from '../users/users.service';
//import { UserRolesService } from '../user_roles/user_roles.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
        //private readonly userRolesService: UserRolesService
    ) { }

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        const user = await this.usersService.create(registerDto);

        // Assign default role "viewer" after registration
        await this.userRolesService.assignRoles(user.id, [3]); // Assuming "viewer" has ID 3

        return user;
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }
}
