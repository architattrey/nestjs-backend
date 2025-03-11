import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AssignRolesDto } from './dto/assign-roles.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('users')// The route prefix for all endpoints in this controller will be 'users' (e.g., /users, /users/:id)
export class UsersController {
    constructor(private readonly usersService: UsersService) { } // Injecting the UsersService to handle the logic for user-related requests

    // Endpoint to create a new user
    @Post()// POST request to /users
    async create(@Body() createUserDto: CreateUserDto) {
        const createUser = await this.usersService.create(createUserDto);
        await this.usersService.assignRoles(String(createUser.id)); // Assuming "viewer" has ID 3 at the time of new registration
    }
    // Endpoint to retrieve all users
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN') // Admins can access
    @Get()// GET request to /users
    async findAll() {
        return this.usersService.findAll();
    }

    // Endpoint to retrieve a specific user by ID
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('EDITOR', 'ADMIN', 'viewer') // Editors, Admins and viewer can access
    @Get(':id')// GET request to /users/:id
    async findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }
    // Endpoint to update a specific user by ID
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'viewer') // Admins and viewer can access
    @Put(':id') // PUT request to /users/:id
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }

    // Endpoint to delete a specific user by ID
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN', 'viewer') // Admins and viewer can access
    @Delete(':id')// DELETE request to /users/:id
    async remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }
    // New endpoint to assign roles to a user
    //@UseGuards(JwtAuthGuard, RolesGuard)
   // @Roles('ADMIN') // Admins and viewer can access
    @Post('roles/:id') // POST request to /users/:id/roles
    async assignRoles(
        @Param('id') id: string,
        @Body() assignRolesDto: AssignRolesDto,
    ) {
        return this.usersService.assignRoles(id, assignRolesDto);// Calls the assignRoles method of UsersService to assign roles to the user
    }
}