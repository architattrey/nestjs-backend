import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from './entities/user_roles.entity';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';

@Module({
    imports: [TypeOrmModule.forFeature([UserRole]), UsersModule, RolesModule],
    exports: [TypeOrmModule],
})
// The UserRolesModule is a feature module that imports the TypeOrmModule to provide access to the UserRole entity.
// It also imports the UsersModule and RolesModule to establish relationships with the User and Role entities.
export class UserRolesModule { }
