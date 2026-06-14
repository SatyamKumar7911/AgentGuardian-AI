import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ShieldAlert, BarChart3, List, Archive, Settings as SettingsIcon, LogOut, Menu, X } from 'lucide-react';
import { DashboardPage } from './pages/DashboardPage';
import { InvestigationsListPage } from './pages/InvestigationsListPage';
import { InvestigationDetailPage } from './pages/InvestigationDetailPage';
import { EvidenceVaultPage } from './pages/EvidenceVaultPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { Footer } from './components/Footer';

function Navigation() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path 
    ? 'text-white border-cyan-400 md:border-b-2 md:border-l-0 border-l-2 pl-3 md:pl-0' 
    : 'text-slate-400 hover:text-white border-transparent md:border-b-2 md:border-l-0 border-l-2 pl-3 md:pl-0';

  return (
    <nav className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 text-sm font-medium">
      <Link to="/dashboard" className={`pb-2 md:pb-4 pt-2 md:pt-4 transition-colors ${isActive('/dashboard')}`}>
        <span className="flex items-center gap-2"><BarChart3 className="w-5 h-5 md:w-4 md:h-4"/> Dashboard</span>
      </Link>
      <Link to="/investigations" className={`pb-2 md:pb-4 pt-2 md:pt-4 transition-colors ${isActive('/investigations')}`}>
        <span className="flex items-center gap-2"><List className="w-5 h-5 md:w-4 md:h-4"/> Investigations</span>
      </Link>
      <Link to="/evidence-vault" className={`pb-2 md:pb-4 pt-2 md:pt-4 transition-colors ${isActive('/evidence-vault')}`}>
        <span className="flex items-center gap-2"><Archive className="w-5 h-5 md:w-4 md:h-4"/> Evidence Vault</span>
      </Link>
      <Link to="/settings" className={`pb-2 md:pb-4 pt-2 md:pt-4 transition-colors ${isActive('/settings')}`}>
        <span className="flex items-center gap-2"><SettingsIcon className="w-5 h-5 md:w-4 md:h-4"/> Settings</span>
      </Link>
    </nav>
  );
}

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  const pathname = window.location.pathname;
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  if (!token) {
    return <LoginPage onLogin={(t) => { setToken(t); localStorage.setItem('token', t); }} />;
  }

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0a0f1a] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed text-slate-100 font-sans selection:bg-cyan-500/30">
        
        {/* Background Gradient Orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px]" />
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          {/* Header */}
          <header className="border-b border-white/5 backdrop-blur-xl bg-slate-900/50 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
              <Link to="/dashboard" className="flex items-center gap-3 py-4">
                <div className="bg-gradient-to-br from-cyan-400 to-blue-600 p-2 rounded-xl shadow-lg shadow-cyan-500/20">
                  <ShieldAlert className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                    AgentGuardian AI
                  </h1>
                  <p className="text-xs text-cyan-400 font-medium tracking-wide">POWERED BY FOUNDRY IQ</p>
                </div>
              </Link>
              
              {/* Desktop Nav */}
              <div className="hidden md:flex items-center gap-8">
                <Navigation />
                <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 flex items-center gap-2 text-sm font-medium transition-colors">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-slate-300 hover:text-white p-2"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Mobile Nav */}
            {isMobileMenuOpen && (
              <div className="md:hidden border-t border-white/5 bg-slate-900/95 backdrop-blur-xl absolute top-full left-0 w-full shadow-2xl">
                <div className="flex flex-col px-4 py-6 gap-6">
                  <Navigation />
                  <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 flex items-center gap-2 text-sm font-medium transition-colors pl-3 border-l-2 border-transparent">
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                </div>
              </div>
            )}
          </header>

          {/* Main Content */}
          <main className="flex-1 p-4 md:p-6 lg:p-12 flex flex-col max-w-7xl mx-auto w-full">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/investigations" element={<InvestigationsListPage />} />
              <Route path="/investigation/:id" element={<InvestigationDetailPage />} />
              <Route path="/evidence-vault" element={<EvidenceVaultPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
