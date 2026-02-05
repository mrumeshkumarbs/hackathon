import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const excelPath = path.join(process.cwd(), 'src/data/Expert Quiz Database.xlsx');
const jsonPath = path.join(process.cwd(), 'src/data/expert_questions.json');

try {
    console.log(`Reading file from: ${excelPath}`);
    if (!fs.existsSync(excelPath)) {
        throw new Error('Excel file does not exist');
    }

    const workbook = XLSX.readFile(excelPath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const data = XLSX.utils.sheet_to_json(worksheet);

    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
    console.log('Conversion successful. Sample row:');
    console.log(JSON.stringify(data[0], null, 2));
} catch (error) {
    console.error('Stack:', error.stack);
}
