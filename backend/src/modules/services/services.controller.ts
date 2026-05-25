import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '@prisma/client';
import { Public } from '../../common/decorators/public.decorator';

@Controller('services')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @Get('full-catalog')
  @Public()
  getFullCatalog() {
    return this.servicesService.getFullCatalog();
  }

  @Get()
  @Public()
  findAll(
    @Query('active') active?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const isActive =
      active === 'true' ? true : active === 'false' ? false : undefined;
    return this.servicesService.findAll(
      isActive,
      parseInt(page, 10),
      parseInt(limit, 10),
    );
  }

  @Get('category/:categoryId')
  @Public()
  getByCategory(
    @Param('categoryId') categoryId: string,
    @Query('active') active?: string,
  ) {
    const isActive =
      active === 'true' ? true : active === 'false' ? false : undefined;
    return this.servicesService.getByCategory(categoryId, isActive);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }
}
