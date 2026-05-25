import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async create(createServiceDto: CreateServiceDto) {
    const { categoryId, ...serviceData } = createServiceDto;

    const service = await this.prisma.service.create({
      data: {
        ...serviceData,
        category: {
          connect: { id: categoryId },
        },
      },
      include: {
        category: true,
      },
    });

    return service;
  }

  async findAll(isActive?: boolean, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const where = isActive !== undefined ? { isActive } : {};

    const [services, total] = await Promise.all([
      this.prisma.service.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: true,
        },
        orderBy: { name: 'asc' },
      }),
      this.prisma.service.count({ where }),
    ]);

    return {
      data: services,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!service) {
      throw new NotFoundException(`Servicio con ID ${id} no encontrado`);
    }

    return service;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto) {
    const existingService = await this.prisma.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      throw new NotFoundException(`Servicio con ID ${id} no encontrado`);
    }

    const { categoryId, ...updateData } = updateServiceDto;

    const data: any = { ...updateData };

    if (categoryId) {
      data.category = {
        connect: { id: categoryId },
      };
    }

    const updatedService = await this.prisma.service.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    });

    return updatedService;
  }

  async remove(id: string) {
    const existingService = await this.prisma.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      throw new NotFoundException(`Servicio con ID ${id} no encontrado`);
    }

    // Verificar si el servicio tiene citas asociadas
    const appointments = await this.prisma.appointment.count({
      where: { serviceId: id },
    });

    if (appointments > 0) {
      // Desactivar en lugar de eliminar
      const updatedService = await this.prisma.service.update({
        where: { id },
        data: { isActive: false },
      });

      return {
        message: 'Servicio desactivado (tiene citas asociadas)',
        service: updatedService,
      };
    }

    await this.prisma.service.delete({
      where: { id },
    });

    return { message: 'Servicio eliminado correctamente' };
  }

  async getByCategory(categoryId: string, isActive?: boolean) {
    const where: any = { categoryId };

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const services = await this.prisma.service.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: { name: 'asc' },
    });

    return services;
  }

  async getFullCatalog() {
    return this.prisma.category.findMany({
      include: {
        services: {
          where: { isActive: true },
          orderBy: { name: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    });
  }
}
