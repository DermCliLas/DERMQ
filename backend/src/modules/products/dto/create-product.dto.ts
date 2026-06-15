import { ProductFamily } from '@prisma/client';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
  IsUrl,
  IsEnum,
  IsDateString,
} from 'class-validator';

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
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @IsOptional()
  @IsEnum(ProductFamily)
  family?: ProductFamily;

  @IsOptional()
  @IsString()
  lotNumber?: string;

  @IsOptional()
  @IsDateString()
  expirationDate?: string;
}
