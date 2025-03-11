import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Request, UploadedFile, UseInterceptors, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { DocumentsService } from './documents.service';


@Controller('documents')

export class DocumentsController {


    constructor( private readonly documentsService: DocumentsService) { }

    @Get()
    findAll(@Request() req) {
        return this.documentsService.findAll(req.user.id);
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return cb(null, `${randomName}${extname(file.originalname)}`);
            },
        }),
    }))
    
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: any,
        @Request() req
    ) {

        // Convert `ownerId` to number (as Postman sends it as a string)
        const ownerId = Number(15);
        return this.documentsService.uploadOrUpdateDocument(ownerId, body.title, file); // Pass file instead of file.path
    }


    @Patch(':id')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return cb(null, `${randomName}${extname(file.originalname)}`);
            },
        }),
    }))
    async updateFile(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: any,
        @Request() req
    ) {
        const documentId = Number(body.documentId);
        if (isNaN(documentId)) {
            throw new HttpException('Invalid document ID', HttpStatus.BAD_REQUEST);
        }

        const ownerId = Number(15);

        if (file) {
            return this.documentsService.uploadOrUpdateDocument(ownerId, body.title, file, documentId); // Pass file instead of file.path
        }
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.documentsService.remove(id);
    }
}

