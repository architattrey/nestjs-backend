import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsController } from '../../src/documents/documents.controller';
import { DocumentsService } from '../../src/documents/documents.service';

describe('DocumentsController', () => {
    let documentsController: DocumentsController;
    let documentsService: DocumentsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DocumentsController],
            providers: [
                {
                    provide: DocumentsService,
                    useValue: {
                        uploadOrUpdateDocument: jest.fn(),
                    },
                },
            ],
        }).compile();

        documentsController = module.get<DocumentsController>(DocumentsController);
        documentsService = module.get<DocumentsService>(DocumentsService);
    });

    it('should be defined', () => {
        expect(documentsController).toBeDefined();
    });

    describe('uploadFile', () => {
        it('should upload a file', async () => {
            const file = { path: 'test.pdf', filename: 'test.pdf' };
            const body = { title: 'Test Document' };
            const req = { user: { id: 1 } };

            jest.spyOn(documentsService, 'uploadOrUpdateDocument').mockResolvedValue({
                message: 'Document uploaded successfully',
                filename: 'test.pdf',
                status: 'success',
            });

            const result = await documentsController.uploadFile(file as any, body, req);
            expect(result).toEqual({
                message: 'Document uploaded successfully',
                filename: 'test.pdf',
                status: 'success',
            });
        });
    });
});