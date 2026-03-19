import React from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  TrendingUp, 
  Award,
  Plus,
  Search
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { motion } from 'motion/react';

const mockData = [
  { name: 'Minggu 1', hafalan: 5 },
  { name: 'Minggu 2', hafalan: 12 },
  { name: 'Minggu 3', hafalan: 18 },
  { name: 'Minggu 4', hafalan: 25 },
  { name: 'Minggu 5', hafalan: 32 },
  { name: 'Minggu 6', hafalan: 45 },
];

const recentActivities = [
  { id: 1, student: 'Ahmad Fauzi', surah: 'An-Naba', ayat: '1-10', quality: 'Lancar', date: '2024-03-18' },
  { id: 2, student: 'Siti Aminah', surah: 'Al-Mulk', ayat: '15-30', quality: 'Sedang', date: '2024-03-17' },
  { id: 3, student: 'Yusuf Mansur', surah: 'Yasin', ayat: '1-20', quality: 'Sangat Lancar', date: '2024-03-17' },
];

export default function TahfidzModule() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Tahfidz & Diniyah</h1>
          <p className="text-slate-500 mt-1">Pantau perkembangan hafalan dan capaian santri.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
          <Plus size={20} />
          Input Setoran Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Hafalan', value: '12 Juz', icon: BookOpen, color: 'bg-blue-500' },
          { label: 'Setoran Minggu Ini', value: '45 Santri', icon: CheckCircle2, color: 'bg-emerald-500' },
          { label: 'Target Kurikulum', value: '85%', icon: TrendingUp, color: 'bg-amber-500' },
          { label: 'Prestasi Terbaik', value: 'Yusuf M.', icon: Award, color: 'bg-purple-500' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
          >
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4", stat.color)}>
              <stat.icon size={24} />
            </div>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Grafik Perkembangan Hafalan</h3>
            <select className="text-sm border-none bg-slate-50 rounded-lg px-3 py-1 focus:ring-0">
              <option>6 Bulan Terakhir</option>
              <option>1 Tahun Terakhir</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData}>
                <defs>
                  <linearGradient id="colorHafalan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="hafalan" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorHafalan)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Setoran Terbaru</h3>
          <div className="space-y-6">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold shrink-0">
                  {activity.student.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{activity.student}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{activity.surah} • Ayat {activity.ayat}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                      activity.quality.includes('Sangat') ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                    )}>
                      {activity.quality}
                    </span>
                    <span className="text-[10px] text-slate-400">{activity.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors">
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
