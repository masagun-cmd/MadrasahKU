import React from 'react';
import { 
  CreditCard, 
  History, 
  AlertTriangle, 
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  Filter
} from 'lucide-react';
import { motion } from 'motion/react';

const transactions = [
  { id: 1, type: 'SPP', amount: 500000, date: '2024-03-15', status: 'Lunas', student: 'Ahmad Fauzi' },
  { id: 2, type: 'Infaq', amount: 100000, date: '2024-03-14', status: 'Lunas', student: 'Siti Aminah' },
  { id: 3, type: 'SPP', amount: 500000, date: '2024-03-10', status: 'Tertunda', student: 'Yusuf Mansur' },
];

export default function FinanceModule() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Keuangan</h1>
          <p className="text-slate-500 mt-1">Kelola SPP, Infaq, dan laporan keuangan madrasah.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-all">
            <Download size={18} />
            Export Laporan
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
            <CreditCard size={18} />
            Buat Tagihan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-emerald-600 p-6 rounded-3xl text-white shadow-xl shadow-emerald-100">
              <div className="flex items-center justify-between mb-8">
                <div className="p-2 bg-white/20 rounded-xl">
                  <ArrowUpRight size={24} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest opacity-80">Total Pendapatan</span>
              </div>
              <p className="text-sm opacity-80">Bulan Maret 2024</p>
              <p className="text-3xl font-bold mt-1">Rp 45.250.000</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-xl">
                  <AlertTriangle size={24} />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tunggakan SPP</span>
              </div>
              <p className="text-sm text-slate-500">Total 12 Siswa</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">Rp 6.000.000</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Transaksi Terbaru</h3>
              <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg">
                <Filter size={20} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Siswa</th>
                    <th className="px-6 py-4">Jenis</th>
                    <th className="px-6 py-4">Jumlah</th>
                    <th className="px-6 py-4">Tanggal</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-900">{t.student}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-slate-600">{t.type}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-900">Rp {t.amount.toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{t.date}</td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider",
                          t.status === 'Lunas' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                        )}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Payment Gateway</h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <CreditCard className="text-emerald-600" size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Virtual Account</p>
                      <p className="text-xs text-slate-500">BNI, Mandiri, BRI</p>
                    </div>
                  </div>
                  <div className="w-10 h-5 bg-emerald-500 rounded-full flex items-center px-1">
                    <div className="w-3 h-3 bg-white rounded-full ml-auto" />
                  </div>
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <Wallet className="text-emerald-600" size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">E-Wallet</p>
                      <p className="text-xs text-slate-500">GoPay, OVO, Dana</p>
                    </div>
                  </div>
                  <div className="w-10 h-5 bg-emerald-500 rounded-full flex items-center px-1">
                    <div className="w-3 h-3 bg-white rounded-full ml-auto" />
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-6 text-center italic">
              *Integrasi Midtrans/Xendit Aktif
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl text-white">
            <h3 className="text-lg font-bold mb-4">Butuh Bantuan?</h3>
            <p className="text-sm text-slate-400 mb-6">Hubungi tim IT Madrasah jika Anda mengalami kendala pembayaran.</p>
            <button className="w-full py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-colors">
              Hubungi Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

function Wallet({ className, size }: { className?: string, size?: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  );
}
