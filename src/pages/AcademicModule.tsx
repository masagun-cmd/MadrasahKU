import React, { useState } from 'react';
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
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';

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
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const handleGradeChange = (studentId: string, subject: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setStudents(prev => prev.map(s => 
      s.id === studentId 
        ? { ...s, grades: { ...s.grades, [subject]: numValue } }
        : s
    ));
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
    if (user?.role === 'guru' || user?.role === 'admin') {
      return (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText size={20} className="text-emerald-600" />
                Input Nilai E-Rapor
              </h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all">
                <Save size={18} />
                Simpan Semua
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
                        {subjects.map(subject => (
                          <td key={subject} className="px-6 py-4">
                            <input 
                              type="number"
                              min="0"
                              max="100"
                              value={student.grades[subject as keyof typeof student.grades] || ''}
                              onChange={(e) => handleGradeChange(student.id, subject, e.target.value)}
                              className="w-16 px-2 py-1 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </td>
                        ))}
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
