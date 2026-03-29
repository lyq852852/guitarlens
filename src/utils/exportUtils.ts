/**
 * 导出工具
 * 支持 PDF、MusicXML、GuitarPro 格式
 */

import { EditorState } from './editorState';

/**
 * 导出为 PDF
 */
export async function exportToPDF(state: EditorState, filename: string = 'score.pdf'): Promise<Blob> {
  // 简化版本：生成 PDF 内容
  const pdfContent = generatePDFContent(state);
  return new Blob([pdfContent], { type: 'application/pdf' });
}

/**
 * 导出为 MusicXML
 */
export function exportToMusicXML(state: EditorState, filename: string = 'score.musicxml'): Blob {
  const xmlContent = generateMusicXML(state);
  return new Blob([xmlContent], { type: 'application/xml' });
}

/**
 * 导出为 GuitarPro
 */
export function exportToGuitarPro(state: EditorState, filename: string = 'score.gpx'): Blob {
  const gpContent = generateGuitarProXML(state);
  return new Blob([gpContent], { type: 'application/xml' });
}

/**
 * 生成 PDF 内容
 */
function generatePDFContent(state: EditorState): string {
  // 简化版本：返回 PDF 头
  let pdf = '%PDF-1.4\n';
  pdf += '1 0 obj\n';
  pdf += '<< /Type /Catalog /Pages 2 0 R >>\n';
  pdf += 'endobj\n';
  pdf += '2 0 obj\n';
  pdf += '<< /Type /Pages /Kids [3 0 R] /Count 1 >>\n';
  pdf += 'endobj\n';
  pdf += '3 0 obj\n';
  pdf += '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>\n';
  pdf += 'endobj\n';
  pdf += '4 0 obj\n';
  pdf += `<< /Length ${state.title.length + 50} >>\n`;
  pdf += 'stream\n';
  pdf += `BT /F1 12 Tf 50 750 Td (${state.title}) Tj ET\n`;
  pdf += 'endstream\n';
  pdf += 'endobj\n';
  pdf += 'xref\n';
  pdf += '0 5\n';
  pdf += '0000000000 65535 f\n';
  pdf += '0000000009 00000 n\n';
  pdf += '0000000058 00000 n\n';
  pdf += '0000000115 00000 n\n';
  pdf += '0000000214 00000 n\n';
  pdf += 'trailer\n';
  pdf += '<< /Size 5 /Root 1 0 R >>\n';
  pdf += 'startxref\n';
  pdf += '0\n';
  pdf += '%%EOF\n';
  return pdf;
}

/**
 * 生成 MusicXML
 */
function generateMusicXML(state: EditorState): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">\n';
  xml += '<score-partwise version="3.1">\n';
  xml += '  <work>\n';
  xml += `    <work-title>${escapeXml(state.title)}</work-title>\n`;
  xml += '  </work>\n';
  xml += '  <identification>\n';
  xml += `    <creator type="software">GuitarLens</creator>\n`;
  xml += '  </identification>\n';
  xml += '  <part-list>\n';
  xml += '    <score-part id="P1">\n';
  xml += '      <part-name>Guitar</part-name>\n';
  xml += '    </score-part>\n';
  xml += '  </part-list>\n';
  xml += '  <part id="P1">\n';

  // 添加音符
  for (const note of state.notes) {
    xml += '    <measure>\n';
    xml += '      <attributes>\n';
    xml += `        <divisions>4</divisions>\n`;
    xml += `        <key><fifths>0</fifths></key>\n`;
    xml += `        <time><beats>4</beats><beat-type>4</beat-type></time>\n`;
    xml += '      </attributes>\n';
    xml += '      <note>\n';
    xml += `        <pitch><step>C</step><octave>4</octave></pitch>\n`;
    xml += `        <duration>${note.duration}</duration>\n`;
    xml += `        <type>quarter</type>\n`;
    xml += '      </note>\n';
    xml += '    </measure>\n';
  }

  xml += '  </part>\n';
  xml += '</score-partwise>\n';
  return xml;
}

/**
 * 生成 GuitarPro XML
 */
function generateGuitarProXML(state: EditorState): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<GPFILE>\n';
  xml += `  <TITLE>${escapeXml(state.title)}</TITLE>\n`;
  xml += `  <ARTIST>${escapeXml(state.artist)}</ARTIST>\n`;
  xml += `  <TEMPO>${state.bpm}</TEMPO>\n`;
  xml += `  <KEY>${state.key}</KEY>\n`;
  xml += '  <NOTES>\n';

  for (const note of state.notes) {
    xml += '    <NOTE>\n';
    xml += `      <STRING>${note.string}</STRING>\n`;
    xml += `      <FRET>${note.fret}</FRET>\n`;
    xml += `      <DURATION>${note.duration}</DURATION>\n`;
    xml += `      <TIME>${note.startTime}</TIME>\n`;
    xml += '    </NOTE>\n';
  }

  xml += '  </NOTES>\n';
  xml += '  <CHORDS>\n';

  for (const chord of state.chords) {
    xml += '    <CHORD>\n';
    xml += `      <NAME>${escapeXml(chord.name)}</NAME>\n`;
    xml += `      <TIME>${chord.startTime}</TIME>\n`;
    xml += '    </CHORD>\n';
  }

  xml += '  </CHORDS>\n';
  xml += '</GPFILE>\n';
  return xml;
}

/**
 * 转义 XML 特殊字符
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * 下载文件
 */
export function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default {
  exportToPDF,
  exportToMusicXML,
  exportToGuitarPro,
  downloadFile,
};
