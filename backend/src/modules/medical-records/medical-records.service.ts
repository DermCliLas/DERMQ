import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { Role } from '@prisma/client';

@Injectable()
export class MedicalRecordsService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateMedicalRecordDto, doctorId: string) {
    const { patientId, appointmentId, ...recordData } = createDto;

    // Verificar que el paciente exista
    const patient = await this.prisma.user.findUnique({
      where: { id: patientId },
    });

    if (!patient || patient.role !== Role.PATIENT) {
      throw new NotFoundException('Paciente no encontrado');
    }

    // Crear el registro médico
    const record = await this.prisma.medicalRecord.create({
      data: {
        ...recordData,
        patient: { connect: { id: patientId } },
        doctor: { connect: { id: doctorId } },
        ...(appointmentId && {
          appointment: { connect: { id: appointmentId } },
        }),
      },
      include: {
        doctor: {
          select: { firstName: true, lastName: true, specialty: true },
        },
        appointment: {
          select: { date: true, service: { select: { name: true } } },
        },
      },
    });

    return record;
  }

  async findByPatient(patientId: string, userId: string, userRole: Role) {
    // 1. Recepción: Denegado
    if (userRole === Role.RECEPTION) {
      throw new ForbiddenException(
        'El personal de recepción no está autorizado para acceder a historias clínicas confidenciales.',
      );
    }

    // 2. Si es un paciente, solo puede ver su propia historia
    if (userRole === Role.PATIENT && userId !== patientId) {
      throw new ForbiddenException(
        'No tienes permiso para ver esta historia clínica',
      );
    }

    // 3. Si es un médico, verificar que sea médico tratante
    if (userRole === Role.DOCTOR) {
      const hasAppointment = await this.prisma.appointment.findFirst({
        where: {
          doctorId: userId,
          patientId,
        },
      });

      const hasRecord = !hasAppointment
        ? await this.prisma.medicalRecord.findFirst({
            where: {
              doctorId: userId,
              patientId,
            },
          })
        : true;

      if (!hasAppointment && !hasRecord) {
        throw new ForbiddenException(
          'No estás autorizado para consultar la historia clínica de este paciente (no eres médico tratante).',
        );
      }
    }

    const records = await this.prisma.medicalRecord.findMany({
      where: { patientId },
      include: {
        doctor: {
          select: { firstName: true, lastName: true, specialty: true },
        },
        appointment: {
          select: { date: true, service: { select: { name: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return records;
  }

  async findPatientByDni(dni: string) {
    const patient = await this.prisma.user.findUnique({
      where: { dni },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        dni: true,
        avatarUrl: true,
      },
    });

    if (!patient) {
      throw new NotFoundException(
        `No se encontró ningún paciente con DNI ${dni}`,
      );
    }

    return patient;
  }

  async searchPatients(query: string) {
    if (!query || query.trim() === '') {
      return [];
    }

    const trimmed = query.trim();
    const isDni = /^\d+$/.test(trimmed);

    const where: any = {
      role: Role.PATIENT,
      OR: [
        { firstName: { contains: trimmed, mode: 'insensitive' } },
        { lastName: { contains: trimmed, mode: 'insensitive' } },
      ],
    };

    if (isDni) {
      where.OR.push({ dni: { contains: trimmed, mode: 'insensitive' } });
    }

    return this.prisma.user.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        dni: true,
        avatarUrl: true,
      },
      take: 20,
    });
  }

  async findOne(id: string, userId: string, userRole: Role) {
    const record = await this.prisma.medicalRecord.findUnique({
      where: { id },
      include: {
        patient: { select: { firstName: true, lastName: true, dni: true } },
        doctor: {
          select: { firstName: true, lastName: true, specialty: true },
        },
      },
    });

    if (!record) {
      throw new NotFoundException('Registro médico no encontrado');
    }

    // Protección de privacidad
    if (userRole === Role.RECEPTION) {
      throw new ForbiddenException(
        'El personal de recepción no está autorizado para acceder a registros clínicos.',
      );
    }

    if (userRole === Role.PATIENT && record.patientId !== userId) {
      throw new ForbiddenException(
        'No tienes permiso para acceder a este registro',
      );
    }

    if (userRole === Role.DOCTOR && record.doctorId !== userId) {
      const hasAppointment = await this.prisma.appointment.findFirst({
        where: {
          doctorId: userId,
          patientId: record.patientId,
        },
      });

      const hasOtherRecord = !hasAppointment
        ? await this.prisma.medicalRecord.findFirst({
            where: {
              doctorId: userId,
              patientId: record.patientId,
            },
          })
        : true;

      if (!hasAppointment && !hasOtherRecord) {
        throw new ForbiddenException(
          'No estás autorizado para acceder a este registro clínico (no eres el médico tratante de este paciente).',
        );
      }
    }

    return record;
  }
}
