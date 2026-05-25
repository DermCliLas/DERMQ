import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@Controller('branches')
export class BranchesController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @Public() // Allow listing branches for booking as well
  findAll() {
    return this.prisma.branch.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }
}
