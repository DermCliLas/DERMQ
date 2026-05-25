import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class AppointmentTimeValidator {
  constructor(private prisma: PrismaService) {}

  async isDoctorAvailable(
    doctorId: string,
    date: Date,
    durationMinutes: number,
    excludeAppointmentId?: string,
  ): Promise<boolean> {
    const appointmentEnd = new Date(date.getTime() + durationMinutes * 60000);

    const conflictingAppointments = await this.prisma.appointment.count({
      where: {
        doctorId,
        id: excludeAppointmentId ? { not: excludeAppointmentId } : undefined,
        OR: [
          // Cita nueva empieza durante una cita existente
          {
            date: { lte: date },
            // Calcular fin de cita existente
          },
          // Cita nueva termina durante una cita existente
          {
            date: { lte: appointmentEnd },
            // Calcular fin de cita existente
          },
          // Cita existente está dentro de la cita nueva
          {
            date: { gte: date },
            // Calcular fin de cita existente
          },
        ],
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    });

    return conflictingAppointments === 0;
  }

  async isWithinBusinessHours(date: Date): Promise<boolean> {
    const hour = date.getHours();
    const day = date.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado

    // Horario de negocio: Lunes a Viernes, 8:00 AM - 8:00 PM
    // Sábados: 9:00 AM - 2:00 PM
    if (day === 0) return false; // Domingo cerrado

    if (day >= 1 && day <= 5) {
      // Lunes a Viernes
      return hour >= 8 && hour < 20;
    } else if (day === 6) {
      // Sábado
      return hour >= 9 && hour < 14;
    }

    return false;
  }

  async isDateInFuture(date: Date): Promise<boolean> {
    const now = new Date();
    // Permitir citas con al menos 2 horas de anticipación
    const minimumAdvance = 2 * 60 * 60 * 1000; // 2 horas en milisegundos
    return date.getTime() > now.getTime() + minimumAdvance;
  }

  async validateAppointmentTime(
    doctorId: string,
    date: Date,
    durationMinutes: number,
    excludeAppointmentId?: string,
  ): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    // Validar horario de negocio
    if (!(await this.isWithinBusinessHours(date))) {
      errors.push('La cita debe estar dentro del horario de atención');
    }

    // Validar que sea en el futuro
    if (!(await this.isDateInFuture(date))) {
      errors.push('La cita debe ser con al menos 2 horas de anticipación');
    }

    // Validar disponibilidad del doctor
    if (
      !(await this.isDoctorAvailable(
        doctorId,
        date,
        durationMinutes,
        excludeAppointmentId,
      ))
    ) {
      errors.push('El doctor no está disponible en ese horario');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
