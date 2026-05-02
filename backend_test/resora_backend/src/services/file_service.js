const fs = require('fs').promises;
const path = require('path');
const XLSX = require('xlsx');

function parse_csv(text) {
  const lines = text.trim().split('\n').filter(Boolean);

  if (lines.length < 2) {
    throw new Error('CSV must have headers and at least one row');
  }

  const headers = lines[0]
    .split(',')
    .map(h => h.trim().replace(/\r/g, ''));

  return lines.slice(1).map(line => {
    const values = line
      .split(',')
      .map(v => v.trim().replace(/\r/g, ''));

    return headers.reduce((obj, h, i) => {
      obj[h] = values[i] ?? null;
      return obj;
    }, {});
  });
}

function parse_json(text) {
  try {
    return JSON.parse(text);
  } catch (err) {
    throw new Error('Invalid JSON format');
  }
}

async function parse_excel(file_path) {
  const workbook = XLSX.readFile(file_path);
  const sheet_name = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheet_name];
  
  const json_data = XLSX.utils.sheet_to_json(sheet, { defval: null });
  
  if (!json_data || json_data.length === 0) {
    throw new Error('Excel file is empty');
  }
  
  return json_data;
}

async function read_file(file_path) {
  const ext = path.extname(file_path).toLowerCase();

  if (ext === '.xlsx' || ext === '.xls') {
    return parse_excel(file_path);
  }

  const text = await fs.readFile(file_path, 'utf-8');

  if (!text.trim()) {
    throw new Error('File is empty');
  }

  if (ext === '.csv') return parse_csv(text);
  if (ext === '.json') return parse_json(text);

  throw new Error(`Unsupported file type: ${ext}`);
}

function from_body(body) {
  if (Array.isArray(body)) return body;

  if (typeof body === 'string') {
    const trimmed = body.trim();

    if (!trimmed) throw new Error('Empty body');

    try {
      if (trimmed.startsWith('[')) {
        return parse_json(trimmed);
      } else {
        return parse_csv(trimmed);
      }
    } catch (err) {
      throw new Error('Invalid body format (must be JSON array or CSV)');
    }
  }

  throw new Error('Request body must be a JSON array or CSV text');
}

module.exports = {
  read_file,
  from_body,
  parse_excel
};