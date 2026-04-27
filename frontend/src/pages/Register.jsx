import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', studentId: '', password: '', role: 'Voter' });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/register', formData);
      login(data);
      navigate(data.role === 'Admin' ? '/admin' : '/voter');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-700/50 bg-slate-800/40"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="bg-emerald-600 p-3 rounded-full mb-4 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold">Voter Registration</h2>
        </div>
        
        {error && <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg mb-6 text-center">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
              <input 
                type="text" required
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-emerald-500 outline-none"
                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Student ID</label>
              <input 
                type="text" required
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-emerald-500 outline-none"
                value={formData.studentId} onChange={(e) => setFormData({...formData, studentId: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
            <input 
              type="email" required
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-emerald-500 outline-none"
              value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Password</label>
            <input 
              type="password" required
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-emerald-500 outline-none"
              value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <div className="pt-2">
             <label className="flex items-center gap-2 cursor-pointer">
               <input type="checkbox" className="w-4 h-4 bg-slate-900 border-slate-700 rounded text-emerald-500 focus:ring-emerald-500 cursor-pointer" 
                 onChange={(e) => setFormData({...formData, role: e.target.checked ? 'Admin' : 'Voter'})}
               />
               <span className="text-sm text-slate-400">Register as Admin (For Demo Purposes)</span>
             </label>
          </div>
          <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 mt-6 text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)]">
            Create Identity
          </button>
        </form>
        <div className="mt-6 text-center text-slate-400">
          Already registered? <Link to="/login" className="text-emerald-400 hover:text-emerald-300 ml-1">Login here</Link>
        </div>
      </motion.div>
    </div>
  );
};
export default Register;
