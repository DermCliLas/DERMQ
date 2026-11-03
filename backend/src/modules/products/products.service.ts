import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateStockDto, StockOperation } from './dto/update-stock.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    // Verificar si el SKU ya existe
    const existingProduct = await this.prisma.product.findUnique({
      where: { sku: createProductDto.sku },
    });

    if (existingProduct) {
      throw new ConflictException(
        `El producto con SKU ${createProductDto.sku} ya existe`,
      );
    }

    const product = await this.prisma.product.create({
      data: {
        ...createProductDto,
        expirationDate: createProductDto.expirationDate
          ? new Date(createProductDto.expirationDate)
          : null,
      },
    });

    return product;
  }

  private getCategoryCondition(category?: string): any {
    if (!category) return undefined;
    const categoryKeywords: Record<string, string[]> = {
      'Renovadores Celulares': ['retinoico'],
      'Anti-Acné': ['benzoilo', 'acné', 'acne'],
      Despigmentantes: ['hidroquinona', 'despigmentante'],
      Queratolíticos: ['láctico', 'lactico', 'salicílico', 'salicilico', 'urea'],
      Corticoides: ['clobetasol', 'triamcinolona'],
      Astringentes: ['aluminio'],
      Antibióticos: ['eritromicina'],
      Antimicóticos: ['econazol'],
      'Tratamiento Capilar': ['minoxidil'],
      Anestésicos: ['anestesia', 'lidocaina', 'lidocaína'],
    };

    const keywords = categoryKeywords[category];
    if (keywords) {
      return {
        OR: keywords.map((kw) => ({
          name: { contains: kw, mode: 'insensitive' as const },
        })),
      };
    }

    if (category === 'Cuidado Dermatológico') {
      const allKeywords = Object.values(categoryKeywords).flat();
      return {
        NOT: {
          OR: allKeywords.map((kw) => ({
            name: { contains: kw, mode: 'insensitive' as const },
          })),
        },
      };
    }

    return undefined;
  }

  async findAll(
    isActive?: boolean,
    page: number = 1,
    limit: number = 12,
    sort?: string,
    search?: string,
    category?: string,
  ) {
    const skip = (page - 1) * limit;

    const andConditions: any[] = [];
    if (isActive !== undefined) {
      andConditions.push({ isActive });
    }

    if (search && search.trim().length > 0) {
      const q = search.trim();
      andConditions.push({
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { sku: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ],
      });
    }

    const catCond = this.getCategoryCondition(category);
    if (catCond) {
      andConditions.push(catCond);
    }

    const where = andConditions.length > 0 ? { AND: andConditions } : {};

    let orderBy: any = { name: 'asc' };
    if (sort === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price_desc') {
      orderBy = { price: 'desc' };
    } else if (sort === 'name_desc') {
      orderBy = { name: 'desc' };
    } else if (sort === 'stock_asc') {
      orderBy = { stock: 'asc' };
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return product;
  }

  async findBySku(sku: string) {
    const product = await this.prisma.product.findUnique({
      where: { sku },
    });

    if (!product) {
      throw new NotFoundException(`Producto con SKU ${sku} no encontrado`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    // Verificar si el producto existe
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    // Si se está cambiando el SKU, verificar que no exista otro producto con el mismo SKU
    if (updateProductDto.sku && updateProductDto.sku !== existingProduct.sku) {
      const productWithSku = await this.prisma.product.findUnique({
        where: { sku: updateProductDto.sku },
      });

      if (productWithSku) {
        throw new ConflictException(
          `El SKU ${updateProductDto.sku} ya está en uso`,
        );
      }
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: {
        ...updateProductDto,
        expirationDate:
          updateProductDto.expirationDate !== undefined
            ? updateProductDto.expirationDate
              ? new Date(updateProductDto.expirationDate)
              : null
            : undefined,
      },
    });

    return updatedProduct;
  }

  async updateStock(id: string, dto: UpdateStockDto) {
    const { quantity, operation } = dto;

    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    if (operation === StockOperation.ADD) {
      return this.prisma.product.update({
        where: { id },
        data: { stock: { increment: quantity } },
      });
    }

    if (operation === StockOperation.SUBTRACT) {
      const updateResult = await this.prisma.product.updateMany({
        where: { id, stock: { gte: quantity } },
        data: { stock: { decrement: quantity } },
      });

      if (updateResult.count === 0) {
        throw new BadRequestException(
          `Stock insuficiente para sustraer ${quantity} unidades. Stock actual: ${product.stock}.`,
        );
      }

      return this.prisma.product.findUnique({ where: { id } });
    }

    throw new BadRequestException(`Operación "${operation}" no válida.`);
  }

  async remove(id: string) {
    // Verificar si el producto existe
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    // Verificar si el producto tiene órdenes asociadas
    const orderItems = await this.prisma.orderItem.count({
      where: { productId: id },
    });

    if (orderItems > 0) {
      // En lugar de eliminar, desactivar el producto
      const updatedProduct = await this.prisma.product.update({
        where: { id },
        data: { isActive: false },
      });

      return {
        message: 'Producto desactivado (tiene órdenes asociadas)',
        product: updatedProduct,
      };
    }

    await this.prisma.product.delete({
      where: { id },
    });

    return { message: 'Producto eliminado correctamente' };
  }

  async search(query: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { sku: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
          isActive: true,
        },
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.prisma.product.count({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { sku: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
          isActive: true,
        },
      }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
