import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient, Prisma } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(configService: ConfigService) {
    const connectionString = configService.get<string>('DATABASE_URL');
    const pool = new Pool({
      connectionString,
      max: 5, // Límite conservador para no saturar conexiones en Supabase Free Tier
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
    const adapter = new PrismaPg(pool);

    super({ adapter } as Prisma.PrismaClientOptions);
  }
  async onModuleInit() {
    await this.$connect();
    // Asegurar columna customerEmail para compras como invitado sin requerir migración manual
    await this.$executeRawUnsafe(
      'ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "customerEmail" TEXT;',
    ).catch(() => {});
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
