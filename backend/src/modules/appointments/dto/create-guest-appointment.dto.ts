import { Transform } from 'class-transformer';
import { IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateGuestAppointmentDto {
  @IsUUID()
  doctorId: string;

  @IsUUID()
  serviceId: string;

  @IsDateString({ strict: true })
  date: string;

  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsEmail()
  @MaxLength(254)
  email: string;

  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName: string;

  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName: string;

  @Transform(({ value }) => typeof value === 'string' ? value.trim() || undefined : value)
  @IsOptional()
  @IsString()
  @MaxLength(30)
  dni?: string;

  @Transform(({ value }) => typeof value === 'string' ? value.trim() || undefined : value)
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}
