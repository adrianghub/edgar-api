import {
  Controller,
  Post,
  HttpException,
  HttpStatus,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FilesInterceptor } from '@nestjs/platform-express/multer';
import { DocsService } from './docs.service';

@Controller('docs')
export class DocsController {
  constructor(private readonly docsService: DocsService) {}

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', null, {
      storage: diskStorage({
        destination: './uploads',
        filename: (_, file, callback) => {
          const fileExtension = extname(file.originalname);
          callback(null, `${file.originalname.split('.')[0]}${fileExtension}`);
        },
      }),
      fileFilter: (_, file, callback) => {
        const allowedExtensions = ['.txt', '.pdf', '.docx'];
        const fileExtension = extname(file.originalname).toLowerCase();
        if (allowedExtensions.includes(fileExtension)) {
          callback(null, true);
        } else {
          callback(
            new HttpException(
              `Invalid file extension: ${fileExtension}`,
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
      },
    }),
  )
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    try {
      const savedFiles = [];

      for (const file of files) {
        savedFiles.push(file.originalname);
      }

      await this.docsService.processThroughVectorStore(savedFiles);

      return {
        message: 'Files uploaded successfully',
        fileCount: savedFiles.length,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
