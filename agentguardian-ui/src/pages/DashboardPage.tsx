import React, { useState, useEffect } from 'react';
import { UploadArea } from '../UploadArea';
import { useNavigate } from 'react-router-dom';
import { getInvestigations } from '../api';
import type { Investigation } from '../types';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [investigations, setInvestigations] = useState<Investigation[]>([]);

  useEffect(() => {
    getInvestigations().then(setInvestigations).catch(console.error);
  }, []);

  const stats = [
    { name: 'Phishing', count: investigations.filter(i => i.type === 'PHISHING').length },
    { name: 'Deepfake', count: investigations.filter(i => i.type === 'DEEPFAKE').length },
    { name: 'Job Scam', count: investigations.filter(i => i.type === 'JOB_SCAM').length },
    { name: 'Invest Fraud', count: investigations.filter(i => i.type === 'INVESTMENT_FRAUD').length },
  ];

  return (
    <div className="space-y-12 w-full">
      <div className="flex flex-col items-center justify-center text-center space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Autonomous Digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Investigator</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Upload suspicious emails, documents, deepfakes, or website URLs. Our multi-agent system extracts evidence, verifies claims, and provides an explainable risk assessment.
          </p>
        </motion.div>
        <UploadArea onUploadSuccess={(inv) => navigate(`/investigation/${inv.id}`)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700 backdrop-blur-md">
          <h3 className="text-lg font-semibold text-slate-200 mb-6">Threat Categories Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats}>
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" allowDecimals={false} />
                <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155'}} />
                <Bar dataKey="count" fill="#22d3ee" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700 backdrop-blur-md">
          <h3 className="text-lg font-semibold text-slate-200 mb-6">Recent Investigations</h3>
          <div className="space-y-4">
            {investigations.slice(0, 5).map(inv => (
              <div key={inv.id} className="flex justify-between items-center p-3 rounded-lg bg-slate-900/50 border border-slate-700/50 hover:border-cyan-500/50 cursor-pointer transition-colors" onClick={() => navigate(`/investigation/${inv.id}`)}>
                <div>
                  <p className="text-slate-200 font-medium">{inv.title}</p>
                  <p className="text-xs text-slate-500">{new Date(inv.createdAt).toLocaleString()}</p>
                </div>
                <span className="text-xs bg-slate-800 text-cyan-400 px-2 py-1 rounded-md uppercase">{inv.type.replace('_', ' ')}</span>
              </div>
            ))}
            {investigations.length === 0 && <p className="text-slate-400">No investigations yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
