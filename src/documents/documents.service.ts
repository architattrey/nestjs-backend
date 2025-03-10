import { Injectable } from '@nestjs/common';
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

    async uploadDocument(ownerId: number, title: string, filePath: string) {
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath)); // Read file from disk

        const response = await lastValueFrom(
            this.httpService.post('https://mock-python-ingestion/api/upload', formData, {
                headers: {
                    ...formData.getHeaders(), // Set multipart headers
                    Authorization: `Bearer YOUR_ACCESS_TOKEN`, // If required
                },
            }),
        );
        if (response.status !== 200) {
            throw new Error('Failed to upload document');
        }
        const document = this.documentRepository.create({ title, filePath, owner: { id: ownerId } });
        return this.documentRepository.save(document);
        
    }
    async update(id: number, updateData: { title?: string; content?: string }) {
            await this.documentRepository.update(id, updateData);
            return this.documentRepository.findOne({ where: { id } });
        }

    async remove(id: number) {
            const document = await this.documentRepository.findOne({ where: { id } });
            if (document) {
                await unlink(document.filePath).catch(() => null); // Delete file from uploads folder
                await this.documentRepository.delete(id);
            }
            return { message: 'Document deleted successfully' };
        }
    }
// This service provides methods for interacting with the documents table in the database.