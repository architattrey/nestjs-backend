import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { unlink } from 'fs/promises'; // For file deletion
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import * as FormData from 'form-data';
import * as fs from 'fs';


@Injectable()
export class DocumentsService {
    constructor(
        private readonly httpService: HttpService,
        @InjectRepository(Document)
        private documentRepository: Repository<Document>,
    ) { }

    async findAll(ownerId: number) {
        return this.documentRepository.find({ where: { owner: { id: ownerId } } });
    }

    async uploadOrUpdateDocument(
        ownerId: number,
        title: string,
        file: Express.Multer.File,
        documentId?: number // Optional: If provided, update the document instead of creating a new one
    ) {
        if (!file) {
            throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
        }
    
        const formData = new FormData();
        formData.append('file', fs.createReadStream(file.path)); // Read file from disk
    
        try {
            const response = await lastValueFrom(
                this.httpService.post('http://127.0.0.1:8000/api/upload', formData, {
                    headers: {
                        ...formData.getHeaders(), // Set multipart headers
                    },
                })
            );
    
            // Check the FastAPI response
            if (response.status === 200 && response.data.status === 'success') {
                if (documentId) {
                    const oldDocument = await this.documentRepository.findOne({ where: { id: documentId } });
                    // **Update Existing Document**
                    await this.documentRepository.update(documentId, {
                        title,
                        filePath: response.data.filename,
                    });

                    // Delete old file
                    if (oldDocument && oldDocument.filePath) {
                        await unlink(process.env.UPLOADS_PATH+'/'+oldDocument.filePath).catch(() => null);
                    }
                    return {
                        message: 'Document updated successfully',
                        filename: response.data.filename,
                        status: 'success',
                    };
                } else {
                    // **Upload New Document**
                    const document = this.documentRepository.create({
                        title,
                        filePath: response.data.filename,
                        owner: { id: ownerId },
                    });
                    await this.documentRepository.save(document);
    
                    return {
                        message: 'Document uploaded successfully',
                        filename: response.data.filename,
                        status: 'success',
                    };
                }
            } else {
                throw new Error('FastAPI service returned failure');
            }
        } catch (error) {
            console.error('Error uploading document:', error);
    
            return {
                message: error.response?.data?.detail || 'Failed to upload/update document',
                status: 'fail',
            };
        }
    }
    
    async remove(id: number) {
        const document = await this.documentRepository.findOne({ where: { id } });
        if (document) {
            await unlink(process.env.UPLOADS_PATH+'/'+document.filePath).catch(() => null);
            await this.documentRepository.delete(id);
        }
        return { message: 'Document deleted successfully' };
    }
}
// This service provides methods for interacting with the documents table in the database.