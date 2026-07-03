import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

/**
 * Servicio para exportación de datos a PDF y Excel.
 * Utiliza jsPDF con jspdf-autotable para PDF
 * y SheetJS (xlsx) para archivos Excel (.xlsx).
 */
@Injectable({ providedIn: 'root' })
export class ExportService {

  /**
   * Genera y descarga un archivo PDF con los datos proporcionados.
   * @param titulo - Título del documento PDF
   * @param columnas - Array de nombres de columnas para la tabla
   * @param datos - Array de arrays con los datos de cada fila
   * @param fileName - Nombre del archivo sin extensión
   */
  exportarPdf(titulo: string, columnas: string[], datos: any[][], fileName: string): void {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(titulo, 14, 22);
    doc.setFontSize(10);
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-AR')}`, 14, 30);
    autoTable(doc, {
      head: [columnas],
      body: datos,
      startY: 35,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [33, 37, 41] }
    });
    doc.save(`${fileName}.pdf`);
  }

  /**
   * Genera y descarga un archivo Excel con los datos proporcionados.
   * @param titulo - Nombre de la hoja de cálculo
   * @param columnas - Array de nombres de columnas (primera fila)
   * @param datos - Array de arrays con los datos de cada fila
   * @param fileName - Nombre del archivo sin extensión
   */
  exportarExcel(titulo: string, columnas: string[], datos: any[][], fileName: string): void {
    const wsData = [columnas, ...datos];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, titulo);
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }
}
