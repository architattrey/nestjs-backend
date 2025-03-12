import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/auth/auth.service';
import { UsersService } from '../../src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
    let authService: AuthService;
    let usersService: UsersService;
    let jwtService: JwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: {
                        findOne: jest.fn(),
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn(),
                    },
                },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        usersService = module.get<UsersService>(UsersService);
        jwtService = module.get<JwtService>(JwtService);
    });

    it('should be defined', () => {
        expect(authService).toBeDefined();
    });

    describe('validateUser', () => {
        it('should return user if credentials are valid', async () => {
            const user = {
                id: 1,
                email: 'archit@gmail.com',
                password: await bcrypt.hash('archit@123', 10),
                username: 'testuser',
                roles: [{ id: 3, name: 'user' }] as any,
            };
            jest.spyOn(usersService, 'findOne').mockResolvedValue(user);
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

            const result = await authService.validateUser('archit@gmail.com', 'archit@123');
            expect(result).toEqual(user);
        });

        it('should throw UnauthorizedException if credentials are invalid', async () => {
            jest.spyOn(usersService, 'findOne').mockRejectedValue(new UnauthorizedException());

            await expect(authService.validateUser('archit@gmail.com', 'wrongpassword')).rejects.toThrow(
                UnauthorizedException,
            );
        });
    });

    describe('login', () => {
        it('should return a JWT token', async () => {
            const user = { email: 'archit@gmail.com', id: 1 };
            jest.spyOn(jwtService, 'sign').mockReturnValue('jwt_token');

            const result = await authService.login(user);
            expect(result).toEqual({ access_token: 'jwt_token' });
        });
    });
});