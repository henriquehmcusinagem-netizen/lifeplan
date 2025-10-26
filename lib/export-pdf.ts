import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportToPDF(elementId: string, filename: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL('image/png');

  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgWidth = 210; // A4 width in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
  pdf.save(filename);
}

export function generateAnalisesPDF(dados: any) {
  const pdf = new jsPDF();

  // Header
  pdf.setFontSize(20);
  pdf.text('LifePlan - Relatório de Análises', 20, 20);

  // Data
  pdf.setFontSize(12);
  pdf.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 20, 30);

  // Content
  pdf.setFontSize(14);
  pdf.text('Resumo Anual 2025', 20, 45);
  pdf.setFontSize(10);
  pdf.text(`Receitas: R$ ${dados.receitas.toLocaleString('pt-BR')}`, 20, 55);
  pdf.text(`Despesas: R$ ${dados.despesas.toLocaleString('pt-BR')}`, 20, 62);
  pdf.text(`Resultado: R$ ${dados.resultado.toLocaleString('pt-BR')}`, 20, 69);

  pdf.save('lifeplan-analises.pdf');
}
