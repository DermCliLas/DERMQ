const XLSX = require('xlsx');
const path = require('path');

const FILE_PATH = path.join(__dirname, '../PRECIOS PRODUCTOS ACTUALES DCLASER Enero 2026.xlsx');

try {
  const workbook = XLSX.readFile(FILE_PATH);

  // 1. Parse PREPARADOS
  console.log('--- PREPARADOS PRODUCTS ---');
  const sheetP = workbook.Sheets['PREPARADOS'];
  const dataP = XLSX.utils.sheet_to_json(sheetP, { header: 1 });
  let countP = 0;
  for (let i = 1; i < dataP.length; i++) {
    const row = dataP[i];
    if (!row || row.length < 2) continue;
    let sku = row[0]?.toString().trim();
    const name = row[1]?.toString().trim();
    if (!name) continue;
    const cost = row[2];
    const stock = row[3];
    const price = row[6];
    
    // Fallback for SKU if empty
    if (!sku) {
      if (name.includes('TRAMEXAMICO')) {
        sku = 'ATX';
      } else {
        sku = `PREP-${i}`;
      }
    }
    console.log(`[PREP] SKU: ${sku} | Name: ${name} | Price: ${price} | Stock: ${stock} | Cost: ${cost}`);
    countP++;
  }
  console.log(`Total PREPARADOS: ${countP}`);

  // 2. Parse DC LASER
  console.log('\n--- DC LASER PRODUCTS ---');
  const sheetD = workbook.Sheets['DC LASER'];
  const dataD = XLSX.utils.sheet_to_json(sheetD, { header: 1 });
  let countD = 0;
  for (let i = 4; i < dataD.length; i++) {
    const row = dataD[i];
    if (!row || row.length === 0) continue;
    const name = row[0]?.toString().trim();
    if (!name || name === 'NOMBRE DEL PRODUCTO') continue;
    
    // Ignore category separators like "CATEGORIA FACIAL", "CATEGORIA CAPILAR", etc.
    if (name.startsWith('CATEGORIA') || name.includes('UÑAS') || name.includes('ISDINCEUTICS') || name.includes('NUHANCIAM') || name.includes('CICAFISS') || name.includes('FISSERUM') || name.includes('FISS DOK') || name.includes('BAGO') || name.includes('PRECIOS DE DERMQ') || name.includes('FOTO ULTRA')) {
      if (row.length < 3 || !row[2]) {
        // Looks like a category header
        console.log(`[HEADER SKIP] ${name}`);
        continue;
      }
    }

    const lab = row[1]?.toString().trim() || 'COMERCIAL';
    const priceVal = row[2]; // labeled as COSTOS but represents price
    const stockVal = row[3]; // labeled as TOTALES
    const obs = row[4]?.toString().trim();

    if (!priceVal) {
      console.log(`[SKIP NO PRICE] Name: ${name} | Lab: ${lab}`);
      continue;
    }

    let price = 0;
    if (typeof priceVal === 'number') {
      price = priceVal;
    } else if (typeof priceVal === 'string') {
      // Clean string like "S/. 300.00"
      const cleaned = priceVal.replace(/[^\d.]/g, '');
      price = parseFloat(cleaned) || 0;
    }

    let stock = 10;
    if (typeof stockVal === 'number') {
      stock = Math.floor(stockVal);
    }

    // Generate SKU for commercial product
    const cleanLab = lab.replace(/[^a-zA-Z0-9]/g, '').substring(0, 3).toUpperCase();
    const cleanName = name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8).toUpperCase();
    const sku = `${cleanLab}-${cleanName}-${i}`;

    console.log(`[DCLASER] SKU: ${sku} | Name: ${name} | Lab: ${lab} | Price: ${price} | Stock: ${stock} | Obs: ${obs}`);
    countD++;
  }
  console.log(`Total DC LASER: ${countD}`);

} catch (error) {
  console.error(error);
}
