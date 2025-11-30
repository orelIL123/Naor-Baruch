const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'hayanuka_database.xlsx');
const workbook = XLSX.readFile(filePath);

const sheetNames = workbook.SheetNames;
// console.log('Sheet Names:', sheetNames);

const data = {};
sheetNames.forEach(sheetName => {
  const sheet = workbook.Sheets[sheetName];
  data[sheetName] = XLSX.utils.sheet_to_json(sheet);
});

console.log(JSON.stringify(data, null, 2));
