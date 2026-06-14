import React, { useEffect, useState } from 'react';
import { getInvestigationReport } from './api';
import type { InvestigationReport } from './types';
import { Shield, AlertTriangle, FileText, CheckCircle, Crosshair, ArrowLeft, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardProps {
  investigationId: string;
  onBack: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ investigationId, onBack }) => {
  const [report, setReport] = useState<InvestigationReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    // Polling simulation since agents might take time
    const fetchReport = async () => {
      try {
        const data = await getInvestigationReport(investigationId);
        if (mounted) {
          setReport(data);
          if (data.investigation.status === 'COMPLETED' || data.investigation.status === 'FAILED') {
            setLoading(false);
          } else {
            // Poll again if still analyzing
            setTimeout(fetchReport, 2000);
          }
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    
    fetchReport();
    
    return () => { mounted = false; };
  }, [investigationId]);

  if (loading && !report) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
        <h2 className="text-xl text-slate-300">Agents are gathering evidence...</h2>
      </div>
    );
  }

  if (!report) {
    return <div className="text-red-400 text-center">Failed to load investigation report.</div>;
  }

  const { investigation, evidence, riskScore, recommendations } = report;

  const getRiskColor = (level: string) => {
    switch(level) {
      case 'SAFE': return 'text-emerald-400';
      case 'LOW_RISK': return 'text-green-400';
      case 'MEDIUM_RISK': return 'text-yellow-400';
      case 'HIGH_RISK': return 'text-orange-400';
      case 'CRITICAL_THREAT': return 'text-red-500';
      default: return 'text-slate-400';
    }
  };

  const getRiskBgColor = (level: string) => {
    switch(level) {
      case 'SAFE': return 'bg-emerald-400/10 border-emerald-500/30';
      case 'LOW_RISK': return 'bg-green-400/10 border-green-500/30';
      case 'MEDIUM_RISK': return 'bg-yellow-400/10 border-yellow-500/30';
      case 'HIGH_RISK': return 'bg-orange-400/10 border-orange-500/30';
      case 'CRITICAL_THREAT': return 'bg-red-500/10 border-red-500/50';
      default: return 'bg-slate-800 border-slate-700';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto space-y-6"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Upload
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Summary & Score */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-800/50 backdrop-blur-md border border-slate-700">
            <h2 className="text-lg text-slate-400 mb-1">Investigation Report</h2>
            <h1 className="text-2xl font-bold text-slate-100 mb-4">{investigation.title}</h1>
            
            <div className="inline-block px-3 py-1 rounded-md bg-slate-700 text-sm font-medium mb-6">
              Type: {investigation.type.replace('_', ' ')}
            </div>

            {riskScore && (
              <div className={`p-6 rounded-xl border ${getRiskBgColor(riskScore.level)} text-center`}>
                <p className="text-sm font-medium uppercase tracking-wider text-slate-400 mb-2">Risk Score</p>
                <div className={`text-6xl font-bold mb-2 ${getRiskColor(riskScore.level)}`}>
                  {riskScore.score}
                </div>
                <p className={`font-semibold ${getRiskColor(riskScore.level)}`}>
                  {riskScore.level.replace('_', ' ')}
                </p>
              </div>
            )}
            
            {riskScore && (
              <div className="mt-4 text-sm text-slate-300 leading-relaxed">
                <p className="font-semibold text-slate-200 mb-1">AI Reasoning:</p>
                {riskScore.reasoning}
              </div>
            )}
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/50 backdrop-blur-md border border-slate-700">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-cyan-400" /> Recommendations
            </h3>
            <ul className="space-y-4">
              {recommendations?.map(rec => (
                <li key={rec.id} className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/50">
                  <div className="font-semibold text-slate-200 mb-1 flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                    {rec.action}
                  </div>
                  <div className="text-sm text-slate-400 ml-6">{rec.reasoning}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Evidence Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-800/50 backdrop-blur-md border border-slate-700 h-full">
            <h3 className="text-xl font-semibold flex items-center gap-2 mb-6">
              <Crosshair className="w-6 h-6 text-cyan-400" /> Evidence Timeline & Extraction
            </h3>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-600 before:to-transparent">
              
              {evidence?.map((item, index) => (
                <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-900 bg-slate-700 text-slate-300 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                    <FileText className="w-4 h-4" />
                  </div>
                  
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-700 bg-slate-900/50 hover:bg-slate-800 transition-colors shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded">
                        {item.evidenceType}
                      </span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        item.verificationStatus === 'VERIFIED' ? 'bg-emerald-400/10 text-emerald-400' :
                        item.verificationStatus === 'SUSPICIOUS' ? 'bg-red-400/10 text-red-400' :
                        'bg-slate-400/10 text-slate-400'
                      }`}>
                        {item.verificationStatus}
                      </span>
                    </div>
                    <div className="font-mono text-sm text-slate-200 mb-2 truncate" title={item.value}>
                      {item.value}
                    </div>
                    <div className="text-sm text-slate-400 leading-snug">
                      {item.details}
                    </div>
                  </div>
                </div>
              ))}

              {investigation.status === 'ANALYZING' && (
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active opacity-50">
                   <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-900 bg-cyan-900 text-cyan-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow animate-pulse">
                    <Loader className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-700 bg-slate-900/50">
                    <p className="text-sm text-slate-400">Foundry IQ Reasoning Agent is cross-referencing knowledge...</p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
