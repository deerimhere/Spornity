import Papa from 'papaparse';

export async function fetchCSV(url: string) {
  const response = await fetch(url);
  const csvText = await response.text();
  return Papa.parse(csvText, { header: true, skipEmptyLines: true }).data;
}