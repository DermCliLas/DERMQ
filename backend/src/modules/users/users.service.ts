import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private mapToResponse(user: any): UserResponseDto {
    const { password, ...userData } = user;
    return userData;
  }

  async create(createUserDto: CreateUserDto, currentUserRole: Role) {
    // Solo ADMIN puede crear usuarios con roles diferentes a PATIENT
    if (createUserDto.role !== Role.PATIENT && currentUserRole !== Role.ADMIN) {
      throw new ForbiddenException(
        'Solo los administradores pueden crear usuarios con roles especiales',
      );
    }

    // Verificar si el usuario ya existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('El usuario ya existe');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Crear el usuario
    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        dni: createUserDto.dni,
        phone: createUserDto.phone,
        role: createUserDto.role,
        specialty: createUserDto.specialty,
        bio: createUserDto.bio,
        avatarUrl: createUserDto.avatarUrl,
      },
    });

    return this.mapToResponse(user);
  }

  async findAll(role?: Role, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const where = role ? { role } : {};

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          dni: true,
          phone: true,
          role: true,
          specialty: true,
          bio: true,
          avatarUrl: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        dni: true,
        phone: true,
        role: true,
        specialty: true,
        bio: true,
        avatarUrl: true,
        googleSyncToken: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        dni: true,
        phone: true,
        role: true,
        specialty: true,
        bio: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con email ${email} no encontrado`);
    }

    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    currentUserId: string,
    currentUserRole: Role,
  ) {
    // Verificar si el usuario existe
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // Solo el propio usuario o un ADMIN puede actualizar
    if (currentUserId !== id && currentUserRole !== Role.ADMIN) {
      throw new ForbiddenException(
        'No tienes permisos para actualizar este usuario',
      );
    }

    // Solo ADMIN puede cambiar roles
    if (updateUserDto.role && currentUserRole !== Role.ADMIN) {
      throw new ForbiddenException(
        'Solo los administradores pueden cambiar roles',
      );
    }

    // Si se está actualizando la contraseña, hashearla
    const updateData = { ...updateUserDto };
    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        dni: true,
        phone: true,
        role: true,
        specialty: true,
        bio: true,
        avatarUrl: true,
        googleSyncToken: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  async remove(id: string, currentUserId: string, currentUserRole: Role) {
    // Verificar si el usuario existe
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // Solo el propio usuario o un ADMIN puede eliminar
    if (currentUserId !== id && currentUserRole !== Role.ADMIN) {
      throw new ForbiddenException(
        'No tienes permisos para eliminar este usuario',
      );
    }

    // No permitir eliminar usuarios con citas activas
    const activeAppointments = await this.prisma.appointment.count({
      where: {
        OR: [
          { patientId: id, status: { in: ['PENDING', 'CONFIRMED'] } },
          { doctorId: id, status: { in: ['PENDING', 'CONFIRMED'] } },
        ],
      },
    });

    if (activeAppointments > 0) {
      throw new ForbiddenException(
        'No se puede eliminar un usuario con citas activas',
      );
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'Usuario eliminado correctamente' };
  }

  async getDoctors() {
    const doctors = await this.prisma.user.findMany({
      where: { role: Role.DOCTOR },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        specialty: true,
        bio: true,
        avatarUrl: true,
      },
      orderBy: { lastName: 'asc' },
    });

    return doctors;
  }

  async updateProfile(userId: string, updateUserDto: UpdateUserDto) {
    const updateData = { ...updateUserDto };

    // No permitir cambiar el rol desde el perfil
    delete updateData.role;

    // Si se está actualizando la contraseña, hashearla
    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        dni: true,
        phone: true,
        role: true,
        specialty: true,
        bio: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  async getPatientDashboardStats(userId: string) {
    const [appointmentCount, orderCount, lastOrders, upcomingAppointments] =
      await Promise.all([
        this.prisma.appointment.count({ where: { patientId: userId } }),
        this.prisma.order.count({ where: { userId } }),
        this.prisma.order.findMany({
          where: { userId },
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            items: {
              include: { product: { select: { name: true } } },
            },
          },
        }),
        this.prisma.appointment.findMany({
          where: {
            patientId: userId,
            date: { gte: new Date() },
            status: { in: ['PENDING', 'CONFIRMED'] },
          },
          take: 3,
          orderBy: { date: 'asc' },
          include: {
            doctor: {
              select: { firstName: true, lastName: true, specialty: true },
            },
            service: { select: { name: true } },
          },
        }),
      ]);

    return {
      stats: {
        appointmentCount,
        orderCount,
        loyaltyPoints: orderCount * 10, // Mock loyalty logic
      },
      recentOrders: lastOrders,
      upcomingAppointments,
    };
  }
}
