import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DocumentsModule } from './documents/documents.module';

// Main application module definition
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),// ConfigModule is loaded globally to manage environment variables
    TypeOrmModule.forRootAsync(databaseConfig),// TypeORM module is configured asynchronously using databaseConfig
    // Importing feature modules for user management, authentication, and document handling
    UsersModule,
    AuthModule,
    DocumentsModule,
  ],
})
export class AppModule { }
