import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', { studentId, password });
      login(data);
      navigate(data.role === 'Admin' ? '/admin' : '/voter');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700/50 bg-slate-800/40"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 p-3 rounded-full mb-4 shadow-[0_0_15px_rgba(37,99,235,0.5)]">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold">Secure Login</h2>
        </div>
        
        {error && <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg mb-6 text-center">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Student ID (or Admin ID)</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            Enter Dashboard
          </button>
        </form>
        <div className="mt-6 text-center text-slate-400">
          Not registered? <Link to="/register" className="text-blue-400 hover:text-blue-300 ml-1">Register here</Link>
        </div>
      </motion.div>
    </div>
  );
};
export default Login;
