import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

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
      data: createProductDto,
    });

    return product;
  }

  async findAll(isActive?: boolean, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const where = isActive !== undefined ? { isActive } : {};

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
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
      data: updateProductDto,
    });

    return updatedProduct;
  }

  async updateStock(
    id: string,
    quantity: number,
    operation: 'add' | 'subtract',
  ) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    let newStock = product.stock;

    if (operation === 'add') {
      newStock += quantity;
    } else if (operation === 'subtract') {
      if (product.stock < quantity) {
        throw new Error('Stock insuficiente');
      }
      newStock -= quantity;
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: { stock: newStock },
    });

    return updatedProduct;
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
