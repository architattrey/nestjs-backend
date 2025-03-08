import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
    imports: [TypeOrmModule.forFeature([User])],// Registers the User entity with TypeORM so that it can be used by the service
    controllers: [UsersController],// Specifies the controller responsible for handling the requests related to user operations
    providers: [UsersService],// Specifies the provider (UsersService) that will be injected into the controllers to handle business logic
    exports: [UsersService],// Exports the UsersService so that it can be used in other modules if needed
})
export class UsersModule { }