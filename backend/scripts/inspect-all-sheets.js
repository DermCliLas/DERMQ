const XLSX = require('xlsx');
const path = require('path');

const FILE_PATH = path.join(__dirname, '../PRECIOS PRODUCTOS ACTUALES DCLASER Enero 2026.xlsx');

try {
  console.log('--- Inspeccionando todas las hojas del Excel ---');
  const workbook = XLSX.readFile(FILE_PATH);
  console.log('Hojas detectadas:', workbook.SheetNames);

  workbook.SheetNames.forEach(sheetName => {
    console.log(`\n================ Sheet: ${sheetName} ================`);
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    console.log(`Filas encontradas: ${data.length}`);
    if (data.length > 0) {
      console.log('Primeras 15 filas:');
      data.slice(0, 15).forEach((row, idx) => {
        console.log(`Fila ${idx}:`, row);
      });
    }
  });

} catch (error) {
  console.error('Error al leer el archivo:', error.message);
}
