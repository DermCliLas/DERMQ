const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function getProductImageUrl(name) {
  const lowercaseName = name.toLowerCase();
  if (
    lowercaseName.includes('serum') ||
    lowercaseName.includes('concentrate') ||
    lowercaseName.includes('sérum') ||
    lowercaseName.includes('solución') ||
    lowercaseName.includes('fluid')
  ) {
    return '/product_serum.png';
  } else if (
    lowercaseName.includes('caps') ||
    lowercaseName.includes('cápsulas') ||
    lowercaseName.includes('comprimidos')
  ) {
    return '/product_capsules.png';
  } else if (
    lowercaseName.includes('espuma') ||
    lowercaseName.includes('shampoo') ||
    lowercaseName.includes('champu') ||
    lowercaseName.includes('spray')
  ) {
    return '/product_hair.png';
  }
  return '/product_tube.png';
}

const NEW_PRODUCTS = [
  { row: 4, lab: 'BAGO', name: 'ACNOTIN ISOTRETINOINA 10MG X 30 CAPSULAS', price: 140.0, note: '' },
  { row: 5, lab: 'BAGO', name: 'ACNOTIN ISOTRETINOINA 20MG X 30 CAPSULAS', price: 210.0, note: '' },
  { row: 6, lab: 'URIAGE', name: 'AGE LIFT SERUM INTENSIFICADO 30ML', price: 180.0, note: '' },
  { row: 7, lab: 'BABE', name: 'AGUA MICELAR 250 ML', price: 85.0, note: '' },
  { row: 12, lab: 'SESDERMA', name: 'AME EXOSES CREMA FACIAL NUTRITIVA 50 ML', price: 360.0, note: 'FALTA REGISTRAR' },
  { row: 20, lab: 'ISDIN', name: 'BASES DE MAQUILLAJE COVERAGE 2.0 BEIGE SPF50+ 30 GR', price: 150.0, note: '' },
  { row: 21, lab: 'ISDIN', name: 'BASES DE MAQUILLAJE COVERAGE 1.0 PEARL SPF50+ 30 GR', price: 150.0, note: '' },
  { row: 22, lab: 'ISDIN', name: 'BASES DE MAQUILLAJE COVERAGE 3.0 SAND SPF50+ 30 GR', price: 150.0, note: '' },
  { row: 23, lab: 'ISDIN', name: 'BASES DE MAQUILLAJE COVERAGE 4.0 GOLDEN SPF50+ 30 GR', price: 150.0, note: '' },
  { row: 24, lab: 'ISDIN', name: 'BASES DE MAQUILLAJE COVERAGE 5.0 BRONZE SPF50+ 30 GR', price: 150.0, note: '' },
  { row: 27, lab: 'GALDERMA', name: 'CETAPHIL LIMPIADOR OIL CONTROL', price: 110.0, note: 'nuevo' },
  { row: 35, lab: 'BABE', name: 'CHAMPU ENERGIZANTE 250 ML', price: 110.0, note: '' },
  { row: 37, lab: 'URIAGE', name: 'CICA-DAILY GEL-CREMA 40ML', price: 160.0, note: '' },
  { row: 41, lab: 'MEDIK8', name: 'CRYSTAL RETINAL 3', price: 285.0, note: 'falta registrarlo' },
  { row: 47, lab: 'SESDERMA', name: 'EXOSES LB+', price: 0.0, note: 'FALTA REGISTRAR' },
  { row: 51, lab: 'FISSIONLAB', name: 'FISSERUM PURE HYALURONIC 3', price: 200.0, note: 'FALTA QUE LO CORRIJA BIEN' },
  { row: 52, lab: 'FISSIONLAB', name: 'FISSERUM RETINOATE HPR2, SQUALANE, HYALURONIC', price: 200.0, note: 'FALTA QUE LO CORRIJA BIEN' },
  { row: 56, lab: 'ISDIN', name: 'FOTOPROTECTOR COMPACTO 50+ LIGHT 10G', price: 140.0, note: '' },
  { row: 57, lab: 'ISDIN', name: 'FOTOPROTECTOR COMPACTO 50+ MEDIUM 10G', price: 140.0, note: '' },
  { row: 59, lab: 'ISDIN', name: 'FOTOPROTECTOR ISDIN DRY TOUCH GEL CREAM 50+ X 50 ML', price: 140.0, note: 'se volvera a pedir' },
  { row: 73, lab: 'FREZYDERM', name: 'FREZYDERM VELVET SUNSCREEN COLOR FACE SPF50 + 50 ML', price: 135.0, note: '' },
  { row: 74, lab: 'FREZYDERM', name: 'FREZYDERM VELVET SUNSCREEN FACE SPF50 + 50 ML', price: 135.0, note: '' },
  { row: 76, lab: 'BABE', name: 'GEL MICELAR 245ML', price: 75.0, note: '' },
  { row: 77, lab: 'GENOVE', name: 'GENOCUTAN GEL DERMATOLOGICO 250ML', price: 0.0, note: '' },
  { row: 94, lab: 'BAGO', name: 'LETI AT4 MULTIPROTECT FACIAL SPF50+', price: 130.0, note: '' },
  { row: 112, lab: 'SENSILIS', name: 'PHOTOCORECCION D-PIGMENT 50 COLOR 40ML', price: 130.0, note: '' },
  { row: 114, lab: 'GENOVE', name: 'PILOPEPTAN WOMAN 5 ALPHA R COMPRIMIDOS CJAx30UND', price: 0.0, note: '' },
  { row: 115, lab: 'GENOVE', name: 'PILOPEPTAN WOMAN MASCARILLA REGENERADORA 200ML', price: 160.0, note: '' },
  { row: 116, lab: 'GENOVE', name: 'PILOPEPTAN WOMAN PROTEOKEL AMPOLLAS', price: 0.0, note: '' },
  { row: 119, lab: 'GENOVE', name: 'PILOPEPTAN WOMAN SHAMPOO ANTICAIDA 250ML', price: 130.0, note: '' },
  { row: 120, lab: 'SESDERMA', name: 'PRP MESO SALMON PDRN', price: 0.0, note: 'FALTA REGISTRAR' },
  { row: 124, lab: 'URIAGE', name: 'ROSELIANE CREMA SPF30 40ML', price: 120.0, note: '' },
  { row: 128, lab: 'FISSIONLAB', name: 'SEBAMED CREM MANOS Y UÑAS TBO 75 ML', price: 0.0, note: '' },
];

