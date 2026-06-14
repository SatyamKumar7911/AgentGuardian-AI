import React from 'react';
import { Database, ShieldAlert, Globe, Mail, Building, Phone } from 'lucide-react';

export const EvidenceVaultPage: React.FC = () => {
  return (
    <div className="space-y-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Global Evidence Vault</h1>
        <p className="text-slate-400">A centralized repository of all entities extracted across all investigations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {[
          { label: 'Malicious Domains', value: '142', icon: <Globe className="text-red-400"/> },
          { label: 'Phishing Emails', value: '89', icon: <Mail className="text-yellow-400"/> },
          { label: 'Impersonated Companies', value: '34', icon: <Building className="text-blue-400"/> },
          { label: 'Suspicious Wallets', value: '56', icon: <Database className="text-cyan-400"/> },
        ].map(stat => (
          <div key={stat.label} className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400 font-medium">{stat.label}</p>
              <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
            </div>
            <div className="p-3 bg-slate-900/80 rounded-lg">{stat.icon}</div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-red-500"/> Recent Threat Intelligence</h2>
        <div className="space-y-4 text-sm">
          {/* Mock Vault Data to show SaaS capabilities */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-3 border-b border-slate-700/50 gap-2 md:gap-0">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full md:w-auto overflow-hidden">
              <span className="text-red-400 font-medium whitespace-nowrap">DOMAIN</span>
              <span className="text-slate-300 break-all">secure-login.chase-bank-update-alert.com</span>
            </div>
            <span className="text-slate-500 text-xs sm:text-sm whitespace-nowrap">Added 2 hours ago</span>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-3 border-b border-slate-700/50 gap-2 md:gap-0">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full md:w-auto overflow-hidden">
              <span className="text-yellow-400 font-medium whitespace-nowrap">EMAIL</span>
              <span className="text-slate-300 break-all">hr@microsoft-careers-portal.com</span>
            </div>
            <span className="text-slate-500 text-xs sm:text-sm whitespace-nowrap">Added 5 hours ago</span>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-3 border-b border-slate-700/50 gap-2 md:gap-0">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full md:w-auto overflow-hidden">
              <span className="text-cyan-400 font-medium whitespace-nowrap">WALLET</span>
              <span className="text-slate-300 break-all">1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa</span>
            </div>
            <span className="text-slate-500 text-xs sm:text-sm whitespace-nowrap">Added 1 day ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};
