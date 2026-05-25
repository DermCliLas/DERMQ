const XLSX = require('xlsx');
const path = require('path');

const FILE_PATH = path.join(__dirname, '../PRECIOS PRODUCTOS ACTUALES DCLASER Enero 2026.xlsx');

try {
  console.log('--- Inspeccionando Archivo Excel ---');
  const workbook = XLSX.readFile(FILE_PATH);
  const sheetName = workbook.SheetNames[0];
  console.log('Hoja detectada:', sheetName);

  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  if (data.length === 0) {
    console.log('El archivo está vacío.');
    process.exit(0);
  }

  const headers = data[0];
  console.log('\nEncabezados detectados:');
  console.log(headers.map((h, i) => `[${i}] ${h}`).join('\n'));

  console.log('\nPrimeras 3 filas de datos:');
  data.slice(1, 4).forEach((row, i) => {
    console.log(`Fila ${i + 1}:`, row);
  });

} catch (error) {
  console.error('Error al leer el archivo:', error.message);
  if (error.code === 'ENOENT') {
    console.error('Asegúrate de que el archivo existe en la carpeta backend.');
  }
}
