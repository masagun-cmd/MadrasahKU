/**
 * MadrasahKu Backend - Google Apps Script
 * 
 * Panduan Setup:
 * 1. Buka script.google.com
 * 2. Buat proyek baru dengan nama "MadrasahKu Backend"
 * 3. Salin kode ini ke dalam editor (code.gs)
 * 4. Buat Google Sheet baru dan ambil ID-nya (dari URL)
 * 5. Ganti SPREADSHEET_ID di bawah dengan ID Sheet Anda
 * 6. Deploy sebagai Web App:
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 7. Salin URL Web App yang dihasilkan ke aplikasi React Anda
 */

const SPREADSHEET_ID = 'ID_GOOGLE_SHEET_ANDA';

function doGet(e) {
  const action = e.parameter.action;
  
  try {
    switch (action) {
      case 'setup':
        return jsonResponse(setupDatabase());
      case 'getStudents':
        return jsonResponse(getStudents());
      case 'getGrades':
        return jsonResponse(getGrades());
      case 'getTahfidz':
        return jsonResponse(getTahfidz());
      case 'getFinance':
        return jsonResponse(getFinance());
      default:
        return jsonResponse({ error: 'Action not found' }, 404);
    }
  } catch (error) {
    return jsonResponse({ error: error.toString() }, 500);
  }
}

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('MadrasahKu')
    .addItem('Siapkan Database Awal', 'setupDatabase')
    .addToUi();
}

/**
 * Menyiapkan struktur database awal di Google Sheets
 */
function setupDatabase() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  const sheets = [
    { name: 'Students', headers: ['ID', 'Name', 'Class', 'Phone', 'Grades'] },
    { name: 'Attendance', headers: ['Timestamp', 'StudentID', 'StudentName', 'Status'] },
    { name: 'Grades', headers: ['StudentID', 'Subject', 'Grade', 'Timestamp'] },
    { name: 'Tahfidz', headers: ['StudentID', 'Surah', 'Ayat', 'Status', 'Timestamp'] },
    { name: 'Finance', headers: ['StudentID', 'Type', 'Amount', 'Date', 'Status'] }
  ];
  
  sheets.forEach(s => {
    let sheet = ss.getSheetByName(s.name);
    if (!sheet) {
      sheet = ss.insertSheet(s.name);
      sheet.appendRow(s.headers);
      
      // Tambahkan data contoh untuk Students
      if (s.name === 'Students') {
        sheet.appendRow(['101', 'Ahmad Fauzi', '7A', '+6281234567890', '{}']);
        sheet.appendRow(['102', 'Siti Aminah', '7A', '+6281234567891', '{}']);
        sheet.appendRow(['103', 'Yusuf Mansur', '7A', '+6281234567892', '{}']);
      }
    }
  });
  
  return { success: true, message: 'Database MadrasahKu berhasil disiapkan!' };
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const action = data.action;
  
  try {
    switch (action) {
      case 'saveAttendance':
        return jsonResponse(saveAttendance(data.payload));
      case 'saveGrades':
        return jsonResponse(saveGrades(data.payload));
      case 'saveTahfidz':
        return jsonResponse(saveTahfidz(data.payload));
      case 'saveFinance':
        return jsonResponse(saveFinance(data.payload));
      default:
        return jsonResponse({ error: 'Action not found' }, 404);
    }
  } catch (error) {
    return jsonResponse({ error: error.toString() }, 500);
  }
}

function jsonResponse(data, status = 200) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// --- Database Logic ---

function getStudents() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Students') || createSheet(ss, 'Students', ['ID', 'Name', 'Class', 'Phone', 'Grades']);
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  
  return data.map(row => {
    let obj = {};
    headers.forEach((header, i) => obj[header.toLowerCase()] = row[i]);
    return obj;
  });
}

function getTahfidz() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Tahfidz') || createSheet(ss, 'Tahfidz', ['StudentID', 'Surah', 'Ayat', 'Status', 'Timestamp']);
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  
  return data.map(row => {
    let obj = {};
    headers.forEach((header, i) => obj[header.toLowerCase()] = row[i]);
    return obj;
  });
}

function getFinance() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Finance') || createSheet(ss, 'Finance', ['StudentID', 'Type', 'Amount', 'Date', 'Status']);
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  
  return data.map(row => {
    let obj = {};
    headers.forEach((header, i) => obj[header.toLowerCase()] = row[i]);
    return obj;
  });
}

function saveAttendance(payload) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Attendance') || createSheet(ss, 'Attendance', ['Timestamp', 'StudentID', 'StudentName', 'Status']);
  
  sheet.appendRow([
    new Date(),
    payload.studentId,
    payload.studentName,
    payload.status
  ]);
  
  return { success: true, message: 'Kehadiran berhasil dicatat' };
}

function saveGrades(payload) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Grades') || createSheet(ss, 'Grades', ['StudentID', 'Subject', 'Grade', 'Timestamp']);
  
  // Logic to update or append
  const data = sheet.getDataRange().getValues();
  let found = false;
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == payload.studentId && data[i][1] == payload.subject) {
      sheet.getRange(i + 1, 3).setValue(payload.grade);
      sheet.getRange(i + 1, 4).setValue(new Date());
      found = true;
      break;
    }
  }
  
  if (!found) {
    sheet.appendRow([payload.studentId, payload.subject, payload.grade, new Date()]);
  }
  
  return { success: true, message: 'Nilai berhasil disimpan' };
}

function saveTahfidz(payload) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Tahfidz') || createSheet(ss, 'Tahfidz', ['StudentID', 'Surah', 'Ayat', 'Status', 'Timestamp']);
  
  sheet.appendRow([
    payload.studentId,
    payload.surah,
    payload.ayat,
    payload.status,
    new Date()
  ]);
  
  return { success: true, message: 'Setoran Tahfidz berhasil disimpan' };
}

function saveFinance(payload) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Finance') || createSheet(ss, 'Finance', ['StudentID', 'Type', 'Amount', 'Date', 'Status']);
  
  sheet.appendRow([
    payload.studentId,
    payload.type,
    payload.amount,
    payload.date || new Date(),
    payload.status || 'Lunas'
  ]);
  
  return { success: true, message: 'Data keuangan berhasil disimpan' };
}

function createSheet(ss, name, headers) {
  const sheet = ss.insertSheet(name);
  sheet.appendRow(headers);
  return sheet;
}
