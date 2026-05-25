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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '@prisma/client';
import { Public } from '../../common/decorators/public.decorator';

@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.RECEPTION)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
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
    return this.productsService.findAll(
      isActive,
      parseInt(page, 10),
      parseInt(limit, 10),
    );
  }

  @Get('search')
  @Public()
  search(
    @Query('q') query: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.productsService.search(
      query,
      parseInt(page, 10),
      parseInt(limit, 10),
    );
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Get('sku/:sku')
  @Public()
  findBySku(@Param('sku') sku: string) {
    return this.productsService.findBySku(sku);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.RECEPTION)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Patch(':id/stock')
  @Roles(Role.ADMIN, Role.RECEPTION)
  updateStock(
    @Param('id') id: string,
    @Body('quantity') quantity: number,
    @Body('operation') operation: 'add' | 'subtract',
  ) {
    return this.productsService.updateStock(id, quantity, operation);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
