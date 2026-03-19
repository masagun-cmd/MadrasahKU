import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Calendar, 
  Wallet, 
  MessageSquare, 
  LogOut,
  Menu,
  X,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

interface SidebarItemProps {
  icon: any;
  label: string;
  active?: boolean;
  onClick: () => void;
  key?: string | number;
}

const SidebarItem = ({ icon: Icon, label, active, onClick }: SidebarItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center w-full gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-lg",
      active 
        ? "bg-emerald-50 text-emerald-700" 
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    )}
  >
    <Icon size={20} />
    {label}
  </button>
);

export default function DashboardLayout({ children, activeTab, setActiveTab }: { 
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'guru', 'wali', 'siswa'] },
    { id: 'santri', label: 'Data Santri', icon: Users, roles: ['admin', 'guru'] },
    { id: 'tahfidz', label: 'Tahfidz & Diniyah', icon: BookOpen, roles: ['admin', 'guru', 'wali', 'siswa'] },
    { id: 'akademik', label: 'Akademik', icon: GraduationCap, roles: ['admin', 'guru', 'wali', 'siswa'] },
    { id: 'presensi', label: 'Presensi', icon: Calendar, roles: ['admin', 'guru', 'wali'] },
    { id: 'keuangan', label: 'Keuangan', icon: Wallet, roles: ['admin', 'wali'] },
    { id: 'komunikasi', label: 'Komunikasi', icon: MessageSquare, roles: ['admin', 'guru', 'wali', 'siswa'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(user?.role || ''));

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transition-transform lg:relative lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 px-6 py-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-600 text-white">
              <GraduationCap size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">MadrasahKu</span>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {filteredMenu.map((item) => (
              <SidebarItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                active={activeTab === item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
              />
            ))}
          </nav>

          <div className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-3 px-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                {user?.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center w-full gap-3 px-4 py-2 text-sm font-medium text-red-600 transition-colors rounded-lg hover:bg-red-50"
            >
              <LogOut size={18} />
              Keluar
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 bg-white border-bottom border-slate-200 lg:hidden">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-600 text-white">
              <GraduationCap size={20} />
            </div>
            <span className="font-bold text-slate-900">MadrasahKu</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
