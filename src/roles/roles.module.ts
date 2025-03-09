import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { UserRolesModule } from '../user_roles/user_roles.module';

@Module({
    imports: [TypeOrmModule.forFeature([Role]), UserRolesModule], // Import TypeOrmModule for Role entity and UserRolesModule for DB relation
})
export class RolesModule { }