async function main() {
  console.log('--- 🚀 Iniciando Poblado Seguro de Productos Nuevos en DERMQ ---');

  const initialCount = await prisma.product.count();
  console.log(`Productos actuales en base de datos: ${initialCount}`);

  // 1. Corregir error crítico de precio en FLAVO C FORTE (S/. 0.30 -> S/. 300.00)
  const flavoC = await prisma.product.findUnique({
    where: { sku: '8429420216068' },
  });
  if (flavoC && flavoC.price < 1.0) {
    await prisma.product.update({
      where: { sku: '8429420216068' },
      data: { price: 300.0 },
    });
    console.log('✅ Corregido precio crítico de ISDIN FLAVO C FORTE: S/. 0.30 -> S/. 300.00');
  }

  // 2. Insertar productos nuevos
  let inserted = 0;
  let skipped = 0;

  for (let i = 0; i < NEW_PRODUCTS.length; i++) {
    const item = NEW_PRODUCTS[i];
    const lab = item.lab.trim();
    const rawName = item.name.trim();
    const fullName = lab && !rawName.toUpperCase().startsWith(lab.toUpperCase())
      ? `${lab} ${rawName}`
      : rawName;

    // Generar código de barras numérico provisional de 13 dígitos
    // Ejemplo: 9900000000001 a 9900000000033
    const barcodeNumber = 9900000000000 + (i + 1);
    const sku = barcodeNumber.toString();

    // Validar si ya existe por nombre exacto o sku
    const existing = await prisma.product.findFirst({
      where: {
        OR: [
          { name: { equals: fullName, mode: 'insensitive' } },
          { sku: sku },
        ],
      },
    });

    if (existing) {
      console.log(`⚠️ Ya existe en el sistema: "${fullName}" (SKU: ${existing.sku}). Se omite.`);
      skipped++;
      continue;
    }

    const descNote = item.note ? ` [Nota: ${item.note}]` : '';
    const description = `Producto dermatológico comercial de laboratorio ${lab}. Listo para uso clínico y personal.${descNote}`;

    await prisma.product.create({
      data: {
        sku,
        name: fullName,
        price: item.price,
        stock: 0, // Stock en 0 listo para conteo físico
        imageUrl: getProductImageUrl(fullName),
        description,
        family: 'PT', // Producto Terminado
        isActive: true,
      },
    });

    console.log(`[+${i + 1}] Creado: [${sku}] ${fullName} | S/. ${item.price.toFixed(2)}`);
    inserted++;
  }

  const finalCount = await prisma.product.count();
  console.log('\n--- 🏁 Proceso Finalizado con Éxito ---');
  console.log(`Nuevos productos insertados: ${inserted}`);
  console.log(`Productos omitidos (ya existían): ${skipped}`);
  console.log(`Total productos en la base de datos ahora: ${finalCount}`);
}

main()
  .catch((err) => {
    console.error('Error fatal al poblar productos:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
