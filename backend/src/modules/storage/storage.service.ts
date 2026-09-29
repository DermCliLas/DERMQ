import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { appConfig } from '../../config/app.config';
import * as crypto from 'crypto';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private supabase: SupabaseClient | null = null;
  private get publicBucketName(): string {
    return process.env.SUPABASE_BUCKET || appConfig.supabase.bucket || 'dermq';
  }

  private get clinicalBucketName(): string {
    return process.env.SUPABASE_CLINICAL_BUCKET || 'dermq-clinical';
  }

  constructor() {
    this.initSupabase();
  }

  private initSupabase(): SupabaseClient {
    if (this.supabase) return this.supabase;

    const url = process.env.SUPABASE_URL || appConfig.supabase?.url;
    const key = process.env.SUPABASE_KEY || appConfig.supabase?.key;

    if (!url || !key) {
      this.logger.error('SUPABASE_URL o SUPABASE_KEY no están configurados en el entorno.');
      throw new BadRequestException('Las credenciales de Supabase Storage no están configuradas.');
    }

    try {
      this.supabase = createClient(url, key);
      this.logger.log(`Supabase Storage service inicializado exitosamente (Público: ${this.publicBucketName}, Clínico Privado: ${this.clinicalBucketName}).`);
      this.ensureBucketsExist();
      return this.supabase;
    } catch (err: any) {
      this.logger.error('Error al inicializar cliente de Supabase Storage:', err);
      throw new BadRequestException(`Fallo al inicializar almacenamiento: ${err.message}`);
    }
  }

  /**
   * Verifies if the public and private clinical buckets exist, creating them if not.
   */
  private async ensureBucketsExist() {
    try {
      if (!this.supabase) return;
      const { data: buckets, error: listError } = await this.supabase.storage.listBuckets();
      if (listError) {
        this.logger.error('Error listing buckets in Supabase:', listError);
        return;
      }

      // 1. Bucket público (assets generales, productos, avatares)
      const publicExists = buckets?.some(b => b.name === this.publicBucketName);
      if (!publicExists) {
        this.logger.log(`Bucket público '${this.publicBucketName}' no encontrado. Creando con public: true...`);
        const { error: createError } = await this.supabase.storage.createBucket(this.publicBucketName, {
          public: true,
        });
        if (createError) {
          this.logger.error(`Failed to create bucket '${this.publicBucketName}':`, createError);
        } else {
          this.logger.log(`Bucket público '${this.publicBucketName}' creado exitosamente.`);
        }
      }

      // 2. Bucket privado para fotos y expedientes clínicos confidenciales
      const clinicalExists = buckets?.some(b => b.name === this.clinicalBucketName);
      if (!clinicalExists) {
        this.logger.log(`Bucket clínico privado '${this.clinicalBucketName}' no encontrado. Creando con public: false...`);
        const { error: createError } = await this.supabase.storage.createBucket(this.clinicalBucketName, {
          public: false, // BUCKET ESTRICTAMENTE PRIVADO
        });
        if (createError && !createError.message?.toLowerCase().includes('already exists')) {
          this.logger.error(`Failed to create clinical bucket '${this.clinicalBucketName}':`, createError);
        } else {
          this.logger.log(`Bucket clínico privado '${this.clinicalBucketName}' inicializado exitosamente.`);
        }
      }
    } catch (err) {
      this.logger.error('Exception checking/creating buckets:', err);
    }
  }

  /**
   * Uploads a file to Supabase Storage and returns its public URL.
   */
  async uploadFile(file: Express.Multer.File): Promise<string> {
    const supabase = this.initSupabase();

    try {
      // 1. Obtener la extensión y construir nombre único con UUID
      const fileExt = file.originalname.split('.').pop() || 'jpg';
      const uniqueId = crypto.randomUUID();
      const fileName = `uploads/${uniqueId}.${fileExt}`;

      this.logger.log(`Subiendo archivo a Supabase: ${fileName} (${file.mimetype}, ${file.size} bytes)`);

      // 2. Subir buffer al bucket público
      const { data, error } = await supabase.storage
        .from(this.publicBucketName)
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          cacheControl: '31536000', // 1 año de caché
          upsert: true,
        });

      if (error) {
        this.logger.error(`Error Supabase upload: ${error.message}`);
        throw new Error(error.message);
      }

      // 3. Obtener la URL pública del bucket público
      const { data: publicUrlData } = supabase.storage
        .from(this.publicBucketName)
        .getPublicUrl(fileName);

      if (!publicUrlData || !publicUrlData.publicUrl) {
        throw new Error('No se pudo obtener la URL pública de Supabase');
      }

      this.logger.log(`Archivo subido exitosamente a Supabase: ${publicUrlData.publicUrl}`);
      return publicUrlData.publicUrl;
    } catch (error: any) {
      this.logger.error(`Error al subir archivo a Supabase: ${error.message}`);
      throw new BadRequestException(
        `Error en carga de archivos a almacenamiento: ${error.message}`,
      );
    }
  }

  /**
   * Uploads clinical photos/documents to a strictly private clinical bucket in Supabase.
   * Returns only the private file path (no public URL).
   */
  async uploadClinicalFile(
    file: Express.Multer.File,
    patientId?: string,
  ): Promise<{ path: string }> {
    const supabase = this.initSupabase();

    try {
      const fileExt = file.originalname.split('.').pop() || 'jpg';
      const uniqueId = crypto.randomUUID();
      const folder = patientId ? `clinical/${patientId}` : 'clinical/general';
      const fileName = `${folder}/${uniqueId}.${fileExt}`;

      this.logger.log(`Subiendo archivo clínico a bucket privado (${this.clinicalBucketName}): ${fileName}`);

      const { error } = await supabase.storage
        .from(this.clinicalBucketName)
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          cacheControl: '0',
          upsert: false,
        });

      if (error) {
        throw new Error(error.message);
      }

      return { path: fileName };
    } catch (error: any) {
      this.logger.error(`Error al subir archivo clínico: ${error.message}`);
      throw new BadRequestException(
        `Error al guardar archivo clínico en almacenamiento: ${error.message}`,
      );
    }
  }

  /**
   * Generates a time-limited signed URL for private clinical photos/records from the private clinical bucket.
   */
  async getSignedUrl(filePath: string, expiresInSeconds = 3600): Promise<string> {
    const supabase = this.initSupabase();

    try {
      const { data, error } = await supabase.storage
        .from(this.clinicalBucketName)
        .createSignedUrl(filePath, expiresInSeconds);

      if (error || !data?.signedUrl) {
        throw new Error(error?.message || 'No se pudo generar la URL firmada');
      }

      return data.signedUrl;
    } catch (error: any) {
      this.logger.error(`Error al generar URL firmada: ${error.message}`);
      throw new BadRequestException(
        `No fue posible generar acceso al archivo clínico: ${error.message}`,
      );
    }
  }

  /**
   * Uploads user avatar safely into the avatars/ directory in the public bucket.
   */
  async uploadAvatar(
    file: Express.Multer.File,
    userId: string,
  ): Promise<string> {
    const supabase = this.initSupabase();

    try {
      const fileExt = file.originalname.split('.').pop() || 'jpg';
      const uniqueId = crypto.randomUUID();
      const fileName = `avatars/${userId}-${uniqueId}.${fileExt}`;

      const { error } = await supabase.storage
        .from(this.publicBucketName)
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        throw new Error(error.message);
      }

      const { data: publicUrlData } = supabase.storage
        .from(this.publicBucketName)
        .getPublicUrl(fileName);

      if (!publicUrlData?.publicUrl) {
        throw new Error('No se pudo obtener URL del avatar');
      }

      return publicUrlData.publicUrl;
    } catch (error: any) {
      this.logger.error(`Error al subir avatar: ${error.message}`);
      throw new BadRequestException(
        `Error al actualizar avatar de usuario: ${error.message}`,
      );
    }
  }
}
