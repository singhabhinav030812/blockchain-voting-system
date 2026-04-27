import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Vote, CheckCircle, ChevronLeft, Briefcase, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VoterDashboard = () => {
  const { user } = useContext(AuthContext);
  const [positions, setPositions] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [votedPositions, setVotedPositions] = useState(user?.votedPositions || []);
  const [activePosition, setActivePosition] = useState(null); 
  const [isCasting, setIsCasting] = useState(false);
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" replace />;

  const fetchData = async () => {
    try {
      const [statusRes, posRes, candRes] = await Promise.all([
         api.get('/voter/status'),
         api.get('/voter/positions'),
         api.get('/voter/candidates')
      ]);
      setVotedPositions(statusRes.data.votedPositions || []);
      setPositions(posRes.data);
      setCandidates(candRes.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleVote = async (candidateId, candidateName) => {
    if(window.confirm(`⚠ CONFIRMATION\n\nAre you sure you want to securely cast your vote for ${candidateName}?\nThis action is permanent and will be immutably recorded on the blockchain.`)) {
      setIsCasting(true);
      try {
        await api.post('/voter/vote', { candidateId });
        alert('Vote cast successfully and secured on the blockchain!');
        fetchData();
        setActivePosition(null);
      } catch (err) {
        alert(err.response?.data?.message || 'Error casting vote');
      } finally {
        setIsCasting(false);
      }
    }
  };

  const getCandidatesForPos = (posId) => candidates.filter(c => String(c.positionId) === String(posId));

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center bg-blue-900/40 border border-blue-500/30 p-6 rounded-2xl shadow-lg">
        <div>
           <h1 className="text-3xl font-bold mb-2">Welcome, <span className="text-blue-400">{user.name}</span></h1>
           <p className="text-blue-200">Participate in the college elections. Cast exactly one encrypted vote per active category.</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!activePosition ? (
          <motion.div key="categories" initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:20}}>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">Election Categories <span className="text-sm font-normal bg-slate-800 px-3 py-1 rounded-full border border-slate-700">Select a category to view candidates</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {positions.map((pos) => {
                const hasVoted = votedPositions.includes(pos._id);
                const count = getCandidatesForPos(pos._id).length;
                return (
                  <div key={pos._id} onClick={() => !hasVoted && setActivePosition(pos._id)} className={`glass p-6 rounded-2xl border transition-all relative overflow-hidden group ${hasVoted ? 'border-emerald-500/50 bg-emerald-900/10 cursor-not-allowed' : 'border-slate-700/50 bg-slate-800/40 hover:border-blue-500/50 hover:bg-slate-800/80 shadow-lg cursor-pointer'}`}>
                     {hasVoted && <div className="absolute top-4 right-4 text-emerald-500 bg-emerald-950/20 rounded-full p-1"><CheckCircle className="w-8 h-8"/></div>}
                     <div className="flex items-center gap-4 mb-4">
                        <div className={`p-4 rounded-xl ${hasVoted ? 'bg-emerald-900/50 text-emerald-400' : 'bg-blue-900/50 text-blue-400'}`}><Briefcase className="w-8 h-8"/></div>
                        <div>
                           <h3 className="text-xl font-bold">{pos.title}</h3>
                           <p className={`mt-1 text-sm ${hasVoted ? 'text-emerald-500/70' : 'text-slate-400'}`}>{pos.description}</p>
                        </div>
                     </div>
                     <div className="flex justify-between items-center mt-6">
                        <span className={`text-sm font-bold bg-slate-900 px-3 py-1 rounded-full border ${hasVoted ? 'border-emerald-500/20 text-emerald-400/50' : 'border-slate-700'}`}>{count} Candidates</span>
                        {hasVoted ? <span className="font-bold text-emerald-400 text-sm flex items-center gap-1">VOTED</span> : <span className="text-blue-400 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">View & Vote →</span>}
                     </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div key="candidates" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}}>
            <button onClick={() => setActivePosition(null)} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl border border-slate-700 w-max shadow-md">
               <ChevronLeft className="w-5 h-5"/> Back to Categories
            </button>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 border-b border-slate-700 pb-4">
               {positions.find(p => p._id === activePosition)?.title} Election
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {getCandidatesForPos(activePosition).map((candidate, idx) => (
                 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} key={candidate._id} className="glass rounded-2xl overflow-hidden border border-slate-700/50 bg-slate-800/40 hover:border-blue-500/50 transition-colors flex flex-col shadow-xl">
                   <div className="relative bg-gradient-to-br from-slate-800/80 to-blue-900/20 p-8 flex items-center justify-center border-b border-slate-700/50 h-32">
                      <div className="text-6xl drop-shadow-lg">{candidate.symbol || '🎓'}</div>
                   </div>
                   <div className="p-6 flex-grow flex flex-col">
                     <h3 className="text-2xl font-bold mb-1">{candidate.name}</h3>
                     <span className="inline-block bg-blue-900/30 text-blue-300 text-sm px-3 py-1 rounded-full mb-4 w-max border border-blue-500/30 font-medium">{candidate.party}</span>
                     
                     <div className="grid grid-cols-2 gap-2 mb-4 bg-slate-900/50 p-3 rounded-lg border border-slate-800 text-sm shadow-inner">
                       <div><span className="text-slate-500 block text-[11px] uppercase tracking-wider mb-0.5">Dept</span> <span className="font-bold text-slate-200">{candidate.department}</span></div>
                       <div><span className="text-slate-500 block text-[11px] uppercase tracking-wider mb-0.5">Year</span> <span className="font-bold text-slate-200">{candidate.yearSemester}</span></div>
                     </div>

                     <div className="mb-6 flex-grow bg-slate-900/30 p-4 rounded-xl border border-slate-800/50">
                        <p className="text-sm text-emerald-400 font-bold mb-2 flex items-center gap-1"><Info className="w-4 h-4"/> Manifesto</p>
                        <p className="text-slate-300 italic text-sm">"{candidate.description}"</p>
                     </div>
                     <button onClick={() => handleVote(candidate._id, candidate.name)} disabled={isCasting} className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed py-3.5 rounded-xl font-bold text-white transition-all shadow-lg hover:shadow-blue-500/20 active:scale-[0.98]">
                       {isCasting ? 'Encrypting & Mining Block...' : <><Vote className="w-5 h-5"/> Endorse & Vote</>}
                     </button>
                   </div>
                 </motion.div>
              ))}
              {getCandidatesForPos(activePosition).length === 0 && (
                 <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-700 rounded-2xl bg-slate-800/20">
                     <p className="text-slate-400 text-lg">No candidates are registered for this position yet.</p>
                 </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default VoterDashboard;
