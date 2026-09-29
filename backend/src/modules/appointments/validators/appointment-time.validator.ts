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
    txPrisma: any = this.prisma,
  ): Promise<boolean> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const dayAppointments = await txPrisma.appointment.findMany({
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

  async isWithinBusinessHours(
    date: Date,
    durationMinutes = 0,
  ): Promise<boolean> {
    const day = date.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
    if (day === 0) return false; // Domingo cerrado

    const startHour = date.getHours();
    const startMinute = date.getMinutes();
    const startInMinutes = startHour * 60 + startMinute;
    const endInMinutes = startInMinutes + durationMinutes;

    // Horario de atención:
    // Lunes a Viernes: 8:00 AM (480 min) a 8:00 PM (1200 min)
    // Sábados: 9:00 AM (540 min) a 2:00 PM (840 min)
    if (day >= 1 && day <= 5) {
      return startInMinutes >= 8 * 60 && endInMinutes <= 20 * 60;
    } else if (day === 6) {
      return startInMinutes >= 9 * 60 && endInMinutes <= 14 * 60;
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
    txPrisma?: any,
  ): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    // Validar horario de negocio (incluyendo que la hora de término no exceda el cierre)
    if (!(await this.isWithinBusinessHours(date, durationMinutes))) {
      errors.push(
        'La cita y su duración deben estar dentro del horario de atención',
      );
    }

    // Validar que sea en el futuro
    if (!(await this.isDateInFuture(date))) {
      errors.push('La cita debe ser con al menos 2 horas de anticipación');
    }

    // Validar disponibilidad del doctor usando el cliente transaccional si está provisto
    if (
      !(await this.isDoctorAvailable(
        doctorId,
        date,
        durationMinutes,
        excludeAppointmentId,
        txPrisma,
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
