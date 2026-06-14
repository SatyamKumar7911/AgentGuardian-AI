import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getInvestigationReport, API_URL } from '../api';
import type { InvestigationReport } from '../types';
import { FraudNetworkGraph } from '../components/FraudNetworkGraph';
import { FraudSignalsComparison } from '../components/FraudSignalsComparison';
import { Shield, Activity, FileText, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const InvestigationDetailPage: React.FC = () => {
  const { id } = useParams();
  const [report, setReport] = useState<InvestigationReport | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Initial fetch
    const fetchReport = async () => {
      try {
        const data = await getInvestigationReport(id!);
        setReport(data);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchReport();

    // SSE connection for real-time timeline
    const sse = new EventSource(`${API_URL}/sse/timeline/${id}`);

    sse.addEventListener('TIMELINE_UPDATE', (event) => {
      const newStep = JSON.parse(event.data);
      setReport(prev => {
        if (!prev) return prev;

        // Prevent duplicate steps
        const stepExists = prev.timeline.some(s => s.id === newStep.id);
        const updatedTimeline = stepExists ? prev.timeline : [...prev.timeline, newStep].sort((a, b) => a.stepOrder - b.stepOrder);

        // Refetch full report if completed
        if (newStep.stepOrder === 6) {
          fetchReport();
        }

        return { ...prev, timeline: updatedTimeline };
      });
    });

    return () => sse.close();
  }, [id]);

  if (error) return <div className="text-red-400">Error: {error}</div>;
  if (!report) return <div className="text-slate-400 animate-pulse">Loading report...</div>;

  const { investigation, riskScore, evidence, recommendations, timeline, signals } = report;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header Info */}
      <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">{investigation.title}</h1>
          <div className="flex items-center gap-3">
            <span className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-md text-sm uppercase font-semibold">
              {investigation.type.replace('_', ' ')}
            </span>
            <span className="text-slate-400 text-sm">{new Date(investigation.createdAt).toLocaleString()}</span>
          </div>
        </div>

        {riskScore && (
          <div className="flex items-center gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-700 shadow-xl">
            <Activity className={riskScore.score > 70 ? 'text-red-500' : 'text-yellow-500'} />
            <div>
              <p className="text-xs text-slate-400 font-medium">FOUNDRY IQ RISK SCORE</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">{riskScore.score}</span>
                <span className={`text-sm font-bold ${riskScore.score > 70 ? 'text-red-500' : 'text-yellow-500'}`}>
                  {riskScore.level.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Real-time Timeline */}
      <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl">
        <h2 className="text-xl font-bold text-white mb-6">Investigation Timeline</h2>
        <div className="space-y-4">
          {timeline?.map((step, idx) => (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} key={step.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/50">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                </div>
                {idx !== timeline.length - 1 && <div className="w-px h-full bg-slate-700 my-1" />}
              </div>
              <div className="pb-6">
                <h4 className="text-white font-medium">{step.title}</h4>
                <p className="text-sm text-slate-400">{step.description}</p>
              </div>
            </motion.div>
          ))}
          {investigation.status === 'ANALYZING' && (
            <div className="flex gap-4 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600">
                <Activity className="w-4 h-4 text-slate-400" />
              </div>
              <div>
                <h4 className="text-slate-300 font-medium">Processing next step...</h4>
              </div>
            </div>
          )}
        </div>
      </div>

      {investigation.status === 'COMPLETED' && (
        <>
          {/* Signals Comparison */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Fraud vs Legitimate Signals</h2>
            <FraudSignalsComparison signals={signals || []} />
          </div>

          {/* Network Graph */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Entity Network Graph</h2>
            <FraudNetworkGraph evidence={evidence || []} />
          </div>

          {/* AI Reasoning & Recommendations */}
          {riskScore && (
            <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6" /> Threat Intelligence Reasoning
              </h2>
              <p className="text-slate-300 mb-6 leading-relaxed">{riskScore.reasoning}</p>

              <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">Actionable Recommendations</h3>
              <ul className="space-y-3">
                {recommendations?.map(r => (
                  <li key={r.id} className="bg-slate-900/50 border border-red-500/20 p-4 rounded-xl">
                    <p className="text-red-300 font-medium">{r.action}</p>
                    <p className="text-sm text-slate-400 mt-1">{r.reasoning}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

    </div>
  );
};
