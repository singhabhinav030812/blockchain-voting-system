import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Shield, LogOut, User, BarChart2, Link as LinkIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass sticky top-0 z-50 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-blue-400">
          <Shield className="w-8 h-8" />
          <span>SecureVote</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/results" className="hover:text-blue-400 transition-colors flex items-center gap-1 font-medium">
             <BarChart2 className="w-4 h-4" /> Results
          </Link>
          <Link to="/explorer" className="hover:text-blue-400 transition-colors flex items-center gap-1 font-medium">
             <LinkIcon className="w-4 h-4" /> Explorer
          </Link>
          {user ? (
             <div className="flex items-center gap-4 border-l border-slate-700 pl-4">
               <Link to={user.role === 'Admin' ? '/admin' : '/voter'} className="hover:text-blue-400 transition-colors flex items-center gap-1">
                  <User className="w-4 h-4" /> <span className="font-medium">{user.name}</span> <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full ml-1">{user.role}</span>
               </Link>
               <button onClick={handleLogout} className="flex items-center gap-1 text-red-500 hover:text-red-400 transition-colors">
                 <LogOut className="w-4 h-4" /> 
               </button>
             </div>
          ) : (
            <div className="flex items-center gap-4 border-l border-slate-700 pl-4">
               <Link to="/login" className="hover:text-blue-400 transition-colors font-medium">Login</Link>
               <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-all shadow-md shadow-blue-500/20 shadow-lg">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
