import { PrismaClient, Role } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

async function seedMocks() {
  console.log('Sembrando Especialistas y Servicios Mock...');

  // Doctores
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('123456', salt);

  const doctor1 = await prisma.user.upsert({
    where: { email: 'doctora.ana@dermq.com' },
    update: {},
    create: {
      email: 'doctora.ana@dermq.com',
      password: passwordHash,
      firstName: 'Ana',
      lastName: 'Gómez',
      role: Role.DOCTOR,
      specialty: 'Dermatología Clínica',
      bio: 'Especialista en acné y enfermedades de la piel.',
    },
  });

  // Categorías y Servicios
  const catClinica = await prisma.category.create({
    data: {
      name: 'Clínica',
      description: 'Tratamientos médicos para la piel.',
    }
  });

  await prisma.service.create({
    data: {
      categoryId: catClinica.id,
      name: 'Consulta Dermatológica General',
      description: '45 min • Primera consulta',
      price: 120,
      durationMin: 45,
    }
  });

  console.log('¡Mocks de servicios y doctores inyectados con éxito!');
}

seedMocks()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
