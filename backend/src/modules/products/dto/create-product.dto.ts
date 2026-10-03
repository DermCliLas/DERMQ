import { ProductFamily } from '@prisma/client';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  sku: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  stock: number = 0;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value))
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value))
  @IsEnum(ProductFamily)
  family?: ProductFamily;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value))
  @IsString()
  lotNumber?: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value))
  @IsDateString()
  expirationDate?: string;
}

