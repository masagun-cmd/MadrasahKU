import React from 'react';
import { 
  Bell, 
  MessageSquare, 
  Megaphone, 
  UserCircle,
  Send,
  Plus
} from 'lucide-react';
import { motion } from 'motion/react';

const announcements = [
  { id: 1, title: 'Persiapan Ramadhan 1445H', content: 'Diharapkan seluruh santri membawa perlengkapan ibadah tambahan untuk kegiatan i\'tikaf.', date: '2024-03-18', author: 'Admin Madrasah', category: 'Umum' },
  { id: 2, title: 'Jadwal Ujian Semester Ganjil', content: 'Ujian akan dilaksanakan mulai tanggal 25 Maret 2024. Harap melunasi administrasi.', date: '2024-03-15', author: 'Bagian Akademik', category: 'Akademik' },
];

const messages = [
  { id: 1, from: 'Ustadz Ahmad', subject: 'Perkembangan Hafalan Yusuf', preview: 'Assalamu\'alaikum, perkembangan hafalan Yusuf minggu ini sangat baik...', time: '10:30' },
  { id: 2, from: 'Admin Keuangan', subject: 'Konfirmasi Pembayaran SPP', preview: 'Terima kasih, pembayaran SPP bulan Maret telah kami terima...', time: 'Kemarin' },
];

export default function CommunicationModule() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Komunikasi</h1>
          <p className="text-slate-500 mt-1">Pusat informasi dan pesan antara sekolah dan wali murid.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
          <Plus size={20} />
          Buat Pengumuman
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Megaphone size={20} className="text-emerald-600" />
            Pengumuman Sekolah
          </h3>
          {announcements.map((ann) => (
            <motion.div
              key={ann.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider rounded-full">
                  {ann.category}
                </span>
                <span className="text-xs text-slate-400">{ann.date}</span>
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">{ann.title}</h4>
              <p className="text-slate-600 leading-relaxed mb-6">{ann.content}</p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <UserCircle size={20} />
                </div>
                <span className="text-sm font-medium text-slate-500">{ann.author}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare size={20} className="text-emerald-600" />
            Pesan Masuk
          </h3>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-50">
              {messages.map((msg) => (
                <button key={msg.id} className="w-full p-4 text-left hover:bg-slate-50 transition-colors flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold shrink-0">
                    {msg.from.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-bold text-slate-900 truncate">{msg.from}</p>
                      <span className="text-[10px] text-slate-400">{msg.time}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-700 truncate mb-1">{msg.subject}</p>
                    <p className="text-xs text-slate-500 truncate">{msg.preview}</p>
                  </div>
                </button>
              ))}
            </div>
            <button className="w-full py-3 text-sm font-bold text-emerald-600 hover:bg-emerald-50 transition-colors border-t border-slate-50">
              Lihat Semua Pesan
            </button>
          </div>

          <div className="bg-emerald-600 p-6 rounded-2xl text-white shadow-xl shadow-emerald-100">
            <h4 className="font-bold mb-2">Buku Penghubung Digital</h4>
            <p className="text-xs text-emerald-100 leading-relaxed mb-4">
              Gunakan fitur ini untuk berkonsultasi langsung dengan wali kelas atau ustadz pengampu hafalan.
            </p>
            <button className="w-full py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
              <Send size={16} />
              Kirim Pesan Baru
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
