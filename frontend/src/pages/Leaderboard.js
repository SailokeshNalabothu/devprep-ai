import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  User, 
  Crown, 
  Medal,
  TrendingUp,
  Loader2
} from "lucide-react";

function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/leaderboard");
        // Sort by solved problems desc
        const sorted = (res.data || []).sort((a,b) => b.solved - a.solved);
        setUsers(sorted);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-cream">
        <Loader2 className="animate-spin text-leaf" size={48} />
      </div>
    );
  }

  const getRankIcon = (index) => {
    if (index === 0) return <Crown className="text-amber-500" size={24} />;
    if (index === 1) return <Medal className="text-slate-400" size={22} />;
    if (index === 2) return <Medal className="text-amber-800" size={20} />;
    return <span className="text-sage font-bold">{index + 1}</span>;
  };

  return (    <div className="p-8 max-w-5xl mx-auto space-y-8 bg-cream min-h-screen text-forest font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-forest mb-2 flex items-center gap-3 italic uppercase tracking-tighter">
            <Trophy className="text-leaf" size={36} />
            Ecosystem Rankings
          </h1>
          <p className="text-sage font-medium italic">Competing with the world's best AI-assisted developers.</p>
        </div>
        <div className="bg-white border border-leaf/10 px-4 py-2 rounded-2xl flex items-center gap-3 shadow-sm">
            <TrendingUp size={18} className="text-leaf" />
            <span className="text-sm font-bold text-forest uppercase tracking-tight italic">Live Synchronizing</span>
        </div>
      </div>

      {/* Top 3 Podium (Visualized) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 pt-8">
        {users.slice(0, 3).map((user, i) => (
            <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative flex flex-col items-center p-10 rounded-[3rem] border shadow-xl transition-transform hover:scale-[1.02] ${
                    i === 0 ? 'bg-white border-leaf/20 ring-4 ring-leaf/5 order-1 md:order-2 scale-110 z-10' :
                    i === 1 ? 'bg-white/80 border-leaf/10 order-2 md:order-1 mt-4' :
                    'bg-white/80 border-leaf/10 order-3 mt-8'
                }`}
            >
                <div className="mb-6 relative">
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 ${
                        i === 0 ? 'border-leaf shadow-lg shadow-leaf/20' : 
                        i === 1 ? 'border-slate-300' : 'border-amber-700/50'
                    } bg-cream`}>
                        <User size={40} className="text-leaf/40" />
                    </div>
                    <div className="absolute -top-3 -right-3 bg-white p-2 rounded-full border border-leaf/10 shadow-lg">
                        {getRankIcon(i)}
                    </div>
                </div>
                <h3 className="text-2xl font-black text-forest mb-2 italic tracking-tighter uppercase">{user.user}</h3>
                <div className="px-6 py-1.5 bg-leaf/5 rounded-full text-leaf text-xs font-black uppercase tracking-widest italic">{user.solved} Resolved</div>
            </motion.div>
        ))}
      </div>

      {/* Full Leaderboard List */}
      <div className="bg-white border border-leaf/10 rounded-[2.5rem] overflow-hidden shadow-xl">
        <div className="grid grid-cols-12 px-10 py-6 bg-cream/50 text-[10px] font-black text-sage uppercase tracking-[0.2em] italic border-b border-leaf/5">
            <div className="col-span-2">Rank</div>
            <div className="col-span-6">Developer Identity</div>
            <div className="col-span-4 text-right">Resolved Nodes</div>
        </div>
        
        <div className="divide-y divide-leaf/5">
            <AnimatePresence>
                {users.map((user, index) => (
                    <motion.div 
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 + (index * 0.05) }}
                        className="grid grid-cols-12 px-10 py-6 items-center hover:bg-cream/30 transition-colors group cursor-default"
                    >
                        <div className="col-span-2 flex items-center">
                            <span className={`text-sm font-black italic ${index < 3 ? 'text-leaf' : 'text-sage opacity-50'}`}>
                                #{index + 1}
                            </span>
                        </div>
                        <div className="col-span-6 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-cream border border-leaf/5 flex items-center justify-center group-hover:border-leaf/20 transition-colors shadow-inner">
                                <User size={18} className="text-leaf/30" />
                            </div>
                            <span className="text-base font-black text-forest tracking-tight uppercase italic group-hover:text-leaf transition-colors">{user.user}</span>
                        </div>
                        <div className="col-span-4 text-right">
                            <span className="text-lg font-black text-forest italic tracking-tighter group-hover:scale-110 inline-block transition-transform">{user.solved}</span>
                            <span className="ml-2 text-[10px] font-black text-sage uppercase tracking-tighter italic opacity-50">Units</span>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;