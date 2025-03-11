import { Module, forwardRef  } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRole } from './entities/user_roles.entity';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { AuthModule } from '../auth/auth.module'; // Import AuthModule

@Module({
    imports: [
        TypeOrmModule.forFeature([ Role, User,UserRole]),
        forwardRef(() => AuthModule), // Handle circular dependency
    ],// Registers the User, UserRole, Role entities with TypeORM so that it can be used by the service
    controllers: [UsersController],// Specifies the controller responsible for handling the requests related to user operations
    providers: [UsersService],// Specifies the provider (UsersService) that will be injected into the controllers to handle business logic
    exports: [UsersService, TypeOrmModule],// Exports the UsersService so that it can be used in other modules if needed
})
export class UsersModule { }