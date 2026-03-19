import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Calendar, 
  FileText, 
  Clock,
  Search,
  Filter,
  ChevronRight,
  Save,
  User,
  BookOpen,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';

const schedule = [
  { day: 'Senin', items: [
    { time: '07:30 - 09:00', subject: 'Tahfidz Al-Qur\'an', teacher: 'Ustadz Ahmad' },
    { time: '09:15 - 10:45', subject: 'Fiqih', teacher: 'Ustadzah Fatimah' },
    { time: '11:00 - 12:30', subject: 'Bahasa Arab', teacher: 'Ustadz Mansur' },
  ]},
  { day: 'Selasa', items: [
    { time: '07:30 - 09:00', subject: 'Tahfidz Al-Qur\'an', teacher: 'Ustadz Ahmad' },
    { time: '09:15 - 10:45', subject: 'Aqidah Akhlak', teacher: 'Ustadz Yusuf' },
    { time: '11:00 - 12:30', subject: 'Sejarah Islam', teacher: 'Ustadzah Aminah' },
  ]},
];

const subjects = [
  'Tahfidz Al-Qur\'an',
  'Fiqih',
  'Bahasa Arab',
  'Aqidah Akhlak',
  'Sejarah Islam'
];

const initialStudents = [
  { id: '101', name: 'Ahmad Fauzi', grades: { 'Tahfidz Al-Qur\'an': 85, 'Fiqih': 80, 'Bahasa Arab': 75, 'Aqidah Akhlak': 90, 'Sejarah Islam': 88 } },
  { id: '102', name: 'Siti Aminah', grades: { 'Tahfidz Al-Qur\'an': 92, 'Fiqih': 88, 'Bahasa Arab': 85, 'Aqidah Akhlak': 95, 'Sejarah Islam': 90 } },
  { id: '103', name: 'Yusuf Mansur', grades: { 'Tahfidz Al-Qur\'an': 78, 'Fiqih': 75, 'Bahasa Arab': 70, 'Aqidah Akhlak': 82, 'Sejarah Islam': 80 } },
];

export default function AcademicModule() {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'dashboard' | 'erapor'>('dashboard');
  const [students, setStudents] = useState(initialStudents);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const data = await apiService.getStudents();
        if (data && Array.isArray(data) && data.length > 0) {
          // Map GAS data to our student structure
          // GAS returns lowercase keys from headers
          const mappedStudents = data.map((s: any) => ({
            id: String(s.id),
            name: s.name,
            grades: s.grades ? JSON.parse(s.grades) : {
              'Tahfidz Al-Qur\'an': 0,
              'Fiqih': 0,
              'Bahasa Arab': 0,
              'Aqidah Akhlak': 0,
              'Sejarah Islam': 0
            }
          }));
          setStudents(mappedStudents);
        }
      } catch (error) {
        console.error('Failed to fetch students:', error);
        setFetchError('Gagal mengambil data santri dari server.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleGradeChange = (studentId: string, subject: string, value: string) => {
    const errorKey = `${studentId}-${subject}`;
    
    if (value === '') {
      setValidationErrors(prev => {
        const next = { ...prev };
        delete next[errorKey];
        return next;
      });
      setStudents(prev => prev.map(s => 
        s.id === studentId 
          ? { ...s, grades: { ...s.grades, [subject]: 0 } }
          : s
      ));
      return;
    }

    const numValue = parseInt(value);
    
    if (isNaN(numValue) || numValue < 0 || numValue > 100) {
      setValidationErrors(prev => ({
        ...prev,
        [errorKey]: '0-100'
      }));
    } else {
      setValidationErrors(prev => {
        const next = { ...prev };
        delete next[errorKey];
        return next;
      });
    }

    // Still update the state so the input is controlled, but we show the error
    setStudents(prev => prev.map(s => 
      s.id === studentId 
        ? { ...s, grades: { ...s.grades, [subject]: isNaN(numValue) ? 0 : numValue } }
        : s
    ));
  };

  const handleSaveAll = async () => {
    if (Object.keys(validationErrors).length > 0) {
      alert('Terdapat kesalahan input. Harap periksa kembali nilai (0-100).');
      return;
    }

    setIsSaving(true);
    try {
      // In a real app, we'd send all at once or in batches
      // For this demo, we'll simulate the process
      for (const student of students) {
        for (const subject of subjects) {
          const grade = student.grades[subject as keyof typeof student.grades] || 0;
          await apiService.saveGrade(student.id, subject, grade);
        }
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save grades:', error);
      alert('Gagal menyimpan nilai. Periksa koneksi atau konfigurasi GAS.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderDashboard = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calendar size={20} className="text-emerald-600" />
              Jadwal Pelajaran
            </h3>
            <div className="flex gap-2">
              <button className="p-2 bg-slate-50 rounded-lg text-slate-400"><Filter size={18} /></button>
              <button className="p-2 bg-slate-50 rounded-lg text-slate-400"><Search size={18} /></button>
            </div>
          </div>

          <div className="space-y-8">
            {schedule.map((day, i) => (
              <div key={i} className="space-y-4">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">{day.day}</h4>
                <div className="grid grid-cols-1 gap-3">
                  {day.items.map((item, j) => (
                    <div key={j} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-emerald-50 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-emerald-600 shadow-sm">
                          <Clock size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{item.subject}</p>
                          <p className="text-xs text-slate-500">{item.time} • {item.teacher}</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-slate-300 group-hover:text-emerald-400 transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Materi & Tugas</h3>
          <div className="space-y-4">
            {[
              { title: 'Tugas Fiqih: Bab Thaharah', deadline: 'Besok, 23:59', type: 'Tugas' },
              { title: 'Materi Bahasa Arab: Isim', deadline: 'Diunggah 2 jam lalu', type: 'Materi' },
              { title: 'Kuis Aqidah Akhlak', deadline: '22 Maret 2024', type: 'Kuis' },
            ].map((task, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                    task.type === 'Tugas' ? "bg-amber-100 text-amber-700" : 
                    task.type === 'Materi' ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                  )}>
                    {task.type}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{task.title}</h4>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <Clock size={12} />
                  {task.deadline}
                </p>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-sm font-bold text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors">
            Lihat Semua Tugas
          </button>
        </div>

        <div className="bg-emerald-600 p-6 rounded-2xl text-white shadow-xl shadow-emerald-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <GraduationCap size={24} />
            </div>
            <h4 className="font-bold">E-Rapor Digital</h4>
          </div>
          <p className="text-xs text-emerald-100 leading-relaxed mb-6">
            Akses nilai akademik dan kepesantrenan secara real-time. Transparansi nilai untuk masa depan santri.
          </p>
          <button 
            onClick={() => setActiveView('erapor')}
            className="w-full py-2 bg-white text-emerald-600 text-sm font-bold rounded-xl hover:bg-emerald-50 transition-colors"
          >
            Buka E-Rapor
          </button>
        </div>
      </div>
    </div>
  );

  const renderERapor = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-100">
          <Loader2 size={40} className="text-emerald-600 animate-spin mb-4" />
          <p className="text-slate-500 font-medium">Mengambil data santri...</p>
        </div>
      );
    }

    if (fetchError) {
      return (
        <div className="p-8 bg-red-50 border border-red-100 rounded-2xl text-center">
          <AlertTriangle size={40} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-red-900 mb-2">Terjadi Kesalahan</h3>
          <p className="text-red-700 mb-6">{fetchError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      );
    }

    if (user?.role === 'guru' || user?.role === 'admin') {
      return (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText size={20} className="text-emerald-600" />
                Input Nilai E-Rapor
              </h3>
              <button 
                onClick={handleSaveAll}
                disabled={isSaving}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all",
                  saveSuccess 
                    ? "bg-emerald-100 text-emerald-700" 
                    : "bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                )}
              >
                {isSaving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : saveSuccess ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <Save size={18} />
                )}
                {isSaving ? 'Menyimpan...' : saveSuccess ? 'Tersimpan' : 'Simpan Semua'}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Nama Santri</th>
                    {subjects.map(subject => (
                      <th key={subject} className="px-6 py-4">{subject}</th>
                    ))}
                    <th className="px-6 py-4 bg-emerald-50 text-emerald-700">Rata-rata</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map(student => {
                    const avg = Math.round((Object.values(student.grades) as number[]).reduce((a, b) => a + b, 0) / subjects.length);
                    return (
                      <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-900">{student.name}</p>
                          <p className="text-xs text-slate-500">NIS: {student.id}</p>
                        </td>
                        {subjects.map(subject => {
                          const errorKey = `${student.id}-${subject}`;
                          const hasError = !!validationErrors[errorKey];
                          return (
                            <td key={subject} className="px-6 py-4">
                              <div className="relative">
                                <input 
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={student.grades[subject as keyof typeof student.grades] || ''}
                                  onChange={(e) => handleGradeChange(student.id, subject, e.target.value)}
                                  className={cn(
                                    "w-16 px-2 py-1 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all",
                                    hasError 
                                      ? "border-red-500 focus:ring-red-500 text-red-600" 
                                      : "border-slate-200 focus:ring-emerald-500 text-slate-900"
                                  )}
                                />
                                {hasError && (
                                  <div className="absolute left-0 -bottom-4 whitespace-nowrap text-[9px] font-bold text-red-500 animate-pulse">
                                    {validationErrors[errorKey]}
                                  </div>
                                )}
                              </div>
                            </td>
                          );
                        })}
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                            {avg}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    // For Siswa or Wali
    // Try to find the student that matches the logged in user's name
    const currentStudent = students.find(s => s.name === user?.name) || students[0];
    const average = Math.round((Object.values(currentStudent.grades) as number[]).reduce((a: number, b: number) => a + b, 0) / subjects.length);

    return (
      <div className="space-y-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                <User size={32} />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-bold text-slate-900">{currentStudent.name}</h3>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                    Lulus KKM
                  </span>
                </div>
                <p className="text-slate-500">NIS: {currentStudent.id} • Kelas 7A</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-center min-w-[140px] shadow-sm">
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Rata-rata Nilai</p>
                <div className="flex items-baseline justify-center gap-1">
                  <p className="text-4xl font-black text-emerald-600">{average}</p>
                  <p className="text-sm font-bold text-emerald-400">/100</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjects.map(subject => (
              <div key={subject} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg text-emerald-600 shadow-sm">
                    <BookOpen size={18} />
                  </div>
                  <p className="text-sm font-bold text-slate-700">{subject}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-2 w-24 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full" 
                      style={{ width: `${currentStudent.grades[subject as keyof typeof currentStudent.grades]}%` }}
                    />
                  </div>
                  <p className="text-lg font-bold text-slate-900">{currentStudent.grades[subject as keyof typeof currentStudent.grades]}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
            <h4 className="font-bold text-emerald-800 mb-2">Catatan Wali Kelas</h4>
            <p className="text-sm text-emerald-700 leading-relaxed">
              Alhamdulillah, {currentStudent.name} menunjukkan perkembangan yang sangat baik dalam hafalan Al-Qur'an dan pemahaman Fiqih. Teruslah istiqomah dalam belajar dan beribadah.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {activeView === 'erapor' && (
              <button 
                onClick={() => setActiveView('dashboard')}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h1 className="text-3xl font-bold text-slate-900">
              {activeView === 'dashboard' ? 'Akademik' : 'E-Rapor Digital'}
            </h1>
          </div>
          <p className="text-slate-500">
            {activeView === 'dashboard' 
              ? 'Kelola jadwal pelajaran, materi, dan tugas santri.' 
              : 'Transparansi nilai akademik dan kepesantrenan santri.'}
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setActiveView(activeView === 'dashboard' ? 'erapor' : 'dashboard')}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-all"
          >
            <FileText size={18} />
            {activeView === 'dashboard' ? 'Buka E-Rapor' : 'Kembali ke Jadwal'}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeView === 'dashboard' ? renderDashboard() : renderERapor()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
