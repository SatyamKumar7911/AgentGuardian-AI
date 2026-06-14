import React from 'react';
import { Save, Key, Cpu, ShieldCheck } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Platform Settings</h1>
        <p className="text-slate-400">Configure your AI agent integrations and security policies.</p>
      </div>

      <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-700/50 bg-slate-900/30 flex items-center gap-3">
          <Cpu className="text-cyan-400 w-6 h-6" />
          <h2 className="text-lg font-semibold text-white">Foundry IQ Configuration</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Azure OpenAI Endpoint</label>
            <input type="text" defaultValue="https://foundry-iq-agent.openai.azure.com/" className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-300 focus:outline-none focus:border-cyan-500" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">API Key</label>
            <div className="relative">
              <Key className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input type="password" defaultValue="************************" className="w-full bg-slate-900/80 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-300 focus:outline-none focus:border-cyan-500" />
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
            <ShieldCheck className="w-5 h-5" />
            <span>Connection to Foundry IQ verified. Agents are online.</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors">
          <Save className="w-4 h-4" /> Save Configuration
        </button>
      </div>
    </div>
  );
};
