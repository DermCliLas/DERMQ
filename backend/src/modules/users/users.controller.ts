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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '@prisma/client';
import { Public } from '../../common/decorators/public.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createUserDto: CreateUserDto, @Request() req: any) {
    return this.usersService.create(createUserDto, req.user.role);
  }

  @Get('patient-dashboard')
  getPatientDashboard(@Request() req: any) {
    return this.usersService.getPatientDashboardStats(req.user.userId);
  }

  @Get()
  @Roles(Role.ADMIN, Role.RECEPTION)
  findAll(
    @Query('role') role?: Role,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.usersService.findAll(
      role,
      parseInt(page, 10),
      parseInt(limit, 10),
    );
  }

  @Get('doctors')
  @Public()
  getDoctors() {
    return this.usersService.getDoctors();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.RECEPTION, Role.DOCTOR)
  findOne(@Param('id') id: string, @Request() req: any) {
    // Los doctores y recepcionistas solo pueden ver su propio perfil o perfiles de pacientes
    if (req.user.role !== Role.ADMIN && req.user.userId !== id) {
      // Verificar si es un paciente del doctor o recepcionista
      // Esta lógica se puede expandir según necesidades
    }
    return this.usersService.findOne(id);
  }

  @Get('email/:email')
  @Roles(Role.ADMIN, Role.RECEPTION)
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: any,
  ) {
    return this.usersService.update(
      id,
      updateUserDto,
      req.user.userId,
      req.user.role,
    );
  }

  @Patch('profile/me')
  updateProfile(@Body() updateUserDto: UpdateUserDto, @Request() req: any) {
    return this.usersService.updateProfile(req.user.userId, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.usersService.remove(id, req.user.userId, req.user.role);
  }
}
