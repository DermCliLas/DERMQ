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

// Mapeador de imágenes ficticias estéticas según el nombre del producto para conservar el diseño premium
function getProductImageUrl(name: string): string {
  const lowercaseName = name.toLowerCase();
  if (lowercaseName.includes('gel')) {
    return '/product_serum.png';
  } else if (lowercaseName.includes('solución') || lowercaseName.includes('loción') || lowercaseName.includes('fco')) {
    return '/product_serum.png';
  } else if (lowercaseName.includes('caps') || lowercaseName.includes('cápsulas')) {
    return '/product_capsules.png';
  } else if (lowercaseName.includes('talco')) {
    return '/product_serum.png';
  } else if (lowercaseName.includes('espuma') || lowercaseName.includes('shampoo') || lowercaseName.includes('capilar')) {
    return '/product_hair.png';
  } else if (lowercaseName.includes('ungüento') || lowercaseName.includes('crema')) {
    return '/product_tube.png';
  }
  return '/product_tube.png'; // Fallback
}

// Asignar categoría comercial estética para productos
function getProductCategory(name: string): string {
  const lowercaseName = name.toLowerCase();
  if (lowercaseName.includes('retinoico')) return 'Renovadores Celulares';
  if (lowercaseName.includes('benzoilo') || lowercaseName.includes('acné')) return 'Anti-Acné';
  if (lowercaseName.includes('hidroquinona') || lowercaseName.includes('despigmentante')) return 'Despigmentantes';
  if (lowercaseName.includes('láctico') || lowercaseName.includes('salicílico') || lowercaseName.includes('urea')) return 'Queratolíticos';
  if (lowercaseName.includes('clobetasol') || lowercaseName.includes('triamcinolona')) return 'Corticoides';
  if (lowercaseName.includes('aluminio')) return 'Astringentes';
  if (lowercaseName.includes('eritromicina')) return 'Antibióticos';
  if (lowercaseName.includes('econazol')) return 'Antimicóticos';
  if (lowercaseName.includes('minoxidil')) return 'Tratamiento Capilar';
  if (lowercaseName.includes('anestesia') || lowercaseName.includes('lidocaina')) return 'Anestésicos';
  return 'Cuidado Dermatológico'; // Categoria default
}

