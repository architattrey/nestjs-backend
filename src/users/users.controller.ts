import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AssignRolesDto } from './dto/assign-roles.dto';

@Controller('users')// The route prefix for all endpoints in this controller will be 'users' (e.g., /users, /users/:id)
export class UsersController {
    constructor(private readonly usersService: UsersService) { } // Injecting the UsersService to handle the logic for user-related requests

    // Endpoint to create a new user
    @Post()// POST request to /users
    async create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }
    // Endpoint to retrieve all users
    @Get()// GET request to /users
    async findAll() {
        return this.usersService.findAll();
    }
    // Endpoint to retrieve a specific user by ID
    @Get(':id')// GET request to /users/:id
    async findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }
    // Endpoint to update a specific user by ID
    @Put(':id') // PUT request to /users/:id
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }
    // Endpoint to delete a specific user by ID
    @Delete(':id')// DELETE request to /users/:id
    async remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }
    // New endpoint to assign roles to a user
    @Post(':id/roles') // POST request to /users/:id/roles
    async assignRoles(
        @Param('id') id: string,
        @Body() assignRolesDto: AssignRolesDto,
    ) {
        return this.usersService.assignRoles(id, assignRolesDto);// Calls the assignRoles method of UsersService to assign roles to the user
    }
    // New endpoint to remove a role from a user
    @Delete(':id/roles/:roleId')// DELETE request to /users/:id/roles/:roleId
    async removeRole(
        @Param('id') id: string,
        @Param('roleId') roleId: string,
    ) {
        return this.usersService.removeRole(id, roleId); // Calls the removeRole method of UsersService to remove the specified role from the user
    }
}