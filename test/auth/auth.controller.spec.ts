import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/auth/auth.controller';
import { AuthService } from '../../src/auth/auth.service';
import { UsersService } from '../../src/users/users.service';
import { LocalAuthGuard } from '../../src/auth/local-auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        login: jest.fn(),
                        logout: jest.fn(),
                    },
                },
                {
                    provide: UsersService,
                    useValue: {
                        create: jest.fn(),
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

        authController = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(authController).toBeDefined();
    });

    describe('login', () => {
        it('should return a JWT token', async () => {
            const user = { email: 'test@example.com', id: 1 };
            jest.spyOn(authService, 'login').mockResolvedValue({ access_token: 'jwt_token' });

            const result = await authController.login({ user });
            expect(result).toEqual({ access_token: 'jwt_token' });
        });
    });
});