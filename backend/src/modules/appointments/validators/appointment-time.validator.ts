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
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const dayAppointments = await this.prisma.appointment.findMany({
      where: {
        doctorId,
        id: excludeAppointmentId ? { not: excludeAppointmentId } : undefined,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
      include: {
        service: {
          select: { durationMin: true },
        },
      },
    });

    const newStart = date.getTime();
    const newEnd = newStart + durationMinutes * 60000;

    for (const app of dayAppointments) {
      const appStart = new Date(app.date).getTime();
      const appEnd = appStart + app.service.durationMin * 60000;

      // Un traslape ocurre si el inicio de uno es menor que el fin del otro
      // y el fin del uno es mayor que el inicio del otro.
      if (newStart < appEnd && newEnd > appStart) {
        return false;
      }
    }

    return true;
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
