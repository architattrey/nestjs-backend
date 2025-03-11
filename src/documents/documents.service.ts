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
        
        private readonly httpService: HttpService,// Injecting HttpService to communicate with external FastAPI service
        @InjectRepository(Document)
        private documentRepository: Repository<Document>,// Injecting TypeORM repository for Document entity
    ) { }
    /**
    * Fetch all documents belonging to a specific owner
    * @param ownerId - ID of the document owner
    * @returns List of documents
    */
    async findAll(ownerId: number) {
        return this.documentRepository.find({ where: { owner: { id: ownerId } } });
    }
    /**
    * Uploads a new document or updates an existing one
    * @param ownerId - ID of the document owner
    * @param title - Document title
    * @param file - Uploaded file
    * @param documentId - Optional, if provided updates existing document
    * @returns Response message with status
    */
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
            // Sending file to external FastAPI service for processing
            //using Python backend, via API call.

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
                    // Update Existing Document
                    await this.documentRepository.update(documentId, {
                        title,
                        filePath: response.data.filename,// Update file path with the new uploaded file
                    });

                    // Delete old file from server if it exists
                    if (oldDocument && oldDocument.filePath) {
                        await unlink(process.env.UPLOADS_PATH + '/' + oldDocument.filePath).catch(() => null);
                    }
                    return {
                        message: 'Document updated successfully',
                        filename: response.data.filename,
                        status: 'success',
                    };
                } else {
                    // Upload New Document
                    const document = this.documentRepository.create({
                        title,
                        filePath: response.data.filename,
                        owner: { id: ownerId },// Associate document with the owner
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
            return {
                message: error.response?.data?.detail || 'Failed to upload/update document',
                status: 'fail',
            };
        }
    }
    /**
    * Deletes a document from the database and file system
    * @param id - Document ID
    * @returns Response message
    */
    async remove(id: number) {
        const document = await this.documentRepository.findOne({ where: { id } });
        if (document) {
            // Delete file from server storage
            await unlink(process.env.UPLOADS_PATH + '/' + document.filePath).catch(() => null);
            await this.documentRepository.delete(id); // Delete document record from database
        }
        return { message: 'Document deleted successfully' };
    }
}
// This service provides methods for interacting with the documents table in the database.