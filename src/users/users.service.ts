import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AssignRolesDto } from './dto/assign-roles.dto';
import { UserRole } from '../user_roles/user-roles.entity';

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
    async assignRoles(id: string, assignRolesDto: AssignRolesDto): Promise<User | null> {
        const user = await this.usersRepository.findOne({ where: { id: Number(id) } }); // Finds the user by ID
        if (!user) throw new NotFoundException('User not found');

        const roles = await this.rolesRepository.findByIds(assignRolesDto.roleIds); // Finds roles based on the provided role IDs
        if (!roles || roles.length === 0) throw new NotFoundException('Roles not found');

        let existingRoles: UserRole[] = []; // Declare existingRoles outside the try block to access in the catch block.

        // Start a transaction using queryRunner
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Backup existing roles in case of rollback
            existingRoles = await this.userRolesRepository.find({ where: { user: { id: Number(id) } } });

            // Remove old roles from the user
            await queryRunner.manager
                .createQueryBuilder()
                .relation(User, 'roles')
                .of(user)
                .remove(user.roles); // Removes old roles using relation mapping

            // Create new user-role associations
            const userRoles = roles.map(role => {
                const userRole = new UserRole(); // Creates a new UserRole entity for each role
                userRole.user = user; // Links the role to the user
                userRole.role = role; // Links the role entity
                return userRole;
            });

            // Save new roles to the user-role relationship table
            await queryRunner.manager.save(UserRole, userRoles);

            // Commit the transaction
            await queryRunner.commitTransaction();

            // Return the updated user with roles after successful assignment
            return this.usersRepository.findOne({
                where: { id: Number(id) }, relations: ['roles']
            });

        } catch (error) {
            // Rollback the transaction in case of failure
            await queryRunner.rollbackTransaction();

            // Restore previous roles in case of failure
            if (existingRoles.length > 0) {
                await queryRunner.manager.save(UserRole, existingRoles);
            }

            throw new InternalServerErrorException('Failed to assign roles');
        } finally {
            // Release the queryRunner
            await queryRunner.release();
        }
    }

}
