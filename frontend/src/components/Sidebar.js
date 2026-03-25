import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LogOut,
  ChevronRight,
  History,
  Trophy,
  User,
  LayoutDashboard,
  Code2,
  Settings
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const role = localStorage.getItem('role');

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Problems', icon: <Code2 size={20} />, path: '/questions' },
    { name: 'Submissions', icon: <History size={20} />, path: '/submissions' },
    { name: 'Leaderboard', icon: <Trophy size={20} />, path: '/leaderboard' },
    { name: 'Profile', icon: <User size={20} />, path: '/profile' },
  ];

  if (role === 'admin') {
    menuItems.push({ name: 'Admin', icon: <Settings size={20} />, path: '/admin' });
  }

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="w-72 h-screen bg-[#fdfbf7] border-r border-emerald-900/10 flex flex-col hidden md:flex sticky top-0 shadow-sm">
      <div className="p-8 flex items-center space-x-3 group cursor-pointer" onClick={() => navigate('/dashboard')}>
        <div className="w-10 h-10 bg-[#2d5a27] rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/20 group-hover:bg-[#1f3f1b] transition-all duration-300">
          <Code2 className="text-white" size={24} />
        </div>
        <div className="flex flex-col">
            <span className="text-xl font-bold text-[#1a2e1a] tracking-tighter leading-tight group-hover:text-[#2d5a27] transition-colors uppercase">DevPrep AI</span>
            <span className="text-[10px] font-bold text-[#4a7c44] uppercase tracking-widest italic">Core Ecosystem</span>
        </div>
      </div>

      <nav className="flex-1 px-6 py-4 space-y-1.5">
        <div className="text-[10px] font-bold text-[#a0ba9f] uppercase tracking-widest mb-4 ml-2 italic">Neural Pathways</div>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                isActive 
                  ? 'bg-emerald-50 text-[#2d5a27] border border-emerald-900/10 shadow-sm' 
                  : 'text-[#4a5d4a] hover:bg-emerald-50/40 hover:text-[#2d5a27]'
              }`}
            >
              {isActive && <motion.div layoutId="sidebar-active" className="absolute left-0 w-1 h-6 bg-[#2d5a27] rounded-full" />}
              <div className="flex items-center space-x-4">
                <div className={`${isActive ? 'text-[#2d5a27]' : 'text-[#a0ba9f] group-hover:text-[#2d5a27]'} transition-colors`}>
                    {item.icon}
                </div>
                <span className="font-bold text-sm tracking-tight">{item.name}</span>
              </div>
              {isActive && <ChevronRight size={16} className="text-[#2d5a27]/30" />}
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-emerald-900/5 bg-emerald-50/10">
        <div className="bg-white border border-emerald-900/10 p-4 rounded-2xl mb-4 group cursor-pointer hover:border-emerald-900/20 transition-all shadow-sm">
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-emerald-800 flex items-center justify-center border border-emerald-700/20 font-bold text-white text-xs italic">AI</div>
                <div>
                    <div className="text-[10px] font-bold text-[#a0ba9f] uppercase tracking-tighter">Growth Engine</div>
                    <div className="text-xs font-bold text-[#2d5a27] italic">Symbiotic Sync</div>
                </div>
            </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-[#4a5d4a] hover:text-rose-700 hover:bg-rose-50/50 rounded-2xl transition-all duration-300 font-bold text-sm mt-2"
        >
          <LogOut size={20} />
          <span>Detach</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
