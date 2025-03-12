import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../../src/users/users.controller';
import { UsersService } from '../../src/users/users.service';

describe('UsersController', () => {
    let usersController: UsersController;
    let usersService: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: {
                        create: jest.fn(),
                        findAll: jest.fn(),
                        findOne: jest.fn(),
                        update: jest.fn(),
                        remove: jest.fn(),
                        assignRoles: jest.fn(),
                    },
                },
            ],
        }).compile();

        usersController = module.get<UsersController>(UsersController);
        usersService = module.get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(usersController).toBeDefined();
    });

    describe('create', () => {
        it('should create a new user', async () => {
            const createUserDto = { username: 'test', email: 'test@example.com', password: 'password123' };
            jest.spyOn(usersService, 'create').mockResolvedValue({ id: 1, ...createUserDto, roles: [] });

            const result = await usersController.create(createUserDto);
            expect(result).toEqual({ id: 1, ...createUserDto });
        });
    });
});