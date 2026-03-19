import React from 'react';
import { 
  Users, 
  Calendar, 
  BookOpen, 
  Bell,
  ArrowRight,
  CheckCircle,
  Clock,
  MessageSquare
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  const stats = [
    { label: 'Total Siswa', value: '342', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Hadir Hari Ini', value: '98%', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Jadwal Aktif', value: '12', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Pesan Baru', value: '5', icon: MessageSquare, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Assalamu'alaikum, {user?.name}</h1>
          <p className="text-slate-500 mt-1">Selamat datang di dashboard MadrasahKu.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <Bell size={20} />
          </div>
          <span className="text-sm font-bold text-slate-700 pr-4">3 Pengumuman Baru</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4", stat.bg, stat.color)}>
              <stat.icon size={24} />
            </div>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-900">Jadwal Hari Ini</h3>
              <button className="text-sm font-bold text-emerald-600 flex items-center gap-1 hover:gap-2 transition-all">
                Lihat Semua <ArrowRight size={16} />
              </button>
            </div>
            <div className="space-y-4">
              {[
                { time: '07:30 - 09:00', subject: 'Tahfidz Al-Qur\'an', teacher: 'Ustadz Ahmad', room: 'Masjid Utama' },
                { time: '09:15 - 10:45', subject: 'Fiqih Ibadah', teacher: 'Ustadzah Fatimah', room: 'Kelas 7A' },
                { time: '11:00 - 12:30', subject: 'Bahasa Arab', teacher: 'Ustadz Mansur', room: 'Kelas 7A' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-slate-50 transition-colors group">
                  <div className="flex flex-col items-center justify-center w-32 py-2 bg-slate-50 rounded-xl group-hover:bg-white transition-colors">
                    <Clock size={16} className="text-slate-400 mb-1" />
                    <span className="text-xs font-bold text-slate-600">{item.time}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900">{item.subject}</h4>
                    <p className="text-xs text-slate-500">{item.teacher} • {item.room}</p>
                  </div>
                  <div className="hidden sm:block">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider rounded-full">
                      Berlangsung
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-emerald-900 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">Visi MadrasahKu</h3>
              <p className="text-emerald-100/80 max-w-md leading-relaxed">
                "Menjadi platform digital terpusat yang menyederhanakan administrasi madrasah, memantau perkembangan akademis & akhlak siswa."
              </p>
              <button className="mt-8 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl transition-colors shadow-lg shadow-emerald-950/50">
                Pelajari Selengkapnya
              </button>
            </div>
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-800 rounded-full blur-3xl opacity-50" />
            <div className="absolute right-10 top-10 text-emerald-800/20">
              <BookOpen size={180} />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-8">Pengumuman Terbaru</h3>
          <div className="space-y-8">
            {[
              { title: 'Ujian Tengah Semester', date: '20 Maret 2024', category: 'Akademik' },
              { title: 'Libur Ramadhan 1445H', date: '11 Maret 2024', category: 'Sekolah' },
              { title: 'Lomba Tahfidz Antar Kelas', date: '5 Maret 2024', category: 'Kegiatan' },
            ].map((news, i) => (
              <div key={i} className="relative pl-6 border-l-2 border-slate-100">
                <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{news.category}</span>
                <h4 className="font-bold text-slate-900 mt-1">{news.title}</h4>
                <p className="text-xs text-slate-400 mt-1">{news.date}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-10 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors border border-dashed border-slate-200">
            Lihat Semua Pengumuman
          </button>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
