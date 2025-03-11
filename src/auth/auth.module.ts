import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './auth.guard';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),// Registers User entity for use with TypeORM in this module 
        forwardRef(()=>UsersModule),// Resolves circular dependency between UsersModule and AuthModule
        JwtModule.registerAsync({
            imports: [ConfigModule],// Allows access to environment variables using ConfigModule
            inject: [ConfigService],// Injects ConfigService to access environment variables
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),// Retrieves JWT secret key from environment variables
                signOptions: { expiresIn: '1h' },// Sets token expiration time to 1 hour
            }),
        }),
    ],
    providers: [
        AuthService,// Handles authentication logic (login, validation, etc.)
        LocalStrategy,// Implements local authentication strategy (email/password)
        JwtStrategy,// Implements JWT authentication strategy
        JwtAuthGuard // Guard to protect routes requiring authentication
    ], // Provide it globally
    controllers: [AuthController],// Defines the AuthController to handle authentication routes
    exports: [
        AuthService,// Allows AuthService to be used in other modules
        JwtModule,// Exports the configured JWT module for use in other parts of the application
        JwtAuthGuard// Exports the authentication guard for route protection in other modules
    ], // Export it globally
})
export class AuthModule { }
