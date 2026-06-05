const XLSX = require('xlsx');
const path = require('path');

const FILE_PATH = path.join(__dirname, '../PRECIOS PRODUCTOS ACTUALES DCLASER Enero 2026.xlsx');

try {
  const workbook = XLSX.readFile(FILE_PATH);

  // Print Sheet Names
  console.log('Sheet Names:', workbook.SheetNames);

  // 1. Hoja1
  console.log('\n--- Hoja1 structure ---');
  const sheetHoja1 = workbook.Sheets['Hoja1'];
  const dataHoja1 = XLSX.utils.sheet_to_json(sheetHoja1, { header: 1 });
  console.log('Hoja1 total rows:', dataHoja1.length);
  for (let i = 0; i < 40; i++) {
    if (dataHoja1[i]) {
      console.log(`Row ${i}:`, dataHoja1[i]);
    }
  }

  // 2. PREPARADOS
  console.log('\n--- PREPARADOS row count & samples ---');
  const sheetPrep = workbook.Sheets['PREPARADOS'];
  const dataPrep = XLSX.utils.sheet_to_json(sheetPrep, { header: 1 });
  console.log('PREPARADOS total rows:', dataPrep.length);
  let prepRows = 0;
  dataPrep.forEach((row, i) => {
    if (row[0] || row[1]) {
      prepRows++;
      if (prepRows <= 30) {
        console.log(`Prep Row ${i}:`, row);
      }
    }
  });
  console.log('Total non-empty PREPARADOS rows:', prepRows);

} catch (error) {
  console.error(error);
}
