import { ProductsService } from './products.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { StockOperation } from './dto/update-stock.dto';

describe('ProductsService - Stock Management', () => {
  let service: ProductsService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      product: {
        findUnique: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
      },
    };
    service = new ProductsService(mockPrisma);
  });

  it('should atomically increment stock on ADD operation', async () => {
    mockPrisma.product.findUnique.mockResolvedValue({ id: 'p1', stock: 10 });
    mockPrisma.product.update.mockResolvedValue({ id: 'p1', stock: 15 });

    const result = await service.updateStock('p1', {
      quantity: 5,
      operation: StockOperation.ADD,
    });

    expect(mockPrisma.product.update).toHaveBeenCalledWith({
      where: { id: 'p1' },
      data: { stock: { increment: 5 } },
    });
    expect(result).toBeDefined();
    expect(result!.stock).toBe(15);
  });

  it('should atomically decrement stock on SUBTRACT operation if stock is sufficient', async () => {
    mockPrisma.product.findUnique
      .mockResolvedValueOnce({ id: 'p1', stock: 10 })
      .mockResolvedValueOnce({ id: 'p1', stock: 7 });
    mockPrisma.product.updateMany.mockResolvedValue({ count: 1 });

    const result = await service.updateStock('p1', {
      quantity: 3,
      operation: StockOperation.SUBTRACT,
    });

    expect(mockPrisma.product.updateMany).toHaveBeenCalledWith({
      where: { id: 'p1', stock: { gte: 3 } },
      data: { stock: { decrement: 3 } },
    });
    expect(result).toBeDefined();
    expect(result!.stock).toBe(7);
  });

  it('should update a product with relative imageUrl and clear expirationDate', async () => {
    mockPrisma.product.findUnique.mockResolvedValue({ id: 'p1', sku: 'SKU1' });
    mockPrisma.product.update.mockResolvedValue({
      id: 'p1',
      sku: 'SKU1',
      name: 'Nuevo Nombre',
      imageUrl: '/product_tube.png',
      expirationDate: null,
    });

    const result = await service.update('p1', {
      name: 'Nuevo Nombre',
      imageUrl: '/product_tube.png',
      expirationDate: undefined,
    });

    expect(mockPrisma.product.update).toHaveBeenCalledWith({
      where: { id: 'p1' },
      data: {
        name: 'Nuevo Nombre',
        imageUrl: '/product_tube.png',
        expirationDate: undefined,
      },
    });
    expect(result.name).toBe('Nuevo Nombre');
  });

  it('should throw BadRequestException if SUBTRACT operation would result in negative stock', async () => {
    mockPrisma.product.findUnique.mockResolvedValue({ id: 'p1', stock: 2 });
    // UpdateMany count is 0 because stock: { gte: 5 } matched nothing
    mockPrisma.product.updateMany.mockResolvedValue({ count: 0 });

    await expect(
      service.updateStock('p1', {
        quantity: 5,
        operation: StockOperation.SUBTRACT,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException if product does not exist', async () => {
    mockPrisma.product.findUnique.mockResolvedValue(null);

    await expect(
      service.updateStock('non-existent', {
        quantity: 1,
        operation: StockOperation.ADD,
      }),
    ).rejects.toThrow(NotFoundException);
  });
});
