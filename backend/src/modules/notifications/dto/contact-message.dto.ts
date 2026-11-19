import { Transform } from 'class-transformer';
import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class ContactMessageDto {
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsString() @IsNotEmpty() @MaxLength(100)
  firstName: string;

  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsString() @IsNotEmpty() @MaxLength(100)
  lastName: string;

  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsEmail() @MaxLength(254)
  email: string;

  @Transform(({ value }) => typeof value === 'string' ? value.trim() || undefined : value)
  @IsOptional() @IsString() @MaxLength(30)
  phone?: string;

  @IsIn(['consulta', 'cita', 'productos', 'precios', 'otro'])
  subject: 'consulta' | 'cita' | 'productos' | 'precios' | 'otro';

  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsString() @IsNotEmpty() @MaxLength(3000)
  message: string;
}
