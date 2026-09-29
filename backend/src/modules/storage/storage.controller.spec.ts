import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { Role } from '@prisma/client';

describe('StorageController & File Integrity Validation', () => {
  let controller: StorageController;
  let mockStorageService: any;
  let mockPrisma: any;

  beforeEach(() => {
    mockStorageService = {
      uploadFile: jest.fn().mockResolvedValue('https://supabase.co/uploads/valid.jpg'),
      uploadClinicalFile: jest.fn().mockResolvedValue({ path: 'clinical/pat-1/record.jpg' }),
      getSignedUrl: jest.fn().mockResolvedValue('https://supabase.co/signed/clinical/pat-1/record.jpg?token=abc'),
      uploadAvatar: jest.fn().mockResolvedValue('https://supabase.co/avatars/pat-1-avatar.jpg'),
    };
    mockPrisma = {
      appointment: {
        findFirst: jest.fn(),
      },
      medicalRecord: {
        findFirst: jest.fn(),
      },
    };
    controller = new StorageController(mockStorageService, mockPrisma);
  });

  describe('Disguised File (Magic Bytes) Protection', () => {
    it('should accept valid JPEG with authentic magic bytes (FF D8 FF)', async () => {
      // JPEG magic bytes: 0xFF, 0xD8, 0xFF, 0xE0
      const validJpegBuffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46]);
      const file: any = {
        buffer: validJpegBuffer,
        size: validJpegBuffer.length,
        mimetype: 'image/jpeg',
        originalname: 'photo.jpg',
      };

      const result = await controller.uploadFile(file);
      expect(result.success).toBe(true);
      expect(mockStorageService.uploadFile).toHaveBeenCalledWith(file);
    });

    it('should reject disguised file attack where executable script is disguised as JPEG', async () => {
      // PHP / script disguised as image/jpeg
      const maliciousScriptBuffer = Buffer.from('<?php echo "malicious payload"; ?>');
      const file: any = {
        buffer: maliciousScriptBuffer,
        size: maliciousScriptBuffer.length,
        mimetype: 'image/jpeg',
        originalname: 'evil.jpg',
      };

      await expect(controller.uploadFile(file)).rejects.toThrow(BadRequestException);
      await expect(controller.uploadFile(file)).rejects.toThrow('Ataque de archivo disfrazado');
    });

    it('should reject file exceeding maximum size limit', async () => {
      const largeBuffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0]);
      const file: any = {
        buffer: largeBuffer,
        size: 15 * 1024 * 1024, // 15MB > 10MB
        mimetype: 'image/jpeg',
        originalname: 'huge.jpg',
      };

      await expect(controller.uploadFile(file)).rejects.toThrow(BadRequestException);
      await expect(controller.uploadFile(file)).rejects.toThrow('excede el tamaño máximo');
    });
  });

  describe('Clinical Files & Signed URLs Security', () => {
    it('should forbid a PATIENT from obtaining a signed URL for another patient clinical file', async () => {
      const patientReq = {
        user: { userId: 'patient-victim', role: Role.PATIENT },
      };

      await expect(
        controller.getClinicalSignedUrl('clinical/patient-other/scan.pdf', patientReq),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should allow a PATIENT to obtain a signed URL for their own clinical file', async () => {
      const patientReq = {
        user: { userId: 'patient-123', role: Role.PATIENT },
      };

      const result = await controller.getClinicalSignedUrl(
        'clinical/patient-123/scan.pdf',
        patientReq,
      );
      expect(result.success).toBe(true);
      expect(result.signedUrl).toContain('https://supabase.co/signed/');
    });

    it('should strictly reject RECEPTION role from obtaining clinical signed URLs', async () => {
      const receptionReq = {
        user: { userId: 'reception-1', role: Role.RECEPTION },
      };

      await expect(
        controller.getClinicalSignedUrl('clinical/patient-123/scan.pdf', receptionReq),
      ).rejects.toThrow(ForbiddenException);
      await expect(
        controller.getClinicalSignedUrl('clinical/patient-123/scan.pdf', receptionReq),
      ).rejects.toThrow('recepción no está autorizado');
    });

    it('should forbid a DOCTOR who is NOT the treating doctor of the patient', async () => {
      const doctorReq = {
        user: { userId: 'doctor-intruder', role: Role.DOCTOR },
      };
      mockPrisma.appointment.findFirst.mockResolvedValue(null);
      mockPrisma.medicalRecord.findFirst.mockResolvedValue(null);

      await expect(
        controller.getClinicalSignedUrl('clinical/patient-999/scan.pdf', doctorReq),
      ).rejects.toThrow(ForbiddenException);
      await expect(
        controller.getClinicalSignedUrl('clinical/patient-999/scan.pdf', doctorReq),
      ).rejects.toThrow('no es el tratante asignado');
    });

    it('should allow a DOCTOR who IS the treating doctor of the patient', async () => {
      const doctorReq = {
        user: { userId: 'doctor-treating', role: Role.DOCTOR },
      };
      mockPrisma.appointment.findFirst.mockResolvedValue({ id: 'app-1', doctorId: 'doctor-treating', patientId: 'patient-999' });

      const result = await controller.getClinicalSignedUrl(
        'clinical/patient-999/scan.pdf',
        doctorReq,
      );
      expect(result.success).toBe(true);
      expect(mockStorageService.getSignedUrl).toHaveBeenCalledWith('clinical/patient-999/scan.pdf', 3600);
    });

    it('should allow an ADMIN to obtain signed URL for clinical files', async () => {
      const adminReq = {
        user: { userId: 'admin-1', role: Role.ADMIN },
      };

      const result = await controller.getClinicalSignedUrl(
        'clinical/patient-999/scan.pdf',
        adminReq,
      );
      expect(result.success).toBe(true);
    });
  });
});
