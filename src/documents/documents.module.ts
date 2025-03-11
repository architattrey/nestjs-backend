import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { HttpModule } from '@nestjs/axios'; // Import HttpModule for HttpService

@Module({
    imports: [
        TypeOrmModule.forFeature([Document]),
        HttpModule, // Add HttpModule to enable HttpService in DocumentsService
    ],
    controllers: [DocumentsController],
    providers: [DocumentsService],
    exports: [DocumentsService], // Export if needed in other modules
})
export class DocumentsModule {}
