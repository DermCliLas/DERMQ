const XLSX = require('xlsx');
const path = require('path');

const FILE_PATH = path.join(__dirname, '../PRECIOS PRODUCTOS ACTUALES DCLASER Enero 2026.xlsx');

try {
  const workbook = XLSX.readFile(FILE_PATH);

  // PREPARADOS
  console.log('\n================ PREPARADOS (No vacíos) ================');
  const sheetP = workbook.Sheets['PREPARADOS'];
  const dataP = XLSX.utils.sheet_to_json(sheetP, { header: 1 });
  let countP = 0;
  dataP.forEach((row, idx) => {
    if (idx === 0) {
      console.log('Headers:', row);
      return;
    }
    const sku = row[0]?.toString().trim();
    const name = row[1]?.toString().trim();
    if (sku || name) {
      console.log(`Row ${idx}:`, row);
      countP++;
    }
  });
  console.log(`Total preparados válidos: ${countP}`);

  // DC LASER
  console.log('\n================ DC LASER (No vacíos) ================');
  const sheetD = workbook.Sheets['DC LASER'];
  const dataD = XLSX.utils.sheet_to_json(sheetD, { header: 1 });
  let countD = 0;
  dataD.forEach((row, idx) => {
    if (idx < 4) {
      console.log(`Header/Pre-row ${idx}:`, row);
      return;
    }
    const name = row[0]?.toString().trim();
    if (name && name !== 'NOMBRE DEL PRODUCTO') {
      console.log(`Row ${idx}:`, row);
      countD++;
    }
  });
  console.log(`Total DC LASER válidos: ${countD}`);

} catch (error) {
  console.error(error);
}
