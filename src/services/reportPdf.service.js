const PDFDocument = require('pdfkit');

function safeText(value) {
  if (value === null || value === undefined || value === '') return '-';
  return String(value);
}

function formatDate(value) {
  if (!value) return '-';

  return new Date(value).toLocaleString('es-BO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatMoney(value) {
  const numberValue = Number(value || 0);
  return `Bs ${numberValue.toFixed(2)}`;
}

function drawTitle(doc, title, subtitle = '') {
  doc
    .font('Helvetica-Bold')
    .fontSize(18)
    .fillColor('#0d47a1')
    .text('Veterinaria X', { align: 'center' });

  doc
    .moveDown(0.3)
    .fontSize(15)
    .fillColor('#222222')
    .text(title, { align: 'center' });

  doc.moveDown(0.4);

  doc
    .font('Helvetica')
    .fontSize(9)
    .fillColor('#555555')
    .text(`Fecha de generación: ${formatDate(new Date())}`, { align: 'center' });

  if (subtitle) {
    doc
      .moveDown(0.2)
      .fontSize(9)
      .fillColor('#555555')
      .text(subtitle, { align: 'center' });
  }

  doc.moveDown(1);
}

function drawSummary(doc, summary = []) {
  if (!summary.length) return;

  const startX = doc.page.margins.left;
  const y = doc.y;
  const boxHeight = 42;
  const gap = 8;
  const boxWidth = 180;

  let x = startX;

  summary.forEach((item) => {
    doc
      .roundedRect(x, y, boxWidth, boxHeight, 8)
      .fillAndStroke('#f5f9ff', '#d6e6f8');

    doc
      .fillColor('#0d47a1')
      .font('Helvetica-Bold')
      .fontSize(9)
      .text(item.label, x + 10, y + 8, {
        width: boxWidth - 20,
      });

    doc
      .fillColor('#222222')
      .font('Helvetica-Bold')
      .fontSize(12)
      .text(safeText(item.value), x + 10, y + 23, {
        width: boxWidth - 20,
      });

    x += boxWidth + gap;
  });

  doc.y = y + boxHeight + 18;
}

function drawTableHeader(doc, columns, x, y) {
  const rowHeight = 26;
  let currentX = x;

  columns.forEach((column) => {
    doc
      .rect(currentX, y, column.width, rowHeight)
      .fillAndStroke('#1976d2', '#1976d2');

    doc
      .fillColor('#ffffff')
      .font('Helvetica-Bold')
      .fontSize(8)
      .text(column.label, currentX + 5, y + 8, {
        width: column.width - 10,
        height: rowHeight - 8,
        ellipsis: true,
      });

    currentX += column.width;
  });

  return y + rowHeight;
}

function getRowHeight(doc, columns, row) {
  let maxHeight = 24;

  doc.font('Helvetica').fontSize(8);

  columns.forEach((column) => {
    const text = safeText(row[column.key]);
    const height = doc.heightOfString(text, {
      width: column.width - 10,
    });

    maxHeight = Math.max(maxHeight, height + 14);
  });

  return Math.min(Math.max(maxHeight, 24), 60);
}

function drawTableRow(doc, columns, row, x, y, rowHeight, index) {
  let currentX = x;
  const background = index % 2 === 0 ? '#ffffff' : '#f7f9fc';

  columns.forEach((column) => {
    doc
      .rect(currentX, y, column.width, rowHeight)
      .fillAndStroke(background, '#d9d9d9');

    doc
      .fillColor('#222222')
      .font('Helvetica')
      .fontSize(8)
      .text(safeText(row[column.key]), currentX + 5, y + 7, {
        width: column.width - 10,
        height: rowHeight - 10,
        ellipsis: true,
      });

    currentX += column.width;
  });
}

function drawEmptyMessage(doc) {
  doc
    .font('Helvetica')
    .fontSize(11)
    .fillColor('#666666')
    .text('No existen registros para mostrar en este reporte.', {
      align: 'center',
    });
}

function writeTablePdf(doc, config) {
  const {
    title,
    subtitle,
    columns,
    rows,
    summary,
  } = config;

  const marginLeft = doc.page.margins.left;
  const marginBottom = doc.page.height - doc.page.margins.bottom;

  drawTitle(doc, title, subtitle);
  drawSummary(doc, summary);

  if (!rows || rows.length === 0) {
    drawEmptyMessage(doc);
    return;
  }

  let y = doc.y;
  y = drawTableHeader(doc, columns, marginLeft, y);

  rows.forEach((row, index) => {
    const rowHeight = getRowHeight(doc, columns, row);

    if (y + rowHeight > marginBottom) {
      doc.addPage();
      y = doc.page.margins.top;
      y = drawTableHeader(doc, columns, marginLeft, y);
    }

    drawTableRow(doc, columns, row, marginLeft, y, rowHeight, index);
    y += rowHeight;
  });
}

function buildReportPdfBuffer(config) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        margin: 36,
        size: 'A4',
        layout: 'landscape',
      });

      const chunks = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      writeTablePdf(doc, config);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

function streamReportPdf(res, filename, config) {
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${filename}"`);

  const doc = new PDFDocument({
    margin: 36,
    size: 'A4',
    layout: 'landscape',
  });

  doc.pipe(res);
  writeTablePdf(doc, config);
  doc.end();
}

module.exports = {
  buildReportPdfBuffer,
  streamReportPdf,
  formatDate,
  formatMoney,
};