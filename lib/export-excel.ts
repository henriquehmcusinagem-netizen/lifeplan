import * as XLSX from 'xlsx';

export function exportLancamentosToExcel(dados: any[]) {
  const ws = XLSX.utils.json_to_sheet(dados);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Lançamentos 2025');

  // Formatar headers
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const address = XLSX.utils.encode_col(C) + '1';
    if (!ws[address]) continue;
    ws[address].s = { font: { bold: true }, fill: { fgColor: { rgb: 'CCCCCC' } } };
  }

  XLSX.writeFile(wb, 'lifeplan-lancamentos.xlsx');
}

export function exportObjetivosToExcel(objetivos: any[]) {
  const ws = XLSX.utils.json_to_sheet(objetivos);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Objetivos');
  XLSX.writeFile(wb, 'lifeplan-objetivos.xlsx');
}

export function exportPatrimonioToExcel(ativos: any[]) {
  const ws = XLSX.utils.json_to_sheet(ativos);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Patrimônio');
  XLSX.writeFile(wb, 'lifeplan-patrimonio.xlsx');
}
