const XLSX = require("xlsx");

async function parse_timetable(filePath) {
  const workbook = XLSX.readFile(filePath);

  // first sheet
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  // raw matrix format
  const rawData = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: null
  });

  const result = {
    rows: rawData,
    unique_values: new Set()
  };

  // collect all text values for dry run analysis
  for (const row of rawData) {
    for (const cell of row) {
      if (
        cell &&
        typeof cell === "string" &&
        cell.trim() !== ""
      ) {
        result.unique_values.add(cell.trim());
      }
    }
  }

  // convert Set → Array
  result.unique_values = Array.from(result.unique_values);

  return result;
}

module.exports = {
  parse_timetable
};