import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Request, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
    private readonly uploadPath: string;

    constructor(
        @InjectRepository(Document)
        private readonly documentsService: DocumentsService,
        private readonly configService: ConfigService,
    ) {
        this.uploadPath = this.configService.get<string>('UPLOADS_PATH', './uploads'); // Default value if not set
    }

    @Get()
    findAll(@Request() req) {
        return this.documentsService.findAll(req.user.id);
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './upload',//this.uploadPath,
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
            }
        })
    }))
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body: { title: string }, @Request() req) {
        return this.documentsService.uploadDocument(req.user.id, body.title, file.path);
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() updateData: { title?: string; content?: string }) {
        return this.documentsService.update(id, updateData);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.documentsService.remove(id);
    }
}
