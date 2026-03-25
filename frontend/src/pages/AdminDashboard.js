import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Settings, 
  Database, 
  Users, 
  ArrowRight,
  ShieldCheck,
  LayoutGrid
} from "lucide-react";
import { motion } from "framer-motion";

function AdminDashboard() {
  const navigate = useNavigate();

  const adminActions = [
    {
      title: "Add Question",
      desc: "Architect new algorithmic challenges for the community.",
      icon: <Plus size={24} className="text-leaf" />,
      path: "/admin/add",
      color: "leaf"
    },
    {
      title: "Manage Bank",
      desc: "Refusal, update, or deprecate existing core problems.",
      icon: <Database size={24} className="text-leaf-light" />,
      path: "/questions",
      color: "sage"
    },
    {
      title: "User Management",
      desc: "Audit user roles and manage platform access control.",
      icon: <Users size={24} className="text-forest" />,
      path: "/admin/users",
      color: "forest"
    }
  ];

  return (
    <div className="min-h-screen bg-cream text-forest p-8 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-leaf rounded-2xl flex items-center justify-center shadow-lg shadow-leaf/20">
                <ShieldCheck className="text-white" size={28} />
            </div>
            <div>
                <h1 className="text-4xl font-black text-forest tracking-tighter italic uppercase">Admin Command Center</h1>
                <p className="text-sage text-[10px] font-bold uppercase tracking-widest italic font-mono">Quantum Intelligence Governance [v1.0.4]</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {adminActions.map((action, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white border border-leaf/10 rounded-3xl p-8 cursor-pointer hover:border-leaf/30 hover:bg-cream/50 transition-all group relative overflow-hidden flex flex-col justify-between h-full shadow-xl"
              onClick={() => navigate(action.path)}
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-leaf/5 rounded-full group-hover:bg-leaf/10 transition-colors"></div>
              
              <div>
                <div className="mb-6 bg-cream w-14 h-14 rounded-2xl border border-leaf/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                    {action.icon}
                </div>
                <h2 className="text-2xl font-bold text-forest mb-3 tracking-tight group-hover:text-leaf transition-colors uppercase italic">{action.title}</h2>
                <p className="text-sage text-[10px] uppercase font-bold italic tracking-widest leading-relaxed">{action.desc}</p>
              </div>

              <div className="mt-8 pt-6 border-t border-leaf/10 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-sage group-hover:text-leaf transition-colors italic">
                 <span>Explore Interface</span>
                 <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* System Snapshot */}
        <div className="mt-16 bg-white border border-leaf/10 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-lg">
            <div className="flex items-center gap-6">
                <div className="p-4 bg-cream rounded-2xl border border-leaf/10">
                    <LayoutGrid className="text-leaf/40" size={32} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-forest tracking-tight uppercase italic">Platform Integrity Module</h3>
                    <p className="text-[10px] text-sage font-bold uppercase tracking-widest italic">All administrative actions are logged for security auditing purposes.</p>
                </div>
            </div>
            <button className="bg-cream hover:bg-leaf/5 text-leaf font-bold py-3 px-8 rounded-2xl text-[10px] uppercase tracking-widest transition-all border border-leaf/10 flex items-center gap-2 italic">
                <Settings size={14} />
                Governance Settings
            </button>
        </div>
      </motion.div>
    </div>
  );
}

export default AdminDashboard;