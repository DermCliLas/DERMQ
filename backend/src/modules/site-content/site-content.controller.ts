import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Req,
} from '@nestjs/common';
import { SiteContentService } from './site-content.service';
import { UpdateSiteContentDto } from './dto/update-site-content.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('site-content')
export class SiteContentController {
  constructor(private readonly siteContentService: SiteContentService) {}

  /**
   * GET /site-content — Lista todas las secciones (público)
   */
  @Public()
  @Get()
  async findAll() {
    return this.siteContentService.findAll();
  }

  /**
   * GET /site-content/:section — Obtiene una sección (público)
   */
  @Public()
  @Get(':section')
  async findBySection(@Param('section') section: string) {
    return this.siteContentService.findBySection(section);
  }

  /**
   * PUT /site-content/:section — Crea/actualiza una sección (solo ADMIN)
   */
  @Roles(Role.ADMIN)
  @Put(':section')
  async upsertSection(
    @Param('section') section: string,
    @Body() dto: UpdateSiteContentDto,
    @Req() req: any,
  ) {
    const userId = req.user?.id;
    return this.siteContentService.upsertSection(section, dto.data, userId);
  }

  /**
   * DELETE /site-content/:section — Elimina una sección (solo ADMIN)
   */
  @Roles(Role.ADMIN)
  @Delete(':section')
  async deleteSection(@Param('section') section: string) {
    return this.siteContentService.deleteSection(section);
  }
}
