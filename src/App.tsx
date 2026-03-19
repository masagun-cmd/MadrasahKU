import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import TahfidzModule from './pages/TahfidzModule';
import FinanceModule from './pages/FinanceModule';

import AcademicModule from './pages/AcademicModule';
import AttendanceModule from './pages/AttendanceModule';
import StudentsModule from './pages/StudentsModule';
import CommunicationModule from './pages/CommunicationModule';

function AppContent() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'santri':
        return <StudentsModule />;
      case 'tahfidz':
        return <TahfidzModule />;
      case 'akademik':
        return <AcademicModule />;
      case 'presensi':
        return <AttendanceModule />;
      case 'keuangan':
        return <FinanceModule />;
      case 'komunikasi':
        return <CommunicationModule />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
            <div className="p-4 bg-slate-100 rounded-full">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <p className="text-lg font-medium">Modul "{activeTab}" sedang dalam pengembangan.</p>
          </div>
        );
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
