import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  History, 
  AlertTriangle, 
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
  Loader2,
  X,
  Save,
  Plus,
  Settings,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { apiService } from '../services/apiService';

const transactions = [
  { id: 1, type: 'SPP', amount: 500000, date: '2024-03-15', status: 'Lunas', student: 'Ahmad Fauzi' },
  { id: 2, type: 'Infaq', amount: 100000, date: '2024-03-14', status: 'Lunas', student: 'Siti Aminah' },
  { id: 3, type: 'SPP', amount: 500000, date: '2024-03-10', status: 'Tertunda', student: 'Yusuf Mansur' },
];

export default function FinanceModule() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Gateway Config state (initialized from env or localStorage)
  const [gatewayConfig, setGatewayConfig] = useState({
    provider: (import.meta as any).env?.VITE_PAYMENT_PROVIDER || localStorage.getItem('payment_provider') || 'midtrans',
    clientKey: (import.meta as any).env?.VITE_PAYMENT_CLIENT_KEY || localStorage.getItem('payment_client_key') || '',
    serverKey: (import.meta as any).env?.VITE_PAYMENT_SERVER_KEY || localStorage.getItem('payment_server_key') || '',
    env: (import.meta as any).env?.VITE_PAYMENT_ENV || localStorage.getItem('payment_env') || 'sandbox'
  });

  // Form state
  const [selectedStudent, setSelectedStudent] = useState('');
  const [type, setType] = useState('SPP');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('Lunas');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [financeData, studentData] = await Promise.all([
        apiService.getFinance(),
        apiService.getStudents()
      ]);

      if (financeData) {
        const mapped = financeData.map((item: any, index: number) => {
          const student = studentData?.find((s: any) => String(s.id) === String(item.studentid));
          return {
            id: index,
            student: student ? student.name : `Santri ${item.studentid}`,
            type: item.type,
            amount: Number(item.amount),
            date: item.date ? new Date(item.date).toLocaleDateString('id-ID') : '-',
            status: item.status
          };
        }).reverse();
        setTransactions(mapped);
      }

      if (studentData) {
        setStudents(studentData);
      }
    } catch (error) {
      console.error('Error fetching finance data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !amount) return;

    setIsSaving(true);
    try {
      await apiService.saveFinance(selectedStudent, type, Number(amount), new Date().toISOString(), status);
      setShowModal(false);
      // Reset form
      setSelectedStudent('');
      setType('SPP');
      setAmount('');
      setStatus('Lunas');
      // Refresh data
      fetchData();
    } catch (error) {
      console.error('Error saving finance:', error);
      alert('Gagal menyimpan transaksi.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate saving to env by using localStorage for the demo
    localStorage.setItem('payment_provider', gatewayConfig.provider);
    localStorage.setItem('payment_client_key', gatewayConfig.clientKey);
    localStorage.setItem('payment_server_key', gatewayConfig.serverKey);
    localStorage.setItem('payment_env', gatewayConfig.env);
    
    setTimeout(() => {
      setIsSaving(false);
      setShowConfigModal(false);
      alert('Konfigurasi berhasil disimpan (Simulasi). Untuk produksi, harap atur di menu Secrets platform.');
    }, 1000);
  };

  const totalIncome = transactions
    .filter(t => t.status === 'Lunas')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalPending = transactions
    .filter(t => t.status === 'Tertunda')
    .reduce((acc, curr) => acc + curr.amount, 0);

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
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
          >
            <Plus size={18} />
            Buat Tagihan
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showConfigModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                    <Settings size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Konfigurasi Gateway</h3>
                </div>
                <button onClick={() => setShowConfigModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSaveConfig} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Provider</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setGatewayConfig(prev => ({ ...prev, provider: 'midtrans' }))}
                      className={cn(
                        "py-2 px-4 rounded-xl border font-bold text-sm transition-all",
                        gatewayConfig.provider === 'midtrans' 
                          ? "bg-emerald-600 border-emerald-600 text-white" 
                          : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                      )}
                    >
                      Midtrans
                    </button>
                    <button
                      type="button"
                      onClick={() => setGatewayConfig(prev => ({ ...prev, provider: 'xendit' }))}
                      className={cn(
                        "py-2 px-4 rounded-xl border font-bold text-sm transition-all",
                        gatewayConfig.provider === 'xendit' 
                          ? "bg-emerald-600 border-emerald-600 text-white" 
                          : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                      )}
                    >
                      Xendit
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Environment</label>
                  <select 
                    value={gatewayConfig.env}
                    onChange={(e) => setGatewayConfig(prev => ({ ...prev, env: e.target.value }))}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="sandbox">Sandbox (Testing)</option>
                    <option value="production">Production (Live)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Client Key</label>
                  <input 
                    type="password"
                    value={gatewayConfig.clientKey}
                    onChange={(e) => setGatewayConfig(prev => ({ ...prev, clientKey: e.target.value }))}
                    placeholder="SB-Mid-client-..."
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Server Key</label>
                  <input 
                    type="password"
                    value={gatewayConfig.serverKey}
                    onChange={(e) => setGatewayConfig(prev => ({ ...prev, serverKey: e.target.value }))}
                    placeholder="SB-Mid-server-..."
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                  <div className="flex gap-3">
                    <AlertTriangle className="text-amber-600 shrink-0" size={18} />
                    <p className="text-[10px] text-amber-700 leading-relaxed">
                      <strong>Penting:</strong> API Key di atas hanya disimpan secara lokal untuk simulasi. 
                      Untuk penggunaan nyata, harap masukkan variabel berikut di menu <strong>Settings &gt; Secrets</strong> platform:
                      <br /><br />
                      <code>VITE_PAYMENT_PROVIDER</code><br />
                      <code>VITE_PAYMENT_CLIENT_KEY</code><br />
                      <code>VITE_PAYMENT_SERVER_KEY</code><br />
                      <code>VITE_PAYMENT_ENV</code>
                    </p>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  {isSaving ? 'Menyimpan...' : 'Simpan Konfigurasi'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">Buat Tagihan Baru</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Pilih Santri</label>
                  <select 
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    required
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="">Pilih Santri...</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Jenis</label>
                    <select 
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                      <option value="SPP">SPP</option>
                      <option value="Infaq">Infaq</option>
                      <option value="Pembangunan">Pembangunan</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Jumlah (Rp)</label>
                    <input 
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="500000"
                      required
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="Lunas">Lunas</option>
                    <option value="Tertunda">Tertunda</option>
                  </select>
                </div>

                <button 
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  {isSaving ? 'Menyimpan...' : 'Simpan Transaksi'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
              <p className="text-sm opacity-80">Total Pendapatan</p>
              <p className="text-3xl font-bold mt-1">Rp {totalIncome.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-xl">
                  <AlertTriangle size={24} />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tunggakan SPP</span>
              </div>
              <p className="text-sm text-slate-500">Total Tunggakan</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">Rp {totalPending.toLocaleString()}</p>
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
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center">
                        <Loader2 size={32} className="text-emerald-600 animate-spin mx-auto mb-2" />
                        <p className="text-xs text-slate-400">Memuat data...</p>
                      </td>
                    </tr>
                  ) : transactions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-slate-400 text-sm">
                        Belum ada transaksi.
                      </td>
                    </tr>
                  ) : (
                    transactions.map((t) => (
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">Payment Gateway</h3>
              <button 
                onClick={() => setShowConfigModal(true)}
                className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors"
                title="Konfigurasi Gateway"
              >
                <Settings size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <CreditCard className="text-emerald-600" size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Status Gateway</p>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                        {gatewayConfig.provider} • {gatewayConfig.env}
                      </p>
                    </div>
                  </div>
                  <div className={cn(
                    "w-2 h-2 rounded-full animate-pulse",
                    gatewayConfig.clientKey ? "bg-emerald-500" : "bg-slate-300"
                  )} />
                </div>
                {gatewayConfig.clientKey ? (
                  <div className="mt-3 flex items-center gap-2 text-[10px] text-emerald-600 font-bold">
                    <ShieldCheck size={12} />
                    API Key Terkonfigurasi
                  </div>
                ) : (
                  <div className="mt-3 flex items-center gap-2 text-[10px] text-amber-600 font-bold">
                    <AlertTriangle size={12} />
                    Belum Terkonfigurasi
                  </div>
                )}
              </div>
              
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
              *Integrasi {gatewayConfig.provider === 'midtrans' ? 'Midtrans' : 'Xendit'} Aktif
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
