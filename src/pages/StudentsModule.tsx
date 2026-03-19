import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Loader2, 
  X, 
  Save, 
  UserPlus,
  Phone,
  School,
  IdCard,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { apiService } from '../services/apiService';
import { cn } from '../lib/utils';

interface Student {
  id: string;
  name: string;
  class: string;
  phone: string;
  grades: Record<string, number>;
}

export default function StudentsModule() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    class: '',
    phone: ''
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // NIS Validation: Numeric, 4-12 digits
    if (!/^\d{4,12}$/.test(formData.id)) {
      newErrors.id = 'NIS harus berupa angka (4-12 digit)';
    }

    // Name Validation: Min 3 chars, letters and spaces only
    if (formData.name.trim().length < 3) {
      newErrors.name = 'Nama minimal 3 karakter';
    } else if (!/^[a-zA-Z\s'.]+$/.test(formData.name)) {
      newErrors.name = 'Nama hanya boleh berisi huruf';
    }

    // Class Validation: e.g. 7A, 10-IPA-1, etc.
    if (formData.class.trim().length < 1) {
      newErrors.class = 'Kelas harus diisi';
    }

    // Phone Validation: Indonesian format
    if (!/^(08|\+628)\d{8,11}$/.test(formData.phone)) {
      newErrors.phone = 'Format HP tidak valid (contoh: 081234567890)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getStudents();
      if (data) setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (student?: Student) => {
    setErrors({});
    if (student) {
      setEditingStudent(student);
      setFormData({
        id: student.id,
        name: student.name,
        class: student.class,
        phone: student.phone
      });
    } else {
      setEditingStudent(null);
      setFormData({
        id: '',
        name: '',
        class: '',
        phone: ''
      });
    }
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      if (editingStudent) {
        await apiService.updateStudent(formData);
      } else {
        // Check if NIS already exists
        if (students.some(s => s.id === formData.id)) {
          setErrors({ id: 'NIS sudah terdaftar' });
          setIsSaving(false);
          return;
        }
        await apiService.addStudent(formData);
      }
      await fetchStudents();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving student:', error);
      alert('Gagal menyimpan data santri');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data santri ini?')) return;
    
    setIsLoading(true);
    try {
      await apiService.deleteStudent(id);
      await fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Gagal menghapus data santri');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.includes(searchQuery) ||
    s.class.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Data Santri</h2>
          <p className="text-slate-500 font-medium">Kelola informasi induk seluruh santri</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
        >
          <UserPlus size={20} />
          Tambah Santri
        </button>
      </div>

      {/* Stats & Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Cari nama, NIS, atau kelas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium"
          />
        </div>
        <div className="bg-emerald-600 p-4 rounded-2xl shadow-lg shadow-emerald-100 flex items-center justify-between text-white">
          <div>
            <p className="text-emerald-100 text-xs font-bold uppercase tracking-wider">Total Santri</p>
            <p className="text-3xl font-black">{students.length}</p>
          </div>
          <Users size={32} className="opacity-20" />
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-20 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="animate-spin text-emerald-600" size={40} />
            <p className="text-slate-500 font-medium">Memuat data santri...</p>
          </div>
        ) : filteredStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Santri</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">NIS</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Kelas</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Kontak</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">
                          {student.name.charAt(0)}
                        </div>
                        <p className="font-bold text-slate-900">{student.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-mono font-bold">
                        {student.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600 font-medium">
                        <School size={14} className="text-slate-400" />
                        {student.class}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600 font-medium">
                        <Phone size={14} className="text-slate-400" />
                        {student.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenModal(student)}
                          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(student.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-20 flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-6 bg-slate-50 rounded-full text-slate-300">
              <Users size={64} strokeWidth={1} />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">Tidak ada santri ditemukan</p>
              <p className="text-slate-500">Coba kata kunci lain atau tambah santri baru</p>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
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
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                    {editingStudent ? <Edit2 size={20} /> : <UserPlus size={20} />}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {editingStudent ? 'Edit Data Santri' : 'Tambah Santri Baru'}
                  </h3>
                </div>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-2">
                    <IdCard size={14} className="text-slate-400" />
                    Nomor Induk Santri (NIS)
                  </label>
                  <input 
                    type="text"
                    required
                    disabled={!!editingStudent}
                    value={formData.id}
                    onChange={(e) => {
                      setFormData({...formData, id: e.target.value});
                      if (errors.id) setErrors(prev => { const n = {...prev}; delete n.id; return n; });
                    }}
                    placeholder="Contoh: 2024001"
                    className={cn(
                      "w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 outline-none disabled:opacity-50 font-mono transition-all",
                      errors.id ? "border-rose-500 focus:ring-rose-500" : "border-slate-200 focus:ring-emerald-500"
                    )}
                  />
                  {errors.id && <p className="text-[10px] font-bold text-rose-500 mt-1 ml-1">{errors.id}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-2">
                    <Users size={14} className="text-slate-400" />
                    Nama Lengkap
                  </label>
                  <input 
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({...formData, name: e.target.value});
                      if (errors.name) setErrors(prev => { const n = {...prev}; delete n.name; return n; });
                    }}
                    placeholder="Nama lengkap santri"
                    className={cn(
                      "w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 outline-none transition-all",
                      errors.name ? "border-rose-500 focus:ring-rose-500" : "border-slate-200 focus:ring-emerald-500"
                    )}
                  />
                  {errors.name && <p className="text-[10px] font-bold text-rose-500 mt-1 ml-1">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-2">
                      <School size={14} className="text-slate-400" />
                      Kelas
                    </label>
                    <input 
                      type="text"
                      required
                      value={formData.class}
                      onChange={(e) => {
                        setFormData({...formData, class: e.target.value});
                        if (errors.class) setErrors(prev => { const n = {...prev}; delete n.class; return n; });
                      }}
                      placeholder="7A, 8B, dst"
                      className={cn(
                        "w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 outline-none transition-all",
                        errors.class ? "border-rose-500 focus:ring-rose-500" : "border-slate-200 focus:ring-emerald-500"
                      )}
                    />
                    {errors.class && <p className="text-[10px] font-bold text-rose-500 mt-1 ml-1">{errors.class}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-2">
                      <Phone size={14} className="text-slate-400" />
                      No. HP Orang Tua
                    </label>
                    <input 
                      type="text"
                      required
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({...formData, phone: e.target.value});
                        if (errors.phone) setErrors(prev => { const n = {...prev}; delete n.phone; return n; });
                      }}
                      placeholder="0812..."
                      className={cn(
                        "w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 outline-none transition-all",
                        errors.phone ? "border-rose-500 focus:ring-rose-500" : "border-slate-200 focus:ring-emerald-500"
                      )}
                    />
                    {errors.phone && <p className="text-[10px] font-bold text-rose-500 mt-1 ml-1">{errors.phone}</p>}
                  </div>
                </div>

                {!editingStudent && (
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                    <AlertTriangle className="text-amber-600 shrink-0" size={18} />
                    <p className="text-[10px] text-amber-700 leading-relaxed">
                      Pastikan NIS belum pernah digunakan sebelumnya. Data santri baru akan memiliki nilai kosong secara default.
                    </p>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                  {isSaving ? 'Menyimpan...' : editingStudent ? 'Simpan Perubahan' : 'Tambah Santri'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
