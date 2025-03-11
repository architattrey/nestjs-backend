import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Request, UploadedFile, UseInterceptors, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('documents')

export class DocumentsController {

    constructor(private readonly documentsService: DocumentsService) { }
    /**
     * Fetch all documents belonging to the logged-in user
     * @param req - Request object containing user details
     * @returns List of documents for the user
     */
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN') // Admins can access
    @Get()
    findAll(@Request() req) {
        return this.documentsService.findAll(req.user.id);
    }
    /**
     * Uploads a new document and stores it in the file system
     * Using Python backend, possibly via API call.
     * @param file - Uploaded file from request
     * @param body - Contains title and other metadata
     * @returns Response message with uploaded document details
     */
    @UseGuards(JwtAuthGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: process.env.UPLOADS_PATH,// Directory where updated files are stored
            filename: (req, file, cb) => {
                // Generate a random unique filename
                const randomName = Array(32)
                    .fill(null)
                    .map(() => (Math.round(Math.random() * 16)).toString(16))
                    .join('');
                return cb(null, `${randomName}${extname(file.originalname)}`);
            },
        }),
    }))

    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: any,
        @Request() req
    ) {
        // Convert `ownerId` to number (as client sends it as a string)
        const ownerId = req.user.id;// Extract user ID from request set by JwtAuthGuard
        return this.documentsService.uploadOrUpdateDocument(ownerId, body.title, file); // Pass file instead of file.path
    }
    /**
     * Updates an existing document by replacing the file
     * @param file - New uploaded file
     * @param body - Contains documentId and updated title
     * @returns Response message with updated document details
     */
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: process.env.UPLOADS_PATH,// Directory where updated files are stored
            filename: (req, file, cb) => {
                // Generate a random unique filename
                const randomName = Array(32)
                    .fill(null)
                    .map(() => (Math.round(Math.random() * 16)).toString(16))
                    .join('');
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

        const ownerId = req.user.id;

        if (file) {
            return this.documentsService.uploadOrUpdateDocument(ownerId, body.title, file, documentId); // Pass file instead of file.path
        }
    }
    /**
   * Deletes a document by its ID
   * @param id - ID of the document to be deleted
   * @returns Response message indicating deletion status
   */
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.documentsService.remove(id);
    }
}

