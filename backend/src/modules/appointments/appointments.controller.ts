import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role, AppointmentStatus } from '@prisma/client';
import { Public } from '../../common/decorators/public.decorator';

@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.RECEPTION, Role.PATIENT)
  create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @Request() req: any,
  ) {
    // Si es un paciente, forzar que sea su propia cita
    if (req.user.role === Role.PATIENT) {
      createAppointmentDto.patientId = req.user.userId;
    }

    return this.appointmentsService.create(
      createAppointmentDto,
      req.user.userId,
      req.user.role,
    );
  }

  @Public()
  @Post('guest')
  async createGuest(@Body() body: any) {
    return this.appointmentsService.createGuest(body);
  }

  @Get()
  findAll(
    @Request() req: any,
    @Query('patientId') patientId?: string,
    @Query('doctorId') doctorId?: string,
    @Query('status') status?: AppointmentStatus,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const filters = {
      patientId,
      doctorId,
      status,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };

    return this.appointmentsService.findAll(
      filters,
      parseInt(page, 10),
      parseInt(limit, 10),
      req.user.role,
      req.user.userId,
    );
  }

  @Get('available-slots/:doctorId')
  @Public()
  getAvailableSlots(
    @Param('doctorId') doctorId: string,
    @Query('date') dateString: string,
  ) {
    const date = dateString ? new Date(dateString) : new Date();
    return this.appointmentsService.getAvailableSlots(doctorId, date);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.appointmentsService.findOne(id, req.user.userId, req.user.role);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @Request() req: any,
  ) {
    return this.appointmentsService.update(
      id,
      updateAppointmentDto,
      req.user.userId,
      req.user.role,
    );
  }

  @Patch(':id/status/:status')
  @Roles(Role.ADMIN, Role.RECEPTION, Role.DOCTOR)
  updateStatus(
    @Param('id') id: string,
    @Param('status') status: AppointmentStatus,
    @Request() req: any,
  ) {
    return this.appointmentsService.updateStatus(
      id,
      status,
      req.user.userId,
      req.user.role,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.appointmentsService.remove(id, req.user.userId, req.user.role);
  }

  @Get('doctor/:doctorId/schedule')
  @Roles(Role.ADMIN, Role.RECEPTION, Role.DOCTOR)
  getDoctorSchedule(
    @Param('doctorId') doctorId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Request() req: any,
  ) {
    // Verificar que el doctor sea el mismo usuario o tenga permisos
    if (req.user.role === Role.DOCTOR && req.user.userId !== doctorId) {
      throw new Error('No tienes permisos para ver este horario');
    }

    const filters = {
      doctorId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };

    return this.appointmentsService.findAll(
      filters,
      1,
      100, // Límite alto para obtener todo el horario
      req.user.role,
      req.user.userId,
    );
  }

  @Get('patient/:patientId/history')
  @Roles(Role.ADMIN, Role.RECEPTION, Role.DOCTOR)
  getPatientHistory(
    @Param('patientId') patientId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Request() req: any,
  ) {
    // Doctores solo pueden ver historial de sus pacientes
    if (req.user.role === Role.DOCTOR) {
      // Verificar que el paciente haya tenido citas con este doctor
      // Esta validación se puede implementar según necesidades
    }

    const filters = {
      patientId,
    };

    return this.appointmentsService.findAll(
      filters,
      parseInt(page, 10),
      parseInt(limit, 10),
      req.user.role,
      req.user.userId,
    );
  }
}
