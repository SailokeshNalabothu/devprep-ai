import { useEffect, useState } from "react";
import axios from "axios";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ChevronRight, 
  Code2, 
  Calendar,
  Search,
  Target
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Submissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/submissions/my-submissions",
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        );
        setSubmissions(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  const stats = {
    total: submissions.length,
    accepted: submissions.filter(s => s.status === "Accepted").length,
    languages: [...new Set(submissions.map(s => s.language))].length
  };

  const accuracy = stats.total > 0 ? Math.round((stats.accepted / stats.total) * 100) : 0;

  const filteredSubmissions = submissions.filter(s => 
    s.questionId?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.language.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-leaf"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream text-forest p-8 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-forest tracking-tight mb-2 italic uppercase">Submissions / Audit</h1>
            <p className="text-sage font-medium italic text-sm">Reviewing developer neural pathways and logic patterns</p>
          </div>
          
          <div className="flex items-center space-x-4">
             <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-leaf/40 group-focus-within:text-leaf transition-colors" size={18} />
                <input 
                    type="text"
                    placeholder="Search logs..."
                    className="bg-white border border-leaf/10 text-forest pl-12 pr-6 py-3 rounded-2xl outline-none focus:border-leaf/30 w-full md:w-80 transition-all font-medium text-sm italic shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Total Sessions", value: stats.total, icon: <Clock className="text-leaf" size={20} />, sub: "All time records" },
            { label: "Success Ratio", value: `${accuracy}%`, icon: <CheckCircle2 className="text-emerald-500" size={20} />, sub: "Accuracy Index" },
            { label: "Accepted Nodes", value: stats.accepted, icon: <Target className="text-amber-500" size={20} />, sub: "Resolved logic" },
            { label: "Language Diversity", value: stats.languages, icon: <Code2 className="text-leaf" size={20} />, sub: "Syntactic range" }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white border border-leaf/10 p-6 rounded-[2rem] shadow-sm relative overflow-hidden group"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-cream rounded-2xl group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-[10px] font-black text-sage uppercase tracking-widest italic mb-1">{stat.label}</div>
                  <div className="text-2xl font-black text-forest italic tracking-tighter">{stat.value}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* List Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-8 mb-4">
             <div className="text-[10px] font-black text-sage uppercase tracking-widest italic">Temporal Sequence</div>
             <div className="flex items-center space-x-8 text-[10px] font-black text-sage uppercase tracking-widest italic">
                <span className="hidden md:block">Logic Syntax</span>
                <span className="hidden md:block">State</span>
                <span>Actions</span>
             </div>
          </div>

          {filteredSubmissions.length === 0 ? (
            <div className="text-center py-24 bg-white border-2 border-dashed border-leaf/10 rounded-[3rem] opacity-50">
               <div className="p-6 bg-cream rounded-full w-fit mx-auto mb-6">
                 <Code2 size={48} className="text-leaf/20" />
               </div>
               <p className="text-sage font-black uppercase tracking-widest text-xs italic">No matching records found in audit logs</p>
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {filteredSubmissions.map((sub) => (
                <motion.div
                  key={sub._id}
                  variants={itemVariants}
                  onClick={() => navigate(`/editor/${sub.questionId?._id}`)}
                  className="bg-white border border-leaf/10 p-6 rounded-[2.5rem] hover:border-leaf/30 transition-all cursor-pointer group shadow-sm flex items-center justify-between"
                >
                  <div className="flex items-center space-x-6">
                    <div className={`p-4 rounded-[1.5rem] ${sub.status === "Accepted" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                      {sub.status === "Accepted" ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-forest tracking-tighter italic uppercase group-hover:text-leaf transition-colors">{sub.questionId?.title || "Unknown Problem"}</h3>
                      <div className="flex items-center space-x-3 text-sage text-[10px] font-bold uppercase tracking-widest italic mt-1">
                         <Calendar size={12} />
                         <span>{new Date(sub.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-12">
                    <div className="hidden md:flex items-center space-x-3">
                       <div className="px-3 py-1 bg-cream rounded-lg text-[10px] font-black text-leaf uppercase italic border border-leaf/5">
                          {sub.language}
                       </div>
                    </div>

                    <div className={`hidden md:block text-[10px] font-black uppercase italic px-4 py-1.5 rounded-full ${sub.status === "Accepted" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                       {sub.status}
                    </div>

                    <div className="p-2 bg-cream rounded-xl group-hover:bg-leaf group-hover:text-white transition-all">
                       <ChevronRight size={20} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default Submissions;