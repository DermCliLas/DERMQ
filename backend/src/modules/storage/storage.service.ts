import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { appConfig } from '../../config/app.config';
import * as crypto from 'crypto';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private supabase: SupabaseClient | null = null;
  private get bucketName(): string {
    return process.env.SUPABASE_BUCKET || appConfig.supabase.bucket || 'dermq';
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
      this.logger.log(`Supabase Storage service inicializado exitosamente (Bucket: ${this.bucketName}).`);
      this.ensureBucketExists();
      return this.supabase;
    } catch (err: any) {
      this.logger.error('Error al inicializar cliente de Supabase Storage:', err);
      throw new BadRequestException(`Fallo al inicializar almacenamiento: ${err.message}`);
    }
  }

  /**
   * Verifies if the bucket exists and creates it if not.
   */
  private async ensureBucketExists() {
    try {
      if (!this.supabase) return;
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
    const supabase = this.initSupabase();

    try {
      // 1. Obtener la extensión y construir nombre único con UUID
      const fileExt = file.originalname.split('.').pop() || 'jpg';
      const uniqueId = crypto.randomUUID();
      const fileName = `uploads/${uniqueId}.${fileExt}`;

      this.logger.log(`Subiendo archivo a Supabase: ${fileName} (${file.mimetype}, ${file.size} bytes)`);

      // 2. Subir buffer
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          cacheControl: '31536000', // 1 año de caché
          upsert: true,
        });

      if (error) {
        this.logger.error(`Error Supabase upload: ${error.message}`);
        throw new Error(error.message);
      }

      // 3. Obtener la URL pública del bucket
      const { data: publicUrlData } = supabase.storage
        .from(this.bucketName)
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
}
