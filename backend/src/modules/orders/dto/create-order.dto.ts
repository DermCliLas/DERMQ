import {
  IsString,
  IsArray,
  IsEnum,
  IsOptional,
  ValidateNested,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod, DocType, OrderSource } from '@prisma/client';

export class CreateOrderItemDto {
  @IsString()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsEnum(DocType)
  @IsOptional()
  documentType?: DocType;

  @IsEnum(OrderSource)
  @IsOptional()
  source?: OrderSource;

  @IsString()
  @IsOptional()
  krAnswer?: string;

  @IsString()
  @IsOptional()
  krHash?: string;

  @IsString()
  @IsOptional()
  customerDocType?: string; // "6" = RUC, "1" = DNI, "4" = CE, "7" = Pasaporte, "0" = Sin Doc

  @IsString()
  @IsOptional()
  customerDocNumber?: string; // RUC de 11 dígitos o DNI

  @IsString()
  @IsOptional()
  customerLegalName?: string; // Razón Social o Nombre del Cliente

  @IsString()
  @IsOptional()
  customerAddress?: string; // Dirección fiscal
}
