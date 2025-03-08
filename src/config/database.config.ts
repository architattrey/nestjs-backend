import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';
//import { UserRole } from '../user-roles/user-roles.entity';
//import { Document } from '../documents/entities/document.entity';

export const databaseConfig = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'), // Read from .env file
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        //entities: [User, Role, UserRole, Document],
        synchronize: true, // Set to false in production; use migrations instead
        logging: true,
    }),
};
