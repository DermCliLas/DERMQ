import {
  Controller,
  Post,
  Get,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ForbiddenException,
  UseGuards,
  Request,
  Query,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import {
  validateFileIntegrity,
  DEFAULT_ALLOWED_MIME_TYPES,
  AVATAR_ALLOWED_MIME_TYPES,
} from './utils/file-magic-bytes.validator';

import { PrismaService } from '../../prisma/prisma.service';

@Controller('storage')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StorageController {
  constructor(
    private readonly storageService: StorageService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Upload general assets / documents (CMS, products, etc.)
   * Only accessible to administrative staff and doctors.
   */
  @Post('upload')
  @Roles(Role.ADMIN, Role.RECEPTION, Role.DOCTOR)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    validateFileIntegrity(file, {
      allowedMimeTypes: DEFAULT_ALLOWED_MIME_TYPES,
      maxSizeBytes: 10 * 1024 * 1024,
    });

    const url = await this.storageService.uploadFile(file);
    return { success: true, url };
  }

  /**
   * Upload private clinical photos/records.
   * Only accessible to DOCTOR and ADMIN.
   * Returns only a private path (never a public URL).
   */
  @Post('clinical-upload')
  @Roles(Role.ADMIN, Role.DOCTOR)
  @UseInterceptors(FileInterceptor('file'))
  async uploadClinicalFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('patientId') patientId?: string,
    @Request() req?: any,
  ) {
    validateFileIntegrity(file, {
      allowedMimeTypes: [
        'image/jpeg',
        'image/png',
        'image/webp',
        'application/pdf',
      ],
      maxSizeBytes: 10 * 1024 * 1024,
    });

    const userRole = req?.user?.role;
    const userId = req?.user?.userId;

    // Si es médico, verificar que se indique patientId y que sea médico tratante
    if (userRole === Role.DOCTOR) {
      if (!patientId || patientId.trim() === '' || patientId === 'general') {
        throw new BadRequestException(
          'Es obligatorio especificar un patientId válido para subir archivos clínicos.',
        );
      }

      const hasAppointment = await this.prisma.appointment.findFirst({
        where: {
          doctorId: userId,
          patientId: patientId,
        },
      });

      const hasRecord = !hasAppointment
        ? await this.prisma.medicalRecord.findFirst({
            where: {
              doctorId: userId,
              patientId: patientId,
            },
          })
        : true;

      if (!hasAppointment && !hasRecord) {
        throw new ForbiddenException(
          'No estás autorizado para subir archivos clínicos de este paciente (no eres médico tratante).',
        );
      }
    }

    const result = await this.storageService.uploadClinicalFile(file, patientId);
    return { success: true, path: result.path };
  }

  /**
   * Generates a temporary signed URL with expiration for clinical records.
   * Patients can only request signed URLs for their own files.
   * Doctors can only request signed URLs if they are treating doctors of the patient.
   * Reception is denied access to private clinical files.
   */
  @Get('clinical-signed-url')
  @Roles(Role.ADMIN, Role.DOCTOR, Role.RECEPTION, Role.PATIENT)
  async getClinicalSignedUrl(
    @Query('path') filePath: string,
    @Request() req: any,
  ) {
    if (!filePath || filePath.trim().length === 0) {
      throw new BadRequestException('El parámetro path es obligatorio.');
    }

    const userRole = req.user.role;
    const userId = req.user.userId;

    // 1. Recepción: Prohibido explícitamente acceso a historias/fotos clínicas confidenciales
    if (userRole === Role.RECEPTION) {
      throw new ForbiddenException(
        'El personal de recepción no está autorizado para acceder a archivos clínicos confidenciales.',
      );
    }

    // Extraer patientId del path: clinical/{patientId}/...
    const match = filePath.match(/^clinical\/([^/]+)\//);
    const targetPatientId = match ? match[1] : null;

    // 2. Paciente: Solo puede acceder a su propio subdirectorio clínico
    if (userRole === Role.PATIENT) {
      if (!targetPatientId || targetPatientId !== userId) {
        throw new ForbiddenException(
          'No tienes permisos para acceder a este archivo clínico.',
        );
      }
    }

    // 3. Médico: Solo puede acceder si es médico tratante del paciente
    if (userRole === Role.DOCTOR) {
      if (!targetPatientId || targetPatientId === 'general') {
        throw new ForbiddenException(
          'Ruta clínica no asignada a un paciente específico.',
        );
      }

      const hasAppointment = await this.prisma.appointment.findFirst({
        where: {
          doctorId: userId,
          patientId: targetPatientId,
        },
      });

      const hasRecord = !hasAppointment
        ? await this.prisma.medicalRecord.findFirst({
            where: {
              doctorId: userId,
              patientId: targetPatientId,
            },
          })
        : true;

      if (!hasAppointment && !hasRecord) {
        throw new ForbiddenException(
          'Acceso denegado: El médico no es el tratante asignado de este paciente.',
        );
      }
    }

    const signedUrl = await this.storageService.getSignedUrl(filePath, 3600);
    return { success: true, signedUrl };
  }

  /**
   * Upload profile avatar safely.
   * Accessible to any authenticated user (including PATIENTS).
   */
  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    validateFileIntegrity(file, {
      allowedMimeTypes: AVATAR_ALLOWED_MIME_TYPES,
      maxSizeBytes: 2 * 1024 * 1024, // 2MB for avatars
    });

    const url = await this.storageService.uploadAvatar(file, req.user.userId);
    return { success: true, url };
  }
}
