import React from 'react';
import type { FraudSignal } from '../types';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

export const FraudSignalsComparison: React.FC<{ signals: FraudSignal[] }> = ({ signals }) => {
  const legit = signals.filter(s => s.type === 'LEGITIMATE');
  const fraud = signals.filter(s => s.type === 'FRAUD');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Legitimate Column */}
      <div className="bg-slate-800/40 border border-green-500/30 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 text-green-400 font-semibold mb-4">
          <ShieldCheck className="w-5 h-5" />
          <h3>Legitimate Signals</h3>
        </div>
        {legit.length === 0 ? (
          <p className="text-slate-500 text-sm italic">No legitimate signals detected.</p>
        ) : (
          <ul className="space-y-3">
            {legit.map(s => (
              <li key={s.id} className="bg-green-500/10 border border-green-500/20 p-3 rounded-lg">
                <span className="text-green-300 font-medium text-sm flex items-center gap-2">
                  <span className="text-green-500">✓</span> {s.name}
                </span>
                <p className="text-xs text-slate-400 mt-1">{s.explanation}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Fraud Column */}
      <div className="bg-slate-800/40 border border-red-500/30 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 text-red-400 font-semibold mb-4">
          <ShieldAlert className="w-5 h-5" />
          <h3>Fraud Signals</h3>
        </div>
        {fraud.length === 0 ? (
          <p className="text-slate-500 text-sm italic">No fraud signals detected.</p>
        ) : (
          <ul className="space-y-3">
            {fraud.map(s => (
              <li key={s.id} className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                <span className="text-red-300 font-medium text-sm flex items-center gap-2">
                  <span className="text-red-500">✗</span> {s.name}
                </span>
                <p className="text-xs text-slate-400 mt-1">{s.explanation}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
