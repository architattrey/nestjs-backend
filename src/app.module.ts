import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
//import { UsersModule } from './users/users.module';
//import { RolesModule } from './roles/roles.module';
//import { DocumentsModule } from './documents/documents.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(databaseConfig),
    //UsersModule,
   // RolesModule,
   // DocumentsModule,
  ],
})
export class AppModule {}
