import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MedicalRecordsService } from './medical-records.service';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('medical-records')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

  @Post()
  @Roles(Role.DOCTOR, Role.ADMIN)
  create(@Body() createDto: CreateMedicalRecordDto, @Request() req: any) {
    return this.medicalRecordsService.create(createDto, req.user.userId);
  }

  @Get('patient/:patientId')
  findByPatient(@Param('patientId') patientId: string, @Request() req: any) {
    return this.medicalRecordsService.findByPatient(
      patientId,
      req.user.userId,
      req.user.role,
    );
  }

  @Get('search')
  @Roles(Role.DOCTOR, Role.ADMIN, Role.RECEPTION)
  searchPatients(@Query('query') query: string) {
    return this.medicalRecordsService.searchPatients(query);
  }

  @Get('search-patient/:dni')
  @Roles(Role.DOCTOR, Role.ADMIN, Role.RECEPTION)
  findPatientByDni(@Param('dni') dni: string) {
    return this.medicalRecordsService.findPatientByDni(dni);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.medicalRecordsService.findOne(
      id,
      req.user.userId,
      req.user.role,
    );
  }
}
