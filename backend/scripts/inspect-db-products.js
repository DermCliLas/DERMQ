const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL is not defined in env');
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const count = await prisma.product.count();
  console.log(`Total productos en DB: ${count}`);

  const products = await prisma.product.findMany({
    take: 15
  });

  console.log('\nPrimeros 15 productos:');
  products.forEach(p => {
    console.log(`ID: ${p.id} | SKU: ${p.sku} | Name: ${p.name} | Price: ${p.price} | Stock: ${p.stock} | Active: ${p.isActive}`);
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
