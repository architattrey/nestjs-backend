import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from '../../src/documents/documents.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Document } from '../../src/documents/entities/document.entity';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';

describe('DocumentsService', () => {
    let documentsService: DocumentsService;
    let documentRepository: Repository<Document>;
    let httpService: HttpService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DocumentsService,
                {
                    provide: getRepositoryToken(Document),
                    useValue: {
                        find: jest.fn(),
                        findOne: jest.fn(),
                        create: jest.fn(),
                        save: jest.fn(),
                        delete: jest.fn(),
                    },
                },
                {
                    provide: HttpService,
                    useValue: {
                        post: jest.fn(),
                    },
                },
            ],
        }).compile();

        documentsService = module.get<DocumentsService>(DocumentsService);
        documentRepository = module.get<Repository<Document>>(getRepositoryToken(Document));
        httpService = module.get<HttpService>(HttpService);
    });

    it('should be defined', () => {
        expect(documentsService).toBeDefined();
    });

    describe('uploadOrUpdateDocument', () => {
        it('should upload a new document', async () => {
            const file = { path: 'test.pdf', filename: 'test.pdf' };
            const ownerId = 1;
            const title = 'Test Document';

            jest.spyOn(httpService, 'post').mockReturnValue(
                of({ data: { status: 'success', filename: 'test.pdf' } } as any),
            );
            const mockDocument = {
                id: 1,
                title: 'Test Document',
                content: 'Sample content here',  // Add content property
                filePath: 'test.pdf',
                ownerId: 15,
                owner: {
                    id: 15,
                    username: 'archit attrey',
                    email: 'architattrey@gmail.com',
                    password: 'hashedpassword',  // Add missing password property
                    roles: [],  // Add missing roles property (assuming an empty array)
                },
            };
            jest.spyOn(documentRepository, 'create').mockReturnValue(mockDocument);
            jest.spyOn(documentRepository, 'save').mockResolvedValue(mockDocument);

            const result = await documentsService.uploadOrUpdateDocument(ownerId, title, file as any);
            expect(result).toEqual({
                message: 'Document uploaded successfully',
                filename: 'test.pdf',
                status: 'success',
            });
        });
    });
});