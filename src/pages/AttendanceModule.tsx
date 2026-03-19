import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock,
  QrCode,
  Search,
  Users,
  X,
  AlertCircle,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const initialStudents = [
  { id: 1, name: 'Ahmad Fauzi', nis: '12345', status: 'Hadir', guardianPhone: '+6281234567890' },
  { id: 2, name: 'Siti Aminah', nis: '12346', status: 'Sakit', guardianPhone: '+6281234567891' },
  { id: 3, name: 'Yusuf Mansur', nis: '12347', status: 'Hadir', guardianPhone: '+6281234567892' },
  { id: 4, name: 'Fulan bin Fulan', nis: '12348', status: 'Alpa', guardianPhone: '+6281234567893' },
];

const attendanceHistory = [
  { id: 1, date: '2024-03-18', name: 'Ahmad Fauzi', status: 'Hadir', timestamp: '07:30:45' },
  { id: 2, date: '2024-03-18', name: 'Siti Aminah', status: 'Sakit', timestamp: '08:15:20' },
  { id: 3, date: '2024-03-17', name: 'Yusuf Mansur', status: 'Hadir', timestamp: '07:25:10' },
  { id: 4, date: '2024-03-17', name: 'Fulan bin Fulan', status: 'Hadir', timestamp: '07:40:00' },
];

export default function AttendanceModule() {
  const [studentList, setStudentList] = useState(initialStudents);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  const sendWhatsAppNotification = async (studentName: string, phone: string) => {
    try {
      const message = `Assalamu'alaikum, menginformasikan bahwa santri atas nama ${studentName} tercatat ALPA (tidak hadir tanpa keterangan) pada hari ini. Mohon konfirmasinya. Terima kasih.`;
      const response = await fetch('/api/notifications/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: phone, message }),
      });
      const data = await response.json();
      if (data.success) {
        console.log(`WhatsApp notification sent to ${studentName}'s guardian.`);
      }
    } catch (error) {
      console.error('Failed to send WhatsApp notification:', error);
    }
  };

  useEffect(() => {
    if (isScanning) {
      const scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );

      scanner.render(onScanSuccess, onScanFailure);
      scannerRef.current = scanner;

      return () => {
        if (scannerRef.current) {
          scannerRef.current.clear().catch(error => {
            console.error("Failed to clear scanner", error);
          });
        }
      };
    }
  }, [isScanning]);

  function onScanSuccess(decodedText: string) {
    // Assuming decodedText is the student's NIS
    const studentIndex = studentList.findIndex(s => s.nis === decodedText);
    
    if (studentIndex !== -1) {
      const updatedList = [...studentList];
      updatedList[studentIndex] = { ...updatedList[studentIndex], status: 'Hadir' };
      setStudentList(updatedList);
      setLastScanned(studentList[studentIndex].name);
      setScanError(null);
    } else {
      setScanError(`NIS ${decodedText} tidak ditemukan.`);
      setLastScanned(null);
    }
  }

  function onScanFailure(error: any) {
    // We don't want to spam the console or UI with every frame failure
  }

  const updateStatus = (id: number, newStatus: string) => {
    setStudentList(prev => {
      const newList = prev.map(s => s.id === id ? { ...s, status: newStatus } : s);
      const student = newList.find(s => s.id === id);
      if (newStatus === 'Alpa' && student) {
        sendWhatsAppNotification(student.name, student.guardianPhone);
      }
      return newList;
    });
  };

  const downloadCSV = () => {
    const headers = ['Tanggal', 'Nama Santri', 'Status', 'Waktu Update'];
    const rows = attendanceHistory.map(h => [h.date, h.name, h.status, h.timestamp]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `laporan_presensi_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Presensi Digital</h1>
          <p className="text-slate-500 mt-1">Kelola kehadiran santri secara real-time.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsScanning(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-all"
          >
            <QrCode size={18} />
            Scan QR
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
            Simpan Presensi
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isScanning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-emerald-600 text-white">
                <div className="flex items-center gap-3">
                  <QrCode size={24} />
                  <h3 className="text-xl font-bold">Scan QR Santri</h3>
                </div>
                <button 
                  onClick={() => setIsScanning(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-8">
                <div id="reader" className="overflow-hidden rounded-2xl border-2 border-dashed border-slate-200"></div>
                
                <div className="mt-6 space-y-4">
                  {lastScanned && (
                    <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 animate-pulse">
                      <CheckCircle size={20} />
                      <p className="font-bold">Berhasil: {lastScanned} hadir!</p>
                    </div>
                  )}
                  
                  {scanError && (
                    <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100">
                      <AlertCircle size={20} />
                      <p className="font-bold">{scanError}</p>
                    </div>
                  )}

                  <div className="text-center text-slate-500 text-sm">
                    <p>Arahkan kamera ke QR Code santri untuk melakukan presensi otomatis.</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => setIsScanning(false)}
                  className="px-6 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {[
          { label: 'Hadir', value: studentList.filter(s => s.status === 'Hadir').length, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Izin/Sakit', value: studentList.filter(s => s.status === 'Izin' || s.status === 'Sakit').length, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Alpa', value: studentList.filter(s => s.status === 'Alpa').length, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Total Santri', value: studentList.length, icon: Users, color: 'text-slate-600', bg: 'bg-slate-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", stat.bg, stat.color)}>
              <stat.icon size={20} />
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-slate-900">Daftar Kehadiran Kelas 7A</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari santri..." 
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Nama Santri</th>
                <th className="px-6 py-4">NIS</th>
                <th className="px-6 py-4">Status Kehadiran</th>
                <th className="px-6 py-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {studentList.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-900">{s.name}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{s.nis}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {['Hadir', 'Izin', 'Sakit', 'Alpa'].map((status) => (
                        <button
                          key={status}
                          onClick={() => updateStatus(s.id, status)}
                          className={cn(
                            "px-3 py-1 text-[10px] font-bold rounded-full transition-all",
                            s.status === status 
                              ? (status === 'Hadir' ? "bg-emerald-600 text-white" : 
                                 status === 'Alpa' ? "bg-red-600 text-white" : "bg-blue-600 text-white")
                              : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                          )}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-xs font-bold text-emerald-600 hover:underline">Catatan</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-slate-900">Riwayat Presensi</h3>
          <div className="flex gap-2">
            <button 
              onClick={downloadCSV}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 text-sm font-bold rounded-xl hover:bg-emerald-100 transition-colors"
            >
              <Download size={16} />
              Unduh Laporan
            </button>
            <button className="px-4 py-2 bg-slate-50 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-100 transition-colors">
              Filter Tanggal
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Nama Santri</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Waktu Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attendanceHistory.map((h) => (
                <tr key={h.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">{h.date}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-900">{h.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider",
                      h.status === 'Hadir' ? "bg-emerald-100 text-emerald-700" : 
                      h.status === 'Alpa' ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                    )}>
                      {h.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {h.timestamp}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
          <button className="text-sm font-bold text-emerald-600 hover:underline">
            Lihat Semua Riwayat
          </button>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
