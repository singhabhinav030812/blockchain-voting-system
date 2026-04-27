import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Database, Link as LinkIcon, CheckCircle, AlertOctagon } from 'lucide-react';
import { motion } from 'framer-motion';

const BlockchainExplorer = () => {
  const [chain, setChain] = useState([]);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    const fetchChain = async () => {
      try {
        const { data } = await api.get('/blockchain/chain');
        setChain(data.chain);
        setIsValid(data.isValid);
      } catch (err) {
        console.error(err);
      }
    };
    fetchChain();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center bg-slate-800/80 p-6 rounded-2xl border border-slate-700/50 shadow-lg">
        <div className="flex items-center gap-4">
          <Database className="w-10 h-10 text-blue-400" />
          <div>
            <h1 className="text-3xl font-bold">Blockchain Explorer</h1>
            <p className="text-slate-400">Live view of the immutable vote ledger</p>
          </div>
        </div>
        <div className={`mt-4 md:mt-0 px-6 py-3 rounded-xl flex items-center gap-2 font-bold shadow-inner ${isValid ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-500/30' : 'bg-red-900/40 text-red-400 border border-red-500/30'}`}>
          {isValid ? <><CheckCircle className="w-5 h-5"/> Chain is Valid</> : <><AlertOctagon className="w-5 h-5"/> Chain Compromised</>}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {chain.map((block, idx) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            key={block.hash}
            className="glass rounded-2xl p-6 relative border border-slate-700/50 bg-slate-800/40 hover:border-blue-500/50 transition-colors shadow-md"
          >
            {idx !== 0 && (
              <div className="absolute -left-6 top-1/2 -mt-3 hidden xl:block">
                <LinkIcon className="w-6 h-6 text-slate-600" />
              </div>
            )}
            <div className="flex justify-between items-start mb-4">
               <h3 className="text-xl font-bold text-blue-400">Block #{block.index}</h3>
               <span className="text-xs text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-700">{new Date(block.timestamp).toLocaleString()}</span>
            </div>
            
            <div className="space-y-3 mb-4">
               <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Previous Hash</p>
                  <p className="text-xs font-mono text-slate-400 bg-slate-900/80 p-2 rounded truncate border border-slate-700" title={block.previousHash}>{block.previousHash}</p>
               </div>
               <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Current Hash</p>
                  <p className="text-xs font-mono text-emerald-400 bg-slate-900/80 p-2 rounded truncate border border-slate-700" title={block.hash}>{block.hash}</p>
               </div>
            </div>

            <div className="bg-slate-900 rounded-xl p-4 border border-slate-700 shadow-inner">
               <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2">Block Data (Transaction)</p>
               {block.data.isGenesis ? (
                 <p className="text-sm italic text-slate-500 text-center py-2">Genesis Block (Start of Chain)</p>
               ) : (
                 <div className="space-y-2">
                    <p className="text-sm border-b border-slate-800 pb-2"><span className="text-slate-500">Voter: </span><span className="font-mono text-blue-300 ml-1">{block.data.voterId}</span></p>
                    <p className="text-sm pt-1"><span className="text-slate-500">Voted For: </span><span className="font-bold text-white ml-1">{block.data.candidateName}</span> <span className="text-xs text-slate-500 ml-1">({block.data.party})</span></p>
                 </div>
               )}
            </div>
            <div className="mt-4 flex justify-between items-center text-xs text-slate-500">
               <span className="bg-slate-800 px-2 py-1 rounded">Nonce: {block.nonce}</span>
               <span className="flex items-center gap-1 text-emerald-500/70"><CheckCircle className="w-3 h-3"/> Mined</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BlockchainExplorer;
