import { useState, useEffect } from 'react';
import api from '../utils/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { Trophy, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'];

const ResultsPage = () => {
  const [positions, setPositions] = useState([]);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const [posRes, candRes] = await Promise.all([
          api.get('/voter/positions'),
          api.get('/voter/candidates')
        ]);
        setPositions(posRes.data);
        setCandidates(candRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchResults();
  }, []);

  const getCandidatesForPos = (posId) => {
    return candidates
      .filter(c => String(c.positionId) === String(posId))
      .sort((a, b) => b.voteCount - a.voteCount);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row items-center gap-4 bg-slate-800/80 p-8 rounded-3xl border border-slate-700/50 shadow-xl">
        <div className="bg-blue-600/20 p-4 rounded-full border border-blue-500/30">
           <BarChart2 className="w-12 h-12 text-blue-400" />
        </div>
        <div className="text-center md:text-left">
           <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Live College Election Results</h1>
           <p className="text-slate-400 mt-2 text-lg">Real-time transparent counting securely extracted from the blockchain.</p>
        </div>
      </div>

      <div className="space-y-16">
        {positions.map((pos) => {
          const posCandidates = getCandidatesForPos(pos._id);
          const totalVotes = posCandidates.reduce((acc, curr) => acc + curr.voteCount, 0);
          const winner = posCandidates.length > 0 && posCandidates[0].voteCount > 0 ? posCandidates[0] : null;

          return (
            <div key={pos._id} className="relative">
               <h2 className="text-3xl font-bold mb-6 border-l-4 border-emerald-500 pl-4">{pos.title} <span className="text-sm font-normal text-slate-400 ml-4 bg-slate-800 px-3 py-1 rounded-full shadow-inner border border-slate-700">{totalVotes} Total Votes</span></h2>
               
               <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                 {/* Winner Card */}
                 <div className="lg:col-span-1">
                    {winner ? (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/50 p-6 rounded-2xl text-center shadow-[0_0_30px_rgba(245,158,11,0.15)] relative overflow-hidden h-full flex flex-col justify-center">
                        <div className="absolute -top-10 -right-10 text-amber-500/10"><Trophy className="w-40 h-40"/></div>
                        <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-4 relative z-10" />
                        <h3 className="text-lg text-amber-200 font-bold mb-1 relative z-10">Current Leader</h3>
                        <p className="text-2xl font-extrabold text-white relative z-10 mb-2">{winner.name}</p>
                        <span className="inline-block bg-amber-900/50 text-amber-200 text-xs px-2 py-1 rounded-full relative z-10 border border-amber-500/30 shadow">{winner.party} | {winner.department}</span>
                        <div className="mt-6 bg-amber-900/80 py-3 rounded-xl border border-amber-400/50 font-bold text-amber-400 relative z-10 text-xl shadow-inner">
                          {winner.voteCount} Votes
                        </div>
                      </motion.div>
                    ) : (
                      <div className="glass border border-slate-700/50 p-6 rounded-2xl h-full flex flex-col items-center justify-center text-slate-500 text-center shadow">
                         <Trophy className="w-12 h-12 mb-3 opacity-20"/>
                         <p>No votes cast<br/>for this position yet.</p>
                      </div>
                    )}
                 </div>

                 {/* Chart */}
                 <div className="lg:col-span-3">
                    <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass p-6 rounded-2xl border border-slate-700/50 bg-slate-800/40 h-[350px] shadow-xl">
                      {posCandidates.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={posCandidates} margin={{ top: 20, right: 30, left: -20, bottom: 40 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="name" stroke="#94a3b8" tick={{fill: '#94a3b8', fontSize: 12}} angle={-15} textAnchor="end" />
                            <YAxis stroke="#94a3b8" tick={{fill: '#94a3b8'}} allowDecimals={false} />
                            <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
                            <Bar dataKey="voteCount" radius={[6, 6, 0, 0]} maxBarSize={60}>
                              {posCandidates.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                         <div className="h-full flex items-center justify-center text-slate-500">No candidates found for this position.</div>
                      )}
                    </motion.div>
                 </div>
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResultsPage;
