import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import api from '../utils/api';
import { PlusCircle, Trash2, Users, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [candidates, setCandidates] = useState([]);
  const [positions, setPositions] = useState([]);
  const [newCandidate, setNewCandidate] = useState({ name: '', party: '', description: '', photoUrl: '', department: '', yearSemester: '', positionId: '' });
  const [newPosition, setNewPosition] = useState({ title: '', description: '' });
  const [activeTab, setActiveTab] = useState('candidates'); 
  
  if (!user || user.role !== 'Admin') {
    return <Navigate to="/login" replace />;
  }

  const fetchData = async () => {
    try {
      const [candRes, posRes] = await Promise.all([
        api.get('/admin/candidates'),
        api.get('/admin/positions')
      ]);
      setCandidates(candRes.data);
      setPositions(posRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/candidates', newCandidate);
      setNewCandidate({ name: '', party: '', description: '', photoUrl: '', department: '', yearSemester: '', positionId: '' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddPosition = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/positions', newPosition);
      setNewPosition({ title: '', description: '' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCandidate = async (id) => {
    if(window.confirm('Delete this candidate?')) {
      await api.delete(`/admin/candidates/${id}`);
      fetchData();
    }
  };

  const handleDeletePosition = async (id) => {
    if(window.confirm('Delete this position? It may break existing candidate views.')) {
      await api.delete(`/admin/positions/${id}`);
      fetchData();
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-blue-400" />
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
        <div className="flex gap-2 p-1 bg-slate-800/80 rounded-xl overflow-hidden shadow-inner border border-slate-700/50">
           <button onClick={() => setActiveTab('candidates')} className={`px-5 py-2 font-bold rounded-lg transition-all ${activeTab === 'candidates' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>Manage Candidates</button>
           <button onClick={() => setActiveTab('positions')} className={`px-5 py-2 font-bold rounded-lg transition-all ${activeTab === 'positions' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>Manage Positions</button>
        </div>
      </div>

      {activeTab === 'candidates' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-1">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass p-6 rounded-2xl border border-slate-700/50 bg-slate-800/40">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><PlusCircle className="w-5 h-5 text-emerald-400"/> Add Candidate</h2>
              <form onSubmit={handleAddCandidate} className="space-y-4">
                <input type="text" placeholder="Candidate Name" required className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 outline-none focus:border-emerald-500" 
                    value={newCandidate.name} onChange={(e) => setNewCandidate({...newCandidate, name: e.target.value})} />
                
                <select required className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 outline-none focus:border-emerald-500 text-slate-300"
                    value={newCandidate.positionId} onChange={(e) => setNewCandidate({...newCandidate, positionId: e.target.value})}>
                  <option value="" disabled>Select Position / Category</option>
                  {positions.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                </select>

                <div className="flex gap-2">
                   <input type="text" placeholder="Department" required className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 outline-none focus:border-emerald-500" 
                     value={newCandidate.department} onChange={(e) => setNewCandidate({...newCandidate, department: e.target.value})} />
                   <input type="text" placeholder="Year/Sem" required className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 outline-none focus:border-emerald-500" 
                     value={newCandidate.yearSemester} onChange={(e) => setNewCandidate({...newCandidate, yearSemester: e.target.value})} />
                </div>

                <input type="text" placeholder="Party / Group Name" required className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 outline-none focus:border-emerald-500" 
                    value={newCandidate.party} onChange={(e) => setNewCandidate({...newCandidate, party: e.target.value})} />
                <textarea placeholder="Candidate Manifesto" rows="3" required className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 outline-none focus:border-emerald-500"
                    value={newCandidate.description} onChange={(e) => setNewCandidate({...newCandidate, description: e.target.value})}></textarea>
                <input type="text" placeholder="Candidate Symbol/Icon (e.g. 💻)" className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 outline-none focus:border-emerald-500" 
                    value={newCandidate.symbol || ''} onChange={(e) => setNewCandidate({...newCandidate, symbol: e.target.value})} />
                
                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 py-3 rounded-xl font-bold text-white transition-all shadow-md mt-4">Add Candidate</button>
              </form>
            </motion.div>
          </div>

          <div className="xl:col-span-2">
             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass p-6 rounded-2xl border border-slate-700/50 bg-slate-800/40 min-h-[400px]">
              <h2 className="text-xl font-bold mb-6">Manage Candidates ({candidates.length})</h2>
              <div className="grid gap-4">
                {candidates.length === 0 && <p className="text-slate-400 italic">No candidates added yet.</p>}
                {candidates.map(candidate => {
                  const pos = positions.find(p => String(p._id) === String(candidate.positionId));
                  return (
                  <div key={candidate._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-700/50 gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-slate-800/80 border border-slate-600 flex items-center justify-center text-2xl shadow-inner shrink-0">
                        {candidate.symbol || '🎓'}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{candidate.name} <span className="text-xs text-blue-400 font-normal bg-slate-800 px-2 rounded-full ml-1 border border-slate-700">{candidate.department} | {candidate.yearSemester}</span></h3>
                        <p className="text-xs font-bold text-emerald-400 bg-emerald-900/40 w-max px-2 py-0.5 rounded mt-1 border border-emerald-500/20">{pos ? pos.title : 'Unknown Position'}</p>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteCandidate(candidate._id)} className="text-red-400 hover:text-red-300 p-2 bg-red-400/10 hover:bg-red-400/20 rounded-lg transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                )})}
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {activeTab === 'positions' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-1">
             <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass p-6 rounded-2xl border border-slate-700/50 bg-slate-800/40">
               <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Briefcase className="w-5 h-5 text-blue-400"/> New Category</h2>
               <form onSubmit={handleAddPosition} className="space-y-4">
                 <input type="text" placeholder="Position Title (e.g. CR)" required className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 outline-none focus:border-blue-500" 
                    value={newPosition.title} onChange={(e) => setNewPosition({...newPosition, title: e.target.value})} />
                 <textarea placeholder="Description" rows="3" required className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 outline-none focus:border-blue-500"
                    value={newPosition.description} onChange={(e) => setNewPosition({...newPosition, description: e.target.value})}></textarea>
                 <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold text-white transition-all shadow-md">Create Position</button>
               </form>
             </motion.div>
           </div>
           <div className="lg:col-span-2">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass p-6 rounded-2xl border border-slate-700/50 bg-slate-800/40 min-h-[400px]">
                <h2 className="text-xl font-bold mb-6">Active Election Categories ({positions.length})</h2>
                <div className="grid gap-4">
                  {positions.map(pos => (
                    <div key={pos._id} className="flex justify-between items-center p-4 bg-slate-900 rounded-xl border border-slate-700/50">
                      <div>
                        <h3 className="font-bold text-lg text-blue-300">{pos.title}</h3>
                        <p className="text-sm text-slate-400 mt-1">{pos.description}</p>
                      </div>
                      <button onClick={() => handleDeletePosition(pos._id)} className="text-red-400 hover:text-red-300 p-2 bg-red-400/10 hover:bg-red-400/20 rounded-lg transition-colors"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  ))}
                </div>
              </motion.div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
