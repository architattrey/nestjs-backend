import { IsString, IsEmail, MinLength } from 'class-validator';

export class LoginDto {
    @IsEmail()
    @IsString()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;
}
