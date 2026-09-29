import { IsInt, Min, IsEnum } from 'class-validator';

export enum StockOperation {
  ADD = 'add',
  SUBTRACT = 'subtract',
}

export class UpdateStockDto {
  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @Min(1, { message: 'La cantidad a modificar debe ser al menos 1' })
  quantity: number;

  @IsEnum(StockOperation, {
    message: 'La operación debe ser "add" o "subtract"',
  })
  operation: StockOperation;
}
