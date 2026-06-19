import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SiteContentService {
  private readonly logger = new Logger(SiteContentService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Obtener todas las secciones del sitio
   */
  async findAll() {
    return this.prisma.siteContent.findMany({
      orderBy: { section: 'asc' },
    });
  }

  /**
   * Obtener una sección específica por su nombre
   */
  async findBySection(section: string) {
    return this.prisma.siteContent.findUnique({
      where: { section },
    });
  }

  /**
   * Crear o actualizar una sección (upsert)
   */
  async upsertSection(section: string, data: any, userId?: string) {
    this.logger.log(`Actualizando sección CMS: ${section}`);

    return this.prisma.siteContent.upsert({
      where: { section },
      update: {
        data,
        updatedBy: userId,
      },
      create: {
        section,
        data,
        updatedBy: userId,
      },
    });
  }

  /**
   * Eliminar una sección
   */
  async deleteSection(section: string) {
    return this.prisma.siteContent.delete({
      where: { section },
    });
  }
}
