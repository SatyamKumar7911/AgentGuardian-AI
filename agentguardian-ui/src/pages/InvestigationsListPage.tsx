import React, { useEffect, useState } from 'react';
import { getInvestigations } from '../api';
import type { Investigation } from '../types';
import { Link } from 'react-router-dom';
import { Search, Filter, ArrowRight } from 'lucide-react';

export const InvestigationsListPage: React.FC = () => {
  const [investigations, setInvestigations] = useState<Investigation[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getInvestigations().then(setInvestigations);
  }, []);

  const filtered = investigations.filter(i => i.title.toLowerCase().includes(search.toLowerCase()) || i.type.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Investigations</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by title or type..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-cyan-500"
          />
        </div>
        <button className="bg-slate-800/50 border border-slate-700 px-4 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors">
          <Filter className="w-5 h-5 text-slate-400" /> Filters
        </button>
      </div>

      <div className="grid gap-4">
        {filtered.map(inv => (
          <Link to={`/investigation/${inv.id}`} key={inv.id} className="bg-slate-800/40 border border-slate-700/50 p-4 md:p-5 rounded-xl hover:border-cyan-500/50 transition-all flex flex-col md:flex-row items-start md:items-center justify-between group gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-200">{inv.title}</h3>
              <p className="text-sm text-slate-500 mt-1">Uploaded {new Date(inv.createdAt).toLocaleString()}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 md:gap-6 w-full md:w-auto">
              <span className="text-xs font-bold px-3 py-1 bg-slate-900/80 border border-slate-700 text-cyan-400 rounded-md uppercase tracking-wider">
                {inv.type.replace('_', ' ')}
              </span>
              <span className={`text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider ${inv.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'}`}>
                {inv.status}
              </span>
              <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-cyan-400 transition-colors ml-auto md:ml-0" />
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-500 border border-slate-800 rounded-xl bg-slate-900/30">
            No investigations found.
          </div>
        )}
      </div>
    </div>
  );
};
