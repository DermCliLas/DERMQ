import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);
const servicesList = [
  "Consulta médica en la especialidad de Dermatología",
  "Destrucción de lesiones (cauterizaciones) con radiofrecuencia y crioterapia",
  "Biopsias de piel para estudio de dermatopatología",
  "Cirugías ambulatorias, para extracción de lesiones",
  "Retiro de lunares",
  "Tratamiento de mejoría de cicatrices con láser en rostro y cuerpo",
  "Tratamiento de mejoría de enrojecimiento facial con láser",
  "Tratamiento de mejoría de la piel dañada por el sol con láser",
  "Mejoría de los signos de envejecimiento facial con láser",
  "Mejoría de las manchas oscuras en rostro con láser",
  "Mejoría de estrías con láser",
  "Retiro de tatuajes con láser",
  "Tratamiento de onicomicosis con láser",
  "Tratamiento de queloides con criocirugía e infiltración",
  "Aplicación de toxina botulínica para mejorar las arrugas de expresión y asimetrías faciales",
  "Aplicación de toxina botulínica para el manejo de la sudoración excesiva",
  "Aplicación de ácido hialurónico para el modelamiento facial, mejorando la estructura del rostro y para corregir asimetrías o cicatrices profundas",
  "Aplicación de ácido hialurónico para mejorar la calidad de la piel",
  "Mesoterapia con equipos y productos de calidad que mejoran el estado de la piel"
];

async function main() {
  console.log('Seeding Services...');

  // Create default category
  const category = await prisma.category.create({
    data: {
      name: 'Dermatología Clínica y Láser',
      description: 'Servicios de dermatología general, láser y estética médica.',
    }
  });

  console.log(`Created Category: ${category.name} (${category.id})`);

  for (const serviceName of servicesList) {
    const service = await prisma.service.create({
      data: {
        categoryId: category.id,
        name: serviceName,
        price: 150.0, // Default base price
        durationMin: 30, // Default duration
        isActive: true,
      }
    });
    console.log(`Created Service: ${service.name}`);
  }

  // Check if DRA MARCELA LEYVA SARTORI exists as Doctor, if not add her.
  let doc = await prisma.user.findFirst({ where: { email: 'mleyva@dermq.com' }});
  if (!doc) {
    doc = await prisma.user.create({
      data: {
        role: 'DOCTOR',
        email: 'mleyva@dermq.com',
        firstName: 'Marcela',
        lastName: 'Leyva Sartori',
        password: 'password123', // should hash in real app
        specialty: 'Dermatología Clínica y Láser',
      }
    });
    console.log(`Created Doctor: DRA MARCELA LEYVA SARTORI`);
  }

  console.log('Done seeding services!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