async function main() {
  console.log('--- 🚀 Iniciando Proceso de Seed Completo (Excel + Mocks Clínicos) ---');

  // 1. Asegurar Sede Principal
  console.log('1. Creando Sede Principal...');
  const branchPrincipal = await prisma.branch.upsert({
    where: { id: 'sede-principal-id' },
    update: {},
    create: {
      id: 'sede-principal-id',
      name: 'DERMQ Sede Principal - Lima',
      address: 'Av. Javier Prado Este 1234, San Isidro',
      city: 'Lima',
      phone: '01-4445566',
    },
  });

  // 2. Asegurar Usuario Administrador
  console.log('2. Creando Usuario Administrador...');
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('dermq2026', salt);
  
  await prisma.user.upsert({
    where: { email: 'admin@dermq.com' },
    update: {},
    create: {
      email: 'admin@dermq.com',
      password: passwordHash,
      firstName: 'Admin',
      lastName: 'DermQ',
      role: Role.ADMIN,
    },
  });

  // 3. Crear Médicos Especialistas
  console.log('3. Creando Médicos Especialistas...');
  const doctorPassword = await bcrypt.hash('123456', salt);

  // Asegurar que solo exista la Dra. Marcela Leyva (eliminando otros doctores de prueba de base de datos)
  await prisma.user.deleteMany({
    where: {
      email: {
        in: ['doctora.ana@dermq.com', 'marcela.leyva@dermq.com']
      }
    }
  });

  // Doctora 1 (Marcela Leyva)
  const docMarcela = await prisma.user.upsert({
    where: { email: 'dermatologiaclinicaylasersac@gmail.com' },
    update: {
      specialty: 'Dermatología Clínica e Inyectables',
      bio: 'Especialista en rejuvenecimiento facial, modelado con ácido hialurónico y patologías cutáneas complejas. Directora Médica y Fundadora de DERMQ, con certificaciones de Harvard Medical School (HMX) y ex-Vicepresidenta de la Sociedad Peruana de Dermatología.',
      avatarUrl: '/leyva.png', // Su avatar personalizado
    },
    create: {
      email: 'dermatologiaclinicaylasersac@gmail.com',
      password: doctorPassword,
      firstName: 'Marcela',
      lastName: 'Leyva',
      role: Role.DOCTOR,
      specialty: 'Dermatología Clínica e Inyectables',
      bio: 'Especialista en rejuvenecimiento facial, modelado con ácido hialurónico y patologías cutáneas complejas. Directora Médica y Fundadora de DERMQ, con certificaciones de Harvard Medical School (HMX) y ex-Vicepresidenta de la Sociedad Peruana de Dermatología.',
      avatarUrl: '/leyva.png',
      branches: {
        connect: { id: branchPrincipal.id }
      }
    },
  });

  // 4. Asegurar Categorías y Servicios Clínicos
  console.log('4. Creando Categorías y Servicios Clínicos...');
  
  // Categoría 1: Clínica
  const catClinica = await prisma.category.upsert({
    where: { id: 'CLINICA' },
    update: {
      name: 'Clínica',
      description: 'Tratamientos médicos para patologías de la piel, pelo y uñas.',
    },
    create: {
      id: 'CLINICA',
      name: 'Clínica',
      description: 'Tratamientos médicos para patologías de la piel, pelo y uñas.',
    },
  });

  const serviciosClinicos = [
    { id: 'c1', name: 'Consulta Dermatológica General', description: '45 min • Primera consulta y evaluación de lunares', price: 120, durationMin: 45 },
    { id: 'c2', name: 'Diagnóstico por Dermatoscopia', description: '60 min • Análisis digital avanzado de nevus y lunares', price: 180, durationMin: 60 },
    { id: 'c3', name: 'Tratamiento de Acné Clínico', description: '45 min • Protocolo anti-acné personalizado e infiltraciones', price: 150, durationMin: 45 },
  ];

  for (const s of serviciosClinicos) {
    await prisma.service.upsert({
      where: { id: s.id },
      update: {
        name: s.name,
        description: s.description,
        price: s.price,
        durationMin: s.durationMin,
        categoryId: catClinica.id,
      },
      create: {
        id: s.id,
        name: s.name,
        description: s.description,
        price: s.price,
        durationMin: s.durationMin,
        categoryId: catClinica.id,
      },
    });
  }

  // Categoría 2: Estética
  const catEstetica = await prisma.category.upsert({
    where: { id: 'ESTETICA' },
    update: {
      name: 'Estética',
      description: 'Rejuvenecimiento y cuidado avanzado de la piel facial y corporal.',
    },
    create: {
      id: 'ESTETICA',
      name: 'Estética',
      description: 'Rejuvenecimiento y cuidado avanzado de la piel facial y corporal.',
    },
  });

  const serviciosEsteticos = [
    { id: 'e1', name: 'Limpieza Facial Profunda con Hidratación', description: '60 min • Tecnología DERMQ Pure de extracción e hidratación', price: 85, durationMin: 60 },
    { id: 'e2', name: 'Peeling Químico Revitalizante', description: '45 min • Renovación celular completa y luminosidad', price: 120, durationMin: 45 },
    { id: 'e3', name: 'Terapia de Luz LED (Skin Glow)', description: '30 min • Protocolo anti-inflamatorio y regenerador', price: 65, durationMin: 30 },
  ];

  for (const s of serviciosEsteticos) {
    await prisma.service.upsert({
      where: { id: s.id },
      update: {
        name: s.name,
        description: s.description,
        price: s.price,
        durationMin: s.durationMin,
        categoryId: catEstetica.id,
      },
      create: {
        id: s.id,
        name: s.name,
        description: s.description,
        price: s.price,
        durationMin: s.durationMin,
        categoryId: catEstetica.id,
      },
    });
  }

  // Categoría 3: Quirúrgica
  const catQuirurgica = await prisma.category.upsert({
    where: { id: 'QUIRURGICA' },
    update: {
      name: 'Quirúrgica',
      description: 'Procedimientos menores y cirugía dermatológica especializada.',
    },
    create: {
      id: 'QUIRURGICA',
      name: 'Quirúrgica',
      description: 'Procedimientos menores y cirugía dermatológica especializada.',
    },
  });

  const serviciosQuirurgicos = [
    { id: 'q1', name: 'Extirpación de Lesiones Benignas', description: '30–60 min • Cirugía menor ambulatoria de lunares/quistes', price: 350, durationMin: 45 },
    { id: 'q2', name: 'Criocirugía', description: '20 min • Tratamiento de verrugas cutáneas por frío', price: 220, durationMin: 20 },
  ];

  for (const s of serviciosQuirurgicos) {
    await prisma.service.upsert({
      where: { id: s.id },
      update: {
        name: s.name,
        description: s.description,
        price: s.price,
        durationMin: s.durationMin,
        categoryId: catQuirurgica.id,
      },
      create: {
        id: s.id,
        name: s.name,
        description: s.description,
        price: s.price,
        durationMin: s.durationMin,
        categoryId: catQuirurgica.id,
      },
    });
  }

  // 5. Procesar Productos desde Excel / Mocks estéticos
  console.log('5. Cargando catálogo de productos...');
  const excelPath = path.join(__dirname, '../PRECIOS PRODUCTOS ACTUALES DCLASER Enero 2026.xlsx');
  
  try {
    const workbook = XLSX.readFile(excelPath);
    
    // --- HOJA 1: PREPARADOS ---
    const sheetNameP = 'PREPARADOS';
    const worksheetP = workbook.Sheets[sheetNameP];
    const dataP = XLSX.utils.sheet_to_json(worksheetP, { header: 1 }) as any[][];
    console.log(`- Leyendo ${dataP.length} filas en la hoja ${sheetNameP} del Excel...`);

    let countP = 0;
    for (let i = 1; i < dataP.length; i++) {
      const row = dataP[i];
      if (!row || row.length < 2) continue;

      let sku = row[0]?.toString().trim();
      const name = row[1]?.toString().trim();
      const stockVal = row[3];
      const priceVal = row[6];

      if (!name) continue;
      
      if (!sku) {
        if (name.toUpperCase().includes('TRAMEXAMICO')) {
          sku = 'ATX';
        } else {
          sku = `PREP-${i}`;
        }
      }

      const stock = typeof stockVal === 'number' ? Math.floor(stockVal) : 10;
      let price = 90.00;
      if (typeof priceVal === 'number') {
        price = priceVal;
      } else if (typeof priceVal === 'string') {
        const cleaned = priceVal.replace(/[^\d.]/g, '');
        price = parseFloat(cleaned) || 90.00;
      }

      await prisma.product.upsert({
        where: { sku },
        update: {
          name,
          price,
          stock,
          imageUrl: getProductImageUrl(name),
          description: `Producto magistral dermatológico: ${name}. Uso sugerido bajo indicación clínica.`,
          isActive: true,
        },
        create: {
          sku,
          name,
          price,
          stock,
          imageUrl: getProductImageUrl(name),
          description: `Producto magistral dermatológico: ${name}. Uso sugerido bajo indicación clínica.`,
          isActive: true,
        },
      });
      countP++;
    }
    console.log(`✅ ¡Carga Exitosa de Preparados! Se han sincronizado ${countP} productos.`);

    // --- HOJA 2: DC LASER (Comerciales) ---
    const sheetNameD = 'DC LASER';
    const worksheetD = workbook.Sheets[sheetNameD];
    const dataD = XLSX.utils.sheet_to_json(worksheetD, { header: 1 }) as any[][];
    console.log(`- Leyendo ${dataD.length} filas en la hoja ${sheetNameD} del Excel...`);

    let countD = 0;
    for (let i = 4; i < dataD.length; i++) {
      const row = dataD[i];
      if (!row || row.length === 0) continue;
      const name = row[0]?.toString().trim();
      if (!name || name === 'NOMBRE DEL PRODUCTO') continue;

      // Ignorar cabeceras/separadores
      if (
        name.startsWith('CATEGORIA') ||
        name.includes('UÑAS') ||
        name.includes('ISDINCEUTICS') ||
        name.includes('NUHANCIAM') ||
        name.includes('CICAFISS') ||
        name.includes('FISSERUM') ||
        name.includes('FISS DOK') ||
        name.includes('BAGO') ||
        name.includes('PRECIOS DE DERMQ') ||
        name.includes('FOTO ULTRA')
      ) {
        if (row.length < 3 || !row[2]) {
          continue;
        }
      }

      const lab = row[1]?.toString().trim() || 'COMERCIAL';
      const priceVal = row[2];
      const stockVal = row[3];

      if (!priceVal) continue;

      let price = 0.0;
      if (typeof priceVal === 'number') {
        price = priceVal;
      } else if (typeof priceVal === 'string') {
        const cleaned = priceVal.replace(/[^\d.]/g, '');
        price = parseFloat(cleaned) || 0.0;
      }

      if (price <= 0) continue;

      const stock = typeof stockVal === 'number' ? Math.floor(stockVal) : 10;

      // Generar SKU único
      const cleanLab = lab.replace(/[^a-zA-Z0-9]/g, '').substring(0, 3).toUpperCase();
      const cleanName = name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8).toUpperCase();
      const sku = `${cleanLab}-${cleanName}-${i}`;

      await prisma.product.upsert({
        where: { sku },
        update: {
          name: `${lab} ${name}`,
          price,
          stock,
          imageUrl: getProductImageUrl(name),
          description: `Producto comercial dermatológico de laboratorio ${lab}: ${name}.`,
          isActive: true,
        },
        create: {
          sku,
          name: `${lab} ${name}`,
          price,
          stock,
          imageUrl: getProductImageUrl(name),
          description: `Producto comercial dermatológico de laboratorio ${lab}: ${name}.`,
          isActive: true,
        },
      });
      countD++;
    }
    console.log(`✅ ¡Carga Exitosa de Productos Comerciales! Se han sincronizado ${countD} productos.`);
    console.log(`🎉 Total de productos sincronizados desde Excel: ${countP + countD}`);

  } catch (error) {
    console.warn('⚠️ No se pudo procesar el archivo Excel. Sembrando productos mock de fallback...');
    
    // Fallback Mock de Productos del frontend
    const MOCK_PRODUCTS = [
      { sku: 'AAR1', name: 'ACIDO RETINOICO 0.025% CREMA X 30 GR', price: 90.00, stock: 15 },
      { sku: 'AAR2', name: 'ACIDO RETINOICO 0.05% CREMA X 30 GR', price: 90.00, stock: 12 },
      { sku: 'AAR3', name: 'ACIDO RETINOICO 0.1% CREMA X 30 GR', price: 90.00, stock: 10 },
      { sku: 'AAR4', name: 'PEROXIDO BENZOILO 5% GEL X 30 GR', price: 90.00, stock: 20 },
      { sku: 'AAR9', name: 'METRONIDAZOL 1% FLUOCINONIDA 0.01% GEL X 30 GR', price: 90.00, stock: 8 },
      { sku: 'DES-3', name: 'HIDROQUINONA 3% CREMA X 30 GR', price: 90.00, stock: 18 },
      { sku: 'DES-6', name: 'HIDROQUINONA 6% A.RETINOICO 0.025% FLUOCINONIDA 0.01% CREMA X 30 GR', price: 90.00, stock: 14 },
      { sku: 'QUE-1', name: 'ACIDO LACTICO 17% ACIDO SALICILICO 17% COLODION FLEXIBLE 13 ML', price: 90.00, stock: 25 },
      { sku: 'QUE-3', name: 'UREA 10% SALICILICO 3% RETINOICO 0.05% TRIAMC 0.025% CREMA X 30 GR', price: 90.00, stock: 16 },
      { sku: 'COR-7', name: 'CLOBETASOL 0.05% UREA 10% ACIDO SALICILICO 4% UNGÜENTO X 50 GR', price: 100.00, stock: 30 },
      { sku: 'AST-2', name: 'CLORURO ALUMINIO 20% SOLUCION OH X 100 ML', price: 80.00, stock: 22 },
      { sku: 'MIN-5', name: 'MINOXIDIL 5% ESPUMA FCO X 100 ML', price: 100.00, stock: 40 },
      { sku: 'ATX', name: 'ACIDO TRAMEXAMICO 250 MG FCO 30 CAPSULAS', price: 130.00, stock: 15 }
    ];

    let count = 0;
    for (const p of MOCK_PRODUCTS) {
      await prisma.product.upsert({
        where: { sku: p.sku },
        update: {
          name: p.name,
          price: p.price,
          stock: p.stock,
          imageUrl: getProductImageUrl(p.name),
          description: `Producto magistral dermatológico de alta potencia. Uso clínico.`,
          isActive: true,
        },
        create: {
          sku: p.sku,
          name: p.name,
          price: p.price,
          stock: p.stock,
          imageUrl: getProductImageUrl(p.name),
          description: `Producto magistral dermatológico de alta potencia. Uso clínico.`,
          isActive: true,
        },
      });
      count++;
    }
    console.log(`✅ ¡Fallback Exitoso! Se han creado ${count} productos de prueba en la base de datos.`);
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
