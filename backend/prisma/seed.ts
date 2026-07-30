import { PrismaClient, Role } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import * as XLSX from 'xlsx';
import * as path from 'path';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not defined.');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

// Mapeador de imágenes estéticas según el nombre del producto
function getProductImageUrl(name: string): string {
  const lowercaseName = name.toLowerCase();
  if (lowercaseName.includes('serum') || lowercaseName.includes('concentrate') || lowercaseName.includes('sérum') || lowercaseName.includes('solución') || lowercaseName.includes('fluid')) {
    return '/product_serum.png';
  } else if (lowercaseName.includes('caps') || lowercaseName.includes('cápsulas') || lowercaseName.includes('comprimidos')) {
    return '/product_capsules.png';
  } else if (lowercaseName.includes('espuma') || lowercaseName.includes('shampoo') || lowercaseName.includes('champu') || lowercaseName.includes('spray')) {
    return '/product_hair.png';
  }
  return '/product_tube.png';
}

async function main() {
  console.log('--- 🚀 Iniciando Proceso de Seed Completo (Catálogo Comercial DC LASER) ---');

  // 1. Asegurar Sede Principal
  console.log('1. Creando Sede Principal...');
  const branchPrincipal = await prisma.branch.upsert({
    where: { id: 'sede-principal-id' },
    update: {},
    create: {
      id: 'sede-principal-id',
      name: 'DERMQ - Sede Principal Surco',
      address: 'Av. José Gálvez Barrenechea 127, Oficina 604, San Isidro, Lima',
      phone: '+51 996 235 890',
      city: 'Lima',
      isActive: true,
    },
  });

  // 2. Crear Usuarios (Admin y Médico)
  console.log('2. Creando Usuarios por Defecto...');
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const doctorPasswordHash = await bcrypt.hash('doctor123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@dermq.pe' },
    update: {},
    create: {
      email: 'admin@dermq.pe',
      password: adminPasswordHash,
      firstName: 'Administrador',
      lastName: 'DERMQ',
      role: Role.ADMIN,
      phone: '+51 999 888 777',
    },
  });

  await prisma.user.upsert({
    where: { email: 'dra.leyva@dermq.pe' },
    update: {},
    create: {
      email: 'dra.leyva@dermq.pe',
      password: doctorPasswordHash,
      firstName: 'Dra. Vanessa',
      lastName: 'Leyva',
      role: Role.DOCTOR,
      phone: '+51 999 111 222',
      specialty: 'Dermatología Médica y Estética',
    },
  });

  // 3. Crear Categorías de Servicios
  console.log('3. Creando Categorías de Servicios...');
  const catEstetica = await prisma.category.upsert({
    where: { id: 'cat-estetica' },
    update: { name: 'Dermatología Estética' },
    create: {
      id: 'cat-estetica',
      name: 'Dermatología Estética',
      description: 'Tratamientos faciales y corporales de rejuvenecimiento y cuidado avanzado.',
    },
  });

  const catClinica = await prisma.category.upsert({
    where: { id: 'cat-clinica' },
    update: { name: 'Dermatología Clínica' },
    create: {
      id: 'cat-clinica',
      name: 'Dermatología Clínica',
      description: 'Consultas especializadas, diagnóstico de patologías de la piel, pelo y uñas.',
    },
  });

  const catQuirurgica = await prisma.category.upsert({
    where: { id: 'cat-quirurgica' },
    update: { name: 'Dermatología Quirúrgica' },
    create: {
      id: 'cat-quirurgica',
      name: 'Dermatología Quirúrgica',
      description: 'Procedimientos quirúrgicos menores, extirpación de lesiones y criocirugía.',
    },
  });

  // 4. Crear Servicios Dermatológicos
  console.log('4. Creando Servicios Dermatológicos...');
  const serviciosEsteticos = [
    { id: 'est-1', name: 'Limpieza Facial Profunda con Armónico', description: '60 min • Higiene cutánea profunda, extracción de impurezas, peeling ultrasónico y fototerapia LED', price: 180, durationMin: 60 },
    { id: 'est-2', name: 'Peeling Químico Médico', description: '45 min • Renovación celular con ácidos médicos (glicólico, mandélico, salicílico o TCA)', price: 250, durationMin: 45 },
    { id: 'est-3', name: 'Hydrafacial / Microdermoabrasión', description: '50 min • Exfoliación profunda con puntas de diamante e infusión de sueros antioxidantes', price: 280, durationMin: 50 },
    { id: 'est-4', name: 'Toxina Botulínica (Bótox)', description: '30 min • Atenuación de arrugas de expresión (frente, entrecejo y patas de gallo)', price: 650, durationMin: 30 },
    { id: 'est-5', name: 'Relleno con Ácido Hialurónico', description: '45 min • Volumetría labial, surcos nasogenianos o perfilado mandibular', price: 950, durationMin: 45 },
    { id: 'est-6', name: 'Dermapen / Microneedling', description: '60 min • Inducción percutánea de colágeno con factores de crecimiento e infusión de activos', price: 320, durationMin: 60 },
    { id: 'est-7', name: 'Luz Pulsada Intensa (IPL) Facial', description: '45 min • Rejuvenecimiento, atenuación de manchas solares y rojeces/rosácea', price: 380, durationMin: 45 },
    { id: 'est-8', name: 'Láser CO2 Fraccionado (Rostro Completo)', description: '90 min • Rejuvenecimiento ablativo profundo, cicatrices de acné y firmeza cutánea', price: 1200, durationMin: 90 },
  ];

  for (const s of serviciosEsteticos) {
    await prisma.service.upsert({
      where: { id: s.id },
      update: { name: s.name, description: s.description, price: s.price, durationMin: s.durationMin, categoryId: catEstetica.id },
      create: { id: s.id, name: s.name, description: s.description, price: s.price, durationMin: s.durationMin, categoryId: catEstetica.id },
    });
  }

  const serviciosClinicos = [
    { id: 'cli-1', name: 'Consulta Dermatológica Especializada', description: '30 min • Evaluación clínica integral de piel, pelo y uñas por especialista', price: 200, durationMin: 30 },
    { id: 'cli-2', name: 'Dermatoscopía de Lunares (Mapeo Corporal)', description: '45 min • Evaluación microscópica de nevos y prevención de melanoma', price: 280, durationMin: 45 },
    { id: 'cli-3', name: 'Tratamiento de Acné Activo / Rosácea', description: '40 min • Protocolo médico personalizado con aparatología y terapia tópica/sistémica', price: 220, durationMin: 40 },
    { id: 'cli-4', name: 'Terapia Corticoide Intralesional', description: '20 min • Infiltración para queloides, cicatrices hipertróficas o alopecia areata', price: 180, durationMin: 20 },
  ];

  for (const s of serviciosClinicos) {
    await prisma.service.upsert({
      where: { id: s.id },
      update: { name: s.name, description: s.description, price: s.price, durationMin: s.durationMin, categoryId: catClinica.id },
      create: { id: s.id, name: s.name, description: s.description, price: s.price, durationMin: s.durationMin, categoryId: catClinica.id },
    });
  }

  const serviciosQuirurgicos = [
    { id: 'q1', name: 'Extirpación de Lesiones Benignas', description: '30–60 min • Cirugía menor ambulatoria de lunares/quistes', price: 350, durationMin: 45 },
    { id: 'q2', name: 'Criocirugía', description: '20 min • Tratamiento de verrugas cutáneas por frío', price: 220, durationMin: 20 },
  ];

  for (const s of serviciosQuirurgicos) {
    await prisma.service.upsert({
      where: { id: s.id },
      update: { name: s.name, description: s.description, price: s.price, durationMin: s.durationMin, categoryId: catQuirurgica.id },
      create: { id: s.id, name: s.name, description: s.description, price: s.price, durationMin: s.durationMin, categoryId: catQuirurgica.id },
    });
  }

  // 5. Procesar Productos Comerciales (DC LASER & Hoja1)
  console.log('5. Sincronizando catálogo de productos comerciales (DC LASER)...');
  
  // Desactivar fórmulas de laboratorio (PREPARADOS) de la tienda pública
  await prisma.product.updateMany({
    where: {
      OR: [
        { sku: { startsWith: 'PREP-' } },
        { sku: { in: ['AAR1', 'AAR2', 'AAR3', 'AAR4', 'AAR9', 'DES-3', 'DES-6', 'QUE-1', 'QUE-3', 'QUE-6', 'COR-7', 'COR-8', 'COR-11', 'COR-12', 'AST-2', 'MIN-5', 'ATX'] } },
        { description: { contains: 'magistral' } },
      ],
    },
    data: { isActive: false },
  });

  const excelPath = path.join(__dirname, '../../PRECIOS PRODUCTOS ACTUALES DCLASER Enero 2026.xlsx');
  
  try {
    const workbook = XLSX.readFile(excelPath);
    
    // --- HOJA: DC LASER (Productos Comerciales para Consumidor Final) ---
    const sheetNameD = 'DC LASER';
    const worksheetD = workbook.Sheets[sheetNameD];
    const dataD = XLSX.utils.sheet_to_json(worksheetD, { header: 1 }) as any[][];
    console.log(`- Leyendo ${dataD.length} filas en la hoja ${sheetNameD} del Excel...`);

    let countD = 0;
    for (let i = 4; i < dataD.length; i++) {
      const row = dataD[i];
      if (!row || !row[0]) continue;

      const rawName = row[0]?.toString().trim();
      const rawLab = row[1]?.toString().trim() || '';
      const priceVal = row[2];

      if (priceVal === undefined || priceVal === null) continue;

      let price = 0.0;
      if (typeof priceVal === 'number') {
        price = priceVal;
      } else if (typeof priceVal === 'string') {
        const cleaned = priceVal.replace(/[^\d.]/g, '');
        price = parseFloat(cleaned) || 0.0;
      }

      if (price <= 0) continue;

      if (rawName === 'NOMBRE DEL PRODUCTO' || rawName.includes('PRECIOS DE DERMQ')) continue;

      let lab = rawLab;
      let name = rawName;

      if (!lab) {
        if (name.startsWith('CETAPHIL') || name.startsWith('EPIDUO') || name.startsWith('TRILUMA') || name.startsWith('LOCERYL') || name.startsWith('SOOLANTRA')) {
          lab = 'GALDERMA';
        } else if (name.startsWith('FOTOPROTECTOR') || name.startsWith('ISDIN') || name.startsWith('NUTRATOPIC') || name.startsWith('NUTRADEICA') || name.startsWith('UREADIN')) {
          lab = 'ISDIN';
        } else if (name.startsWith('EAU THERMALE') || name.startsWith('ROSELIANE') || name.startsWith('BARIÉDERM')) {
          lab = 'URIAGE';
        } else {
          lab = 'COMERCIAL';
        }
      }

      const fullName = lab && !name.toUpperCase().startsWith(lab.toUpperCase()) ? `${lab} ${name}` : name;
      const cleanLab = lab.replace(/[^a-zA-Z0-9]/g, '').substring(0, 4).toUpperCase();
      const sku = `DCL-${cleanLab}-${i}`;
      const stock = 15;

      await prisma.product.upsert({
        where: { sku },
        update: {
          name: fullName,
          price,
          stock,
          imageUrl: getProductImageUrl(fullName),
          description: `Producto dermatológico comercial de laboratorio ${lab}. Listo para uso clínico y personal.`,
          isActive: true,
        },
        create: {
          sku,
          name: fullName,
          price,
          stock,
          imageUrl: getProductImageUrl(fullName),
          description: `Producto dermatológico comercial de laboratorio ${lab}. Listo para uso clínico y personal.`,
          isActive: true,
        },
      });
      countD++;
    }
    console.log(`✅ ¡Carga Exitosa de Productos Comerciales! Se han sincronizado ${countD} productos comerciales activos.`);

  } catch (error) {
    console.warn('⚠️ No se pudo procesar el archivo Excel. Sembrando productos comerciales mock de fallback...', error);
    
    const MOCK_COMMERCIAL_PRODUCTS = [
      { sku: 'DCL-GAL-1', name: 'GALDERMA CETAPHIL BARRA LIMPIADORA', price: 80.00, stock: 15 },
      { sku: 'DCL-GAL-2', name: 'GALDERMA CETAPHIL LOCIÓN LIMPIADORA PIEL SENSIBLE 473ML', price: 130.00, stock: 12 },
      { sku: 'DCL-GAL-3', name: 'GALDERMA CETAPHIL LIMPIADOR PIEL GRASA 237ML', price: 100.00, stock: 10 },
      { sku: 'DCL-GAL-4', name: 'GALDERMA CETAPHIL PRO-AC CONTROL ESPUMA', price: 130.00, stock: 20 },
      { sku: 'DCL-ISD-1', name: 'ISDIN FOTOPROTECTOR FUSION WATER MAGIC SPF50', price: 140.00, stock: 25 },
      { sku: 'DCL-ISD-2', name: 'ISDIN NUTRATOPIC PRO-AMP CREMA FACIAL 50ML', price: 90.00, stock: 18 },
      { sku: 'DCL-URI-1', name: 'URIAGE EAU THERMALE SPRAY 300ML', price: 100.00, stock: 14 },
      { sku: 'DCL-URI-2', name: 'URIAGE ROSELIANE CREMA SPF30 ANTIROJECES', price: 100.00, stock: 16 },
      { sku: 'DCL-SIE-1', name: 'SIEGFRIED ROACCUTAN 20MG X 30 COMPRIMIDOS', price: 220.00, stock: 10 },
    ];

    let count = 0;
    for (const p of MOCK_COMMERCIAL_PRODUCTS) {
      await prisma.product.upsert({
        where: { sku: p.sku },
        update: {
          name: p.name,
          price: p.price,
          stock: p.stock,
          imageUrl: getProductImageUrl(p.name),
          description: `Producto dermatológico comercial listo para consumidor.`,
          isActive: true,
        },
        create: {
          sku: p.sku,
          name: p.name,
          price: p.price,
          stock: p.stock,
          imageUrl: getProductImageUrl(p.name),
          description: `Producto dermatológico comercial listo para consumidor.`,
          isActive: true,
        },
      });
      count++;
    }
    console.log(`✅ ¡Fallback Exitoso! Se han creado ${count} productos comerciales de prueba.`);
  }

  console.log('--- 🎉 Proceso de Sembrado DERMQ Completado con Éxito ---');
}

main()
  .catch((e) => {
    console.error('❌ Error fatal en el proceso de seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
