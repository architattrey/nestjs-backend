import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';


export class UpdateUserDto {
    // The 'username','email', 'password' fields will be validated using the class-validator decorators
    @IsString()
    @IsOptional()// Makes this field optional (not required for the update)
    username?: string;

    @IsEmail()
    @IsOptional()// Makes this field optional (not required for the update)
    email?: string;

    @IsString()
    @MinLength(6)
    password: string;
}
