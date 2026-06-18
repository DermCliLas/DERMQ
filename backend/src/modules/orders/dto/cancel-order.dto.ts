import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CancelOrderDto {
  @IsString()
  @IsNotEmpty({ message: 'El motivo de anulación es obligatorio' })
  @MinLength(5, { message: 'El motivo debe tener al menos 5 caracteres' })
  reason: string;
}
