import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { appConfig } from '../../config/app.config';
import * as crypto from 'crypto';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private supabase: SupabaseClient;
  private readonly bucketName = appConfig.supabase.bucket;

  constructor() {
    const { url, key } = appConfig.supabase;
    if (!url || !key) {
      this.logger.warn(
        'Supabase Storage URL or Key are not defined. Uploads will run in mock mode.',
      );
    } else {
      try {
        this.supabase = createClient(url, key);
        this.logger.log('Supabase Storage service initialized successfully.');
        this.ensureBucketExists();
      } catch (err) {
        this.logger.error('Failed to initialize Supabase Storage client:', err);
      }
    }
  }

  /**
   * Verifies if the bucket exists and creates it if not.
   */
  private async ensureBucketExists() {
    try {
      const { data: buckets, error: listError } = await this.supabase.storage.listBuckets();
      if (listError) {
        this.logger.error('Error listing buckets in Supabase:', listError);
        return;
      }
      const exists = buckets?.some(b => b.name === this.bucketName);
      if (!exists) {
        this.logger.log(`Bucket '${this.bucketName}' not found. Creating it...`);
        const { error: createError } = await this.supabase.storage.createBucket(this.bucketName, {
          public: true,
        });
        if (createError) {
          this.logger.error(`Failed to create bucket '${this.bucketName}':`, createError);
        } else {
          this.logger.log(`Bucket '${this.bucketName}' created successfully.`);
        }
      }
    } catch (err) {
      this.logger.error('Exception checking/creating bucket:', err);
    }
  }

  /**
   * Uploads a file to Supabase Storage and returns its public URL.
   */
  async uploadFile(file: Express.Multer.File): Promise<string> {
    if (!this.supabase) {
      this.logger.warn(
        `[MOCK STORAGE] Cargando archivo simulado: ${file.originalname}`,
      );
      // Retornar una URL de fallback útil en desarrollo
      return `https://images.unsplash.com/photo-1579684389782-64d84b5e901a?q=80&w=800`;
    }

    try {
      // 1. Obtener la extensión y construir nombre único con UUID
      const fileExt = file.originalname.split('.').pop() || '';
      const uniqueId = crypto.randomUUID();
      const fileName = `${uniqueId}.${fileExt}`;

      this.logger.log(`Subiendo archivo a Supabase: ${fileName} (${file.mimetype})`);

      // 2. Subir buffer
      const { data, error } = await this.supabase.storage
        .from(this.bucketName)
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          cacheControl: '31536000', // 1 año de caché
          upsert: false,
        });

      if (error) {
        throw new Error(error.message);
      }

      // 3. Obtener la URL pública del bucket
      const { data: publicUrlData } = this.supabase.storage
        .from(this.bucketName)
        .getPublicUrl(fileName);

      if (!publicUrlData || !publicUrlData.publicUrl) {
        throw new Error('No se pudo obtener la URL pública de Supabase');
      }

      this.logger.log(`Archivo subido exitosamente: ${publicUrlData.publicUrl}`);
      return publicUrlData.publicUrl;
    } catch (error) {
      this.logger.error(`Error al subir archivo a Supabase: ${error.message}`);
      throw new BadRequestException(
        `Error en carga de archivos a almacenamiento: ${error.message}`,
      );
    }
  }
}
