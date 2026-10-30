import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Registration } from '../types';

export function formatDateIndo(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return dateStr;
  }
}

export function formatDateShort(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateStr;
  }
}

/**
 * Export registrations to modern Excel (.xlsx) file
 */
export function exportToExcel(registrations: Registration[]): void {
  if (!registrations || registrations.length === 0) {
    alert('Tidak ada data pendaftar untuk diexport.');
    return;
  }

  const rows = registrations.map((r, index) => ({
    'No': index + 1,
    'No Registrasi': r.id,
    'Tanggal Daftar': formatDateIndo(r.createdAt),
    'Program / Kelas': r.program === 'reguler' ? 'Kelas Reguler' : 'Kelas Karyawan',
    'Gelombang': r.gelombang || '-',
    'Status': r.status.toUpperCase(),
    'Nama Lengkap': r.namaLengkap,
    'Alamat Lengkap': r.alamat,
    'Asal Sekolah / Perusahaan': r.asalSekolahOrPerusahaan,
    'No. WhatsApp Aktif': r.noWaAktif,
    'No. WhatsApp Ortu/Wali': r.noWaOrtu,
    'Alamat Email': r.email,
    'Alasan Mendaftar': r.alasanMendaftar,
    'Sumber Informasi': r.infoDapatDari + (r.infoDapatDariDetail ? ` (${r.infoDapatDariDetail})` : ''),
    'Catatan Admin': r.catatanAdmin || '-'
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Auto calculate column widths
  const colWidths = [
    { wch: 5 },   // No
    { wch: 20 },  // No Registrasi
    { wch: 22 },  // Tanggal
    { wch: 16 },  // Program
    { wch: 32 },  // Gelombang
    { wch: 14 },  // Status
    { wch: 28 },  // Nama
    { wch: 35 },  // Alamat
    { wch: 30 },  // Asal Sekolah/Perusahaan
    { wch: 18 },  // WA Aktif
    { wch: 18 },  // WA Ortu
    { wch: 26 },  // Email
    { wch: 45 },  // Alasan
    { wch: 30 },  // Info Dari
    { wch: 25 },  // Catatan
  ];
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Pendaftar STARS YKPN');

  const today = new Date().toISOString().split('T')[0];
  XLSX.writeFile(workbook, `Data_Pendaftar_STARS_YKPN_${today}.xlsx`);
}

/**
 * Export registrations list to a beautifully styled PDF document
 */
export function exportToPdf(registrations: Registration[]): void {
  if (!registrations || registrations.length === 0) {
    alert('Tidak ada data pendaftar untuk diexport.');
    return;
  }

  // Create A4 Landscape PDF
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const now = new Date();
  const printDate = formatDateIndo(now.toISOString());
  const totalReguler = registrations.filter(r => r.program === 'reguler').length;
  const totalKaryawan = registrations.filter(r => r.program === 'karyawan').length;

  // Header Background bar
  doc.setFillColor(15, 30, 60); // Deep architectural navy
  doc.rect(0, 0, 297, 24, 'F');

  // Gold accent line
  doc.setFillColor(217, 119, 6); // Amber/Gold
  doc.rect(0, 24, 297, 2, 'F');

  // Title text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('SEKOLAH TINGGI ARSITEKTUR YKPN YOGYAKARTA (STARS YKPN)', 14, 11);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('REKAPITULASI RESMI DATA PENDAFTARAN MAHASISWA BARU (PMB)', 14, 18);

  // Print info on right header
  doc.setFontSize(8);
  doc.text(`Dicetak: ${printDate}`, 283, 11, { align: 'right' });
  doc.text(`Total: ${registrations.length} Pendaftar (Reguler: ${totalReguler} | Karyawan: ${totalKaryawan})`, 283, 18, { align: 'right' });

  // Reset text color
  doc.setTextColor(30, 41, 59);

  // Table rows
  const tableData = registrations.map((r, index) => [
    index + 1,
    r.id,
    r.program === 'reguler' ? 'Reguler' : 'Karyawan',
    r.namaLengkap,
    r.asalSekolahOrPerusahaan,
    r.noWaAktif,
    r.noWaOrtu,
    r.email,
    r.infoDapatDari,
    formatDateShort(r.createdAt)
  ]);

  autoTable(doc, {
    head: [[
      'No',
      'No. Reg',
      'Kelas',
      'Nama Lengkap',
      'Asal Sekolah / Perusahaan',
      'No. WA Aktif',
      'WA Ortu/Wali',
      'Email',
      'Info Dari',
      'Tgl Daftar'
    ]],
    body: tableData,
    startY: 32,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2.2,
      textColor: [30, 41, 59],
      lineColor: [226, 232, 240],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [30, 58, 138], // Indigo navy
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center'
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { halign: 'center', cellWidth: 26 },
      2: { halign: 'center', cellWidth: 18 },
      3: { cellWidth: 42 },
      4: { cellWidth: 45 },
      5: { cellWidth: 26 },
      6: { cellWidth: 26 },
      7: { cellWidth: 38 },
      8: { cellWidth: 28 },
      9: { halign: 'center', cellWidth: 18 },
    },
    didDrawPage: (data) => {
      // Footer page numbering
      const pageCount = (doc as any).internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `STARS YKPN Yogyakarta • Jl. Gagak Rimang No. 2-4 Balapan, Yogyakarta • Halaman ${data.pageNumber} dari ${pageCount}`,
        148.5,
        205,
        { align: 'center' }
      );
    }
  });

  const today = new Date().toISOString().split('T')[0];
  doc.save(`Laporan_PMB_STARS_YKPN_${today}.pdf`);
}

/**
 * Export a single registration card / bukti pendaftaran as PDF
 */
export function exportSingleRegistrationPdf(reg: Registration): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Header Banner
  doc.setFillColor(15, 30, 60);
  doc.rect(0, 0, 210, 36, 'F');

  // Gold accent
  doc.setFillColor(217, 119, 6);
  doc.rect(0, 36, 210, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('SEKOLAH TINGGI ARSITEKTUR YKPN YOGYAKARTA', 105, 14, { align: 'center' });

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('TANDA BUKTI PENDAFTARAN MAHASISWA BARU (PMB)', 105, 22, { align: 'center' });

  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text('Jl. Gagak Rimang No. 2-4, Balapan, Gondokusuman, Yogyakarta 55222', 105, 29, { align: 'center' });

  // Registration ID Box
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(15, 44, 180, 20, 2, 2, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(15, 44, 180, 20, 2, 2, 'D');

  doc.setTextColor(71, 85, 105);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('NOMOR REGISTRASI RESMI:', 22, 52);

  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 58, 138);
  doc.text(reg.id, 22, 60);

  // Badge Program
  doc.setFillColor(reg.program === 'reguler' ? 37 : 180, reg.program === 'reguler' ? 99 : 83, reg.program === 'reguler' ? 235 : 9);
  doc.roundedRect(145, 48, 42, 12, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(reg.program === 'reguler' ? 'KELAS REGULER' : 'KELAS KARYAWAN', 166, 55.5, { align: 'center' });

  // Biodata Table
  const rows = [
    ['Nama Lengkap', `: ${reg.namaLengkap}`],
    ['Program Pilihan', `: ${reg.program === 'reguler' ? 'Kelas Reguler (Pagi/Siang)' : 'Kelas Karyawan (Sore/Malam/Akhir Pekan)'}`],
    ...(reg.gelombang ? [['Pilihan Gelombang', `: ${reg.gelombang}`]] : []),
    [reg.program === 'reguler' ? 'Asal Sekolah' : 'Asal Sekolah / Perusahaan', `: ${reg.asalSekolahOrPerusahaan}`],
    ['Alamat Domisili', `: ${reg.alamat}`],
    ['Nomor WhatsApp Aktif', `: ${reg.noWaAktif}`],
    ['Nomor WhatsApp Ortu / Wali', `: ${reg.noWaOrtu}`],
    ['Alamat Email', `: ${reg.email}`],
    ['Sumber Informasi', `: ${reg.infoDapatDari}${reg.infoDapatDariDetail ? ` (${reg.infoDapatDariDetail})` : ''}`],
    ['Tanggal Pendaftaran', `: ${formatDateIndo(reg.createdAt)}`],
    ['Alasan Mendaftar', `: ${reg.alasanMendaftar}`],
  ];

  autoTable(doc, {
    body: rows,
    startY: 70,
    theme: 'plain',
    styles: {
      fontSize: 9.5,
      cellPadding: 2.8,
      textColor: [30, 41, 59],
      valign: 'top',
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50, textColor: [71, 85, 105] },
      1: { cellWidth: 130 },
    },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 10;

  // Verification Instructions Box
  doc.setFillColor(254, 243, 199);
  doc.roundedRect(15, finalY, 180, 28, 2, 2, 'F');
  doc.setDrawColor(245, 158, 11);
  doc.roundedRect(15, finalY, 180, 28, 2, 2, 'D');

  doc.setTextColor(146, 64, 14);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('CATATAN PENTING & LANGKAH SELANJUTNYA:', 20, finalY + 7);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text('1. Simpan lembar bukti ini sebagai tanda sah pendaftaran PMB STARS YKPN.', 20, finalY + 13);
  doc.text('2. Panitia PMB akan menghubungi Anda via WhatsApp resmi untuk jadwal tes bakat/wawancara & penyerahan berkas.', 20, finalY + 18);
  doc.text('3. Layanan informasi PMB WhatsApp: 0812-3456-7890 / Website: www.starsykpn.ac.id', 20, finalY + 23);

  // Signatures
  const signY = finalY + 38;
  doc.setTextColor(51, 65, 85);
  doc.setFontSize(9);

  // Left - Applicant
  doc.text('Calon Mahasiswa/i,', 25, signY);
  doc.text('Materai / Tanda Tangan', 25, signY + 18);
  doc.setFont('helvetica', 'bold');
  doc.text(`( ${reg.namaLengkap} )`, 25, signY + 26);

  // Right - Committee
  doc.setFont('helvetica', 'normal');
  doc.text('Yogyakarta, ' + formatDateShort(new Date().toISOString()), 140, signY);
  doc.text('Panitia Penerimaan Mahasiswa Baru,', 140, signY + 5);
  doc.setFont('helvetica', 'bold');
  doc.text('STARS YKPN Yogyakarta', 140, signY + 26);

  doc.save(`Bukti_Pendaftaran_${reg.id}_${reg.namaLengkap.replace(/\s+/g, '_')}.pdf`);
}
