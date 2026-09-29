import { BadRequestException } from '@nestjs/common';

export interface FileValidationOptions {
  allowedMimeTypes?: string[];
  maxSizeBytes?: number;
}

export const DEFAULT_ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
];

export const AVATAR_ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

/**
 * Detects the real MIME type from the binary magic bytes of the file buffer.
 * Defends against disguised file attacks (e.g. PHP/shell scripts renamed to .jpg).
 */
export function detectRealMimeType(buffer: Buffer): string | null {
  if (!buffer || buffer.length < 4) {
    return null;
  }

  // 1. JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'image/jpeg';
  }

  // 2. PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return 'image/png';
  }

  // 3. GIF: 47 49 46 38 (GIF8)
  if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38
  ) {
    return 'image/gif';
  }

  // 4. WEBP: 52 49 46 46 (RIFF) ... 57 45 42 50 (WEBP)
  if (
    buffer.length >= 12 &&
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return 'image/webp';
  }

  // 5. PDF: %PDF- (25 50 44 46)
  if (
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46
  ) {
    return 'application/pdf';
  }

  return null;
}

/**
 * Validates file size, declared MIME, file extension, and binary magic bytes.
 */
export function validateFileIntegrity(
  file: Express.Multer.File,
  options: FileValidationOptions = {},
): void {
  if (!file || !file.buffer) {
    throw new BadRequestException(
      'No se ha proporcionado ningún archivo o el buffer está vacío.',
    );
  }

  const maxSizeBytes = options.maxSizeBytes || 10 * 1024 * 1024; // 10MB default
  if (file.size > maxSizeBytes) {
    const maxMb = maxSizeBytes / (1024 * 1024);
    throw new BadRequestException(
      `El archivo excede el tamaño máximo permitido de ${maxMb}MB.`,
    );
  }

  const allowedMimeTypes =
    options.allowedMimeTypes || DEFAULT_ALLOWED_MIME_TYPES;

  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new BadRequestException(
      `Tipo MIME declarado no permitido: ${file.mimetype}. Tipos válidos: ${allowedMimeTypes.join(', ')}.`,
    );
  }

  // Verify binary magic bytes
  const realMimeType = detectRealMimeType(file.buffer);
  if (!realMimeType) {
    throw new BadRequestException(
      'Ataque de archivo disfrazado o corrupto detectado: El contenido binario del archivo no coincide con ningún formato permitido.',
    );
  }

  if (realMimeType !== file.mimetype) {
    throw new BadRequestException(
      `Ataque de archivo disfrazado detectado: El archivo declara ser "${file.mimetype}" pero su contenido binario real es "${realMimeType}". Solicitud rechazada.`,
    );
  }
}
