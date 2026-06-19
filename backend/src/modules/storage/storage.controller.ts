import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('storage')
@UseGuards(JwtAuthGuard)
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se ha proporcionado ningún archivo en la solicitud.');
    }
    
    // Validar el tipo de archivo (ej. imágenes, PDFs o videos)
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'video/mp4',
      'video/webm',
      'video/ogg',
      'video/quicktime',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Tipo de archivo no permitido: ${file.mimetype}. Tipos válidos: JPG, PNG, GIF, WEBP, PDF, MP4, WEBM, OGG, MOV.`,
      );
    }

    // Validar tamaño máximo (ej. 10MB)
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSizeBytes) {
      throw new BadRequestException(
        `El archivo supera el tamaño máximo permitido de 10MB.`,
      );
    }

    const url = await this.storageService.uploadFile(file);
    return {
      success: true,
      url,
    };
  }
}
