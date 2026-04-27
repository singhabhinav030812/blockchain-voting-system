import { Link } from 'react-router-dom';
import { Shield, Lock, Activity, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl space-y-6"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
          Decentralized Voting for the Next Generation
        </h1>
        <p className="text-xl text-slate-400 leading-relaxed">
          Secure, transparent, and tamper-proof elections powered by blockchain technology. Every vote is an immutable block in the chain.
        </p>
        <div className="pt-8 flex items-center justify-center gap-4">
          <Link to="/voter" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            Get Started
          </Link>
          <Link to="/explorer" className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-8 py-4 rounded-xl font-bold text-lg transition-all">
            View Blockchain
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        <FeatureCard 
          icon={<Lock className="w-10 h-10 text-blue-400" />}
          title="Tamper-Proof"
          description="Blockchain hashes ensure that no vote can ever be altered after it is cast."
        />
        <FeatureCard 
          icon={<Shield className="w-10 h-10 text-emerald-400" />}
          title="One Student, One Vote"
          description="Strict authentication ensures each student can cast exactly one registered vote."
        />
        <FeatureCard 
          icon={<Activity className="w-10 h-10 text-purple-400" />}
          title="Live Analytics"
          description="View the transparent, real-time results as blocks are added to the chain."
        />
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass p-8 rounded-2xl flex flex-col items-center text-center space-y-4 shadow-xl border border-slate-700/50 bg-slate-800/30"
  >
    <div className="p-4 bg-slate-900 rounded-full shadow-inner">{icon}</div>
    <h3 className="text-xl font-bold">{title}</h3>
    <p className="text-slate-400">{description}</p>
  </motion.div>
);

export default LandingPage;
