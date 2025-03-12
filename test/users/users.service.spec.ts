import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../src/users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../src/users/entities/user.entity';
import { Role } from '../../src/users/entities/role.entity'; // Import Role entity
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'src/users/entities/user_roles.entity';

describe('UsersService', () => {
    let usersService: UsersService;
    let userRepository: Repository<User>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User), // Mock UserRepository
                    useValue: {
                        findOne: jest.fn(),
                        create: jest.fn(),
                        save: jest.fn(),
                        delete: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(Role), // Mock RoleRepository
                    useValue: {
                        findOne: jest.fn(),
                        save: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(UserRole), // Mock UserRoleRepository
                    useValue: {
                        findOne: jest.fn(),
                        save: jest.fn(),
                    },
                },
                {
                    provide: 'DataSource', // Mock DataSource
                    useValue: {
                        manager: {
                            transaction: jest.fn().mockImplementation((cb) => cb({})),
                        },
                    },
                },
            ],
        }).compile();
    
        usersService = module.get<UsersService>(UsersService);
        userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    });
    

    it('should be defined', () => {
        expect(usersService).toBeDefined();
    });

    describe('create', () => {
        it('should create a new user', async () => {
            const createUserDto = {
                username: 'test',
                email: 'test@example.com',
                password: 'password123'
            };
            const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

            // Mock user including roles
            const user: User = {
                id: 1,
                ...createUserDto,
                password: hashedPassword,
                roles: [{ id: 1, name: 'user' } as Role], // Add roles
            };

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
            jest.spyOn(userRepository, 'create').mockReturnValue(user);
            jest.spyOn(userRepository, 'save').mockResolvedValue(user);

            const result = await usersService.create(createUserDto);
            expect(result).toEqual(user);
        });
    });
});
