import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Target, 
  Zap, 
  TrendingUp, 
  BrainCircuit,
  ArrowRight,
  BookOpen
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalSolved: 0,
    accuracy: 0,
    streak: 0,
    recentSubmissions: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [subRes, dailyRes] = await Promise.all([
          axios.get('http://localhost:5000/api/submissions/my-submissions', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5000/api/questions/daily')
        ]);

        const submissions = subRes.data;
        const accepted = submissions.filter(s => s.status === 'Accepted');
        
        // Simple accuracy calculation
        const accuracy = submissions.length > 0 
          ? Math.round((accepted.length / submissions.length) * 100) 
          : 0;

        setStats({
          totalSolved: accepted.length,
          accuracy: accuracy,
          streak: 3, // Placeholder for now
          recentSubmissions: submissions.slice(0, 5),
          dailyQuestion: dailyRes.data
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#fdfbf7]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2d5a27]"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-8 max-w-7xl mx-auto space-y-8 bg-[#fdfbf7] min-h-screen font-sans"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-[#1a2e1a] mb-2 tracking-tighter italic uppercase">Ecosystem Pulse</h1>
          <p className="text-[#4a5d4a] font-medium italic">Cultivating logic and harvesting intelligence</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-900/10 px-6 py-3 rounded-2xl flex items-center space-x-3 shadow-sm">
          <TrendingUp size={18} className="text-[#2d5a27]" />
          <span className="text-sm font-bold text-[#2d5a27] italic uppercase tracking-tight">+12% growth index</span>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Harvested', value: stats.totalSolved, icon: <Trophy className="text-amber-600" />, color: 'amber' },
          { label: 'Precision', value: `${stats.accuracy}%`, icon: <Target className="text-[#2d5a27]" />, color: 'emerald' },
          { label: 'Vitality', value: `${stats.streak} days`, icon: <Zap className="text-orange-500" />, color: 'orange' },
          { label: 'Tier', value: 'Guardian', icon: <TrendingUp className="text-emerald-800" />, color: 'emerald' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            variants={itemVariants}
            className="bg-white border border-emerald-900/10 p-6 rounded-[2rem] hover:border-emerald-900/20 transition-all shadow-sm group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-2xl bg-emerald-50 group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
            </div>
            <div className="text-3xl font-black text-[#1a2e1a] mb-1 tracking-tighter italic">{stat.value}</div>
            <div className="text-[#a0ba9f] text-[10px] font-bold uppercase tracking-widest italic">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* DAILY CHALLENGE */}
      {stats.dailyQuestion && (
        <motion.div 
            variants={itemVariants}
            className="bg-white border border-emerald-900/10 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8 hover:border-[#2d5a27]/30 transition-all cursor-pointer group shadow-sm relative overflow-hidden"
            onClick={() => navigate(`/editor/${stats.dailyQuestion._id}`)}
        >
            <div className="flex items-center space-x-8 relative z-10">
                <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center border border-emerald-900/10 group-hover:bg-[#2d5a27] group-hover:text-white transition-all shadow-inner">
                    <Zap size={40} className="text-[#2d5a27] group-hover:text-white" />
                </div>
                <div>
                    <div className="flex items-center space-x-3 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#2d5a27] italic">Symbiotic Challenge</span>
                        <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${
                            stats.dailyQuestion.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-800' :
                            stats.dailyQuestion.difficulty === 'Medium' ? 'bg-amber-100 text-amber-800' :
                            'bg-rose-100 text-rose-800'
                        }`}>
                            {stats.dailyQuestion.difficulty}
                        </span>
                    </div>
                    <h2 className="text-2xl font-black text-[#1a2e1a] group-hover:text-[#2d5a27] transition-colors italic uppercase tracking-tight">{stats.dailyQuestion.title}</h2>
                    <p className="text-[#4a5d4a] text-sm mt-2 max-w-lg line-clamp-2 font-medium italic opacity-80">{stats.dailyQuestion.description}</p>
                </div>
            </div>
            <button className="bg-[#2d5a27] hover:bg-[#1f3f1b] text-white font-black py-4 px-10 rounded-2xl transition-all flex items-center space-x-3 group-hover:shadow-xl group-hover:shadow-emerald-900/20 uppercase text-xs tracking-widest italic">
                <span>Engage Logic</span>
                <ArrowRight size={20} />
            </button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* AI COACH SECTION */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-2 bg-[#f1f4f0] border border-emerald-900/10 p-10 rounded-[2.5rem] relative overflow-hidden shadow-sm"
        >
          <div className="absolute top-0 right-0 p-10 opacity-[0.03]">
            <BrainCircuit size={200} className="text-[#2d5a27]" />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-xl font-bold text-[#1a2e1a] mb-6 flex items-center space-x-3 italic uppercase tracking-tight">
              <BrainCircuit className="text-[#2d5a27]" />
              <span>Organic Intelligence Coach</span>
            </h2>
            <p className="text-[#1a2e1a] text-2xl font-black mb-8 max-w-2xl leading-tight italic tracking-tighter">
              "You've been mastering **Arrays**! To reach the next level, I recommend focusing on **Dynamic Programming**. It's the key to landing high-tier engineering roles."
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => navigate('/questions')}
                className="bg-[#2d5a27] hover:bg-[#1f3f1b] text-white font-black py-4 px-8 rounded-2xl transition-all shadow-lg shadow-emerald-900/20 flex items-center space-x-3 uppercase text-xs tracking-widest italic"
              >
                <span>Initiate Sequence</span>
                <ArrowRight size={20} />
              </button>
              <button 
                onClick={() => navigate('/profile')}
                className="bg-white hover:bg-emerald-50 text-[#2d5a27] font-black py-4 px-8 rounded-2xl transition-all border border-emerald-900/10 uppercase text-xs tracking-widest italic"
              >
                Neural Audit
              </button>
            </div>
          </div>
        </motion.div>

        {/* RECENT SUBMISSIONS */}
        <motion.div 
          variants={itemVariants}
          className="bg-white border border-emerald-900/10 p-8 rounded-[2.5rem] shadow-sm flex flex-col"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-extrabold text-[#1a2e1a] uppercase tracking-tighter italic text-lg">Activity Log</h2>
            <button 
                onClick={() => navigate('/submissions')}
                className="text-[10px] text-[#2d5a27] font-black hover:underline uppercase tracking-widest italic"
            >Audit All</button>
          </div>
          <div className="space-y-4 flex-1">
            {stats.recentSubmissions.length > 0 ? (
                stats.recentSubmissions.map((sub, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-[#fdfbf7] border border-emerald-900/5 hover:border-emerald-900/20 transition-all group cursor-pointer">
                        <div className="flex items-center space-x-4">
                            <div className={`w-3 h-3 rounded-full ${sub.status === 'Accepted' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]'}`}></div>
                            <span className="text-xs font-black text-[#1a2e1a] italic uppercase tracking-tighter">NODE_{sub._id.slice(-4)}</span>
                        </div>
                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${
                            sub.status === 'Accepted' ? 'text-emerald-700 bg-emerald-100' : 'text-rose-700 bg-rose-100'
                        }`}>
                            {sub.status === 'Accepted' ? 'Verified' : 'Fault'}
                        </span>
                    </div>
                ))
            ) : (
                <div className="flex-1 flex items-center justify-center text-[#a0ba9f] text-[10px] font-black italic uppercase tracking-widest text-center">
                    Zero parity found in neural logs
                </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* TOPICS SECTION */}
      <motion.div variants={itemVariants} className="space-y-6">
        <h2 className="text-xl font-bold text-[#1a2e1a] uppercase tracking-tighter italic">Focus Pathways</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {['Arrays', 'Complexity', 'Algorithms', 'Logic'].map((topic, i) => (
            <button 
                key={i}
                onClick={() => navigate('/questions')}
                className="flex items-center justify-between p-5 bg-white border border-emerald-900/10 rounded-[2rem] hover:bg-emerald-50/50 hover:border-[#2d5a27]/30 transition-all group text-left shadow-sm"
            >
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-emerald-50 rounded-2xl group-hover:bg-[#2d5a27] transition-colors shadow-inner">
                        <BookOpen size={20} className="text-[#2d5a27] group-hover:text-white" />
                    </div>
                    <span className="font-extrabold text-[#1a2e1a] group-hover:text-[#2d5a27] uppercase tracking-tight italic text-sm">{topic}</span>
                </div>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;