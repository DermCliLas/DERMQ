const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function run() {
  const products = await prisma.product.findMany({
    orderBy: { name: 'asc' }
  });
  console.log(`Total productos en DB: ${products.length}`);
  fs.writeFileSync(path.join(__dirname, 'db_products.json'), JSON.stringify(products, null, 2));
  console.log('Guardado en backend/scripts/db_products.json');
}

run()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
