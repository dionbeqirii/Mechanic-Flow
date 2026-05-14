import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const safe = (str = '') =>
  str.replace(/ë/g, 'e').replace(/ç/g, 'c').replace(/Ë/g, 'E').replace(/Ç/g, 'C')
     .replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u');

export function generateInvoice(svc) {
  const doc = new jsPDF();
  const W = doc.internal.pageSize.getWidth(); // 210

  // ── Header bar ──────────────────────────────────────────────
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, W, 48, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('MechanicFlow', 20, 22);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('Sistemim dhe Servisim Automjetesh', 20, 32);

  // Invoice badge top-right
  doc.setFillColor(37, 99, 235);
  doc.roundedRect(W - 55, 10, 42, 14, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('FATURE', W - 34, 19, { align: 'center' });

  // ── Invoice meta ─────────────────────────────────────────────
  doc.setTextColor(71, 85, 105); // slate-500
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const metaY = 66;
  doc.text('Nr. Faturs:', 20, metaY);
  doc.text('Data:', 20, metaY + 9);
  doc.text('Statusi:', 20, metaY + 18);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text(`#${svc._id.slice(-8).toUpperCase()}`, 52, metaY);
  doc.text(new Date(svc.createdAt).toLocaleDateString('sq-AL'), 52, metaY + 9);

  const statusColor = svc.status === 'Mbyllur' ? [34, 197, 94] : svc.status === 'Ne Proces' ? [59, 130, 246] : [249, 115, 22];
  doc.setTextColor(...statusColor);
  doc.text(safe(svc.status), 52, metaY + 18);

  // ── Car plate box ─────────────────────────────────────────────
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(20, 96, W - 40, 16, 3, 3, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('TARGA:', 28, 106);
  doc.setTextColor(37, 99, 235);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(svc.carPlate, 52, 106);

  // ── Service table ─────────────────────────────────────────────
  autoTable(doc, {
    startY: 122,
    head: [['Sherbimi', 'Mekanik', 'Cmimi (EUR)']],
    body: [[safe(svc.serviceName), safe(svc.mechanic), `EUR ${svc.price}`]],
    styles: { fontSize: 10, cellPadding: 8, textColor: [15, 23, 42] },
    headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold', fontSize: 9 },
    columnStyles: { 2: { halign: 'right', fontStyle: 'bold' } },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  });

  const endY = doc.lastAutoTable.finalY;

  // Description
  if (svc.description) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 116, 139);
    doc.text(`Shenime: ${safe(svc.description)}`, 20, endY + 14);
  }

  // ── Total box ─────────────────────────────────────────────────
  const totalY = endY + (svc.description ? 30 : 18);
  doc.setFillColor(37, 99, 235);
  doc.roundedRect(W - 72, totalY, 52, 24, 4, 4, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('TOTAL', W - 46, totalY + 9, { align: 'center' });
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text(`EUR ${svc.price}`, W - 46, totalY + 19, { align: 'center' });

  // ── Footer ────────────────────────────────────────────────────
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 272, W, 25, 'F');
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('MechanicFlow — Faleminderit per besimin!', W / 2, 282, { align: 'center' });
  doc.text('Gjeneruar automatikisht nga sistemi.', W / 2, 290, { align: 'center' });

  doc.save(`Fatura-${svc.carPlate}-${svc._id.slice(-6).toUpperCase()}.pdf`);
}
