import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AssignRolesDto } from './dto/assign-roles.dto';
import { UserRole } from './entities/user_roles.entity';
import * as bcrypt from 'bcrypt';

@Injectable()// Marks the service as injectable, allowing it to be injected into other parts of the application (e.g., controllers).
export class UsersService {
    constructor(
        @InjectRepository(User)// Injects the repository for the User entity, enabling interaction with the users table.
        private usersRepository: Repository<User>,

        @InjectRepository(Role)// Injects the repository for the Role entity, enabling interaction with the roles table.
        private rolesRepository: Repository<Role>,

        @InjectRepository(UserRole)// Injects the repository for the UserRole entity, allowing us to manage user-role relationships.
        private userRolesRepository: Repository<UserRole>,

        private readonly dataSource: DataSource // Inject DataSource for transaction
    ) { }

    // Create a new user
    async create(createUserDto: CreateUserDto): Promise<User> {
        const existingUser = await this.usersRepository.findOne({ where: { email: createUserDto.email } });
        if (existingUser) {
            throw new BadRequestException('Email is already in use');
        }
        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        createUserDto.password = await bcrypt.hash(createUserDto.password, salt);

        const user = this.usersRepository.create(createUserDto);// Creates a new user entity using the provided DTO.
        return this.usersRepository.save(user);// Saves the new user to the database.
    }
    // Retrieve all users
    async findAll(): Promise<User[]> {
        return this.usersRepository.find();// Returns all users from the users table.
    }
    // Find a user by ID
    async findOne(id: string): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id: Number(id) } });// Finds a user by ID.
        if (!user) {
            throw new NotFoundException('User not found');// Throws an exception if the user is not found.
        }
        return user;
    }
    // Update a user by ID
    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.findOne(id);
        Object.assign(user, updateUserDto);// Updates the user entity with new data from the DTO.
        return this.usersRepository.save(user); //Saves the updated user to the database.
    }
    // Delete a user by ID
    async remove(id: string): Promise<void> {
        const user = await this.findOne(id); // Finds the user by ID.
        await this.usersRepository.remove(user); // Removes the user from the database.
    }
    // Assign roles to a user (removes old ones first)
    async assignRoles(id: string, assignRolesDto?: AssignRolesDto): Promise<User | null> {
        Logger.log(`Assigning roles to user with ID: ${id}`);
    
        const user = await this.usersRepository.findOne({ where: { id: Number(id) } });
        if (!user) throw new NotFoundException('User not found');
    
        let roleIds = assignRolesDto?.roleIds ?? [3]; // Default to "viewer" (ID: 3)
        
        const roles = await this.rolesRepository.find({
            where: roleIds.map(id => ({ id })),
        });
    
        if (!roles || roles.length === 0) throw new NotFoundException('Roles not found');
    
        let existingRoles: UserRole[] = [];
    
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
    
        try {
            // Backup existing roles for rollback
            existingRoles = await this.userRolesRepository.find({ where: { user_id: Number(id) } });
    
            // ** Delete existing roles from user_roles table**
            await queryRunner.manager
                .createQueryBuilder()
                .delete()
                .from(UserRole)
                .where('user_id = :userId', { userId: Number(id) })
                .execute();
    
            // Create new user-role mappings
            const userRoles = roles.map(role => {
                const userRole = new UserRole();
                userRole.user_id = user.id;
                userRole.role_id = role.id;
                return userRole;
            });
    
            await queryRunner.manager.save(UserRole, userRoles);
    
            await queryRunner.commitTransaction();
    
            return this.usersRepository.findOne({
                where: { id: Number(id) },
                relations: ['roles'],
            });
    
        } catch (error) {
            console.error('Error assigning roles:', error);
            await queryRunner.rollbackTransaction();
    
            if (existingRoles.length > 0) {
                await queryRunner.manager.save(UserRole, existingRoles);
            }
    
            throw new InternalServerErrorException('Failed to assign roles');
        } finally {
            await queryRunner.release();
        }
    }
    
}
