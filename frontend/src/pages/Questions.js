import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Edit3,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Questions() {
  const [questions, setQuestions] = useState([]);
  const [solvedIds, setSolvedIds] = useState(new Set());
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [qRes, sRes] = await Promise.all([
          axios.get("http://localhost:5000/api/questions"),
          token ? axios.get("http://localhost:5000/api/submissions/solved", {
            headers: { Authorization: `Bearer ${token}` }
          }) : Promise.resolve({ data: [] })
        ]);

        setQuestions(qRes.data);
        setSolvedIds(new Set(sRes.data));

        if (token) {
          const payload = JSON.parse(atob(token.split(".")[1]));
          setIsAdmin(payload.role === "admin");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const deleteQuestion = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/questions/${id}`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      });
      setQuestions(questions.filter(q => q._id !== id));
    } catch (error) {
      console.error(error);
      alert("Delete failed");
    }
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "All" || q.difficulty === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#fdfbf7]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2d5a27]"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 bg-[#fdfbf7] min-h-screen text-[#1a2e1a] font-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-[#1a2e1a] mb-2 tracking-tighter italic uppercase">Practice Matrix</h1>
          <p className="text-[#4a7c44] uppercase text-[10px] font-black tracking-widest italic opacity-80">Synthesizing logic through botanical precision.</p>
        </div>
        {isAdmin && (
            <button 
                onClick={() => navigate("/admin/add")}
                className="bg-[#2d5a27] hover:bg-[#1f3f1b] text-white px-6 py-3 rounded-2xl font-black transition-all shadow-lg shadow-emerald-900/20 uppercase text-xs tracking-widest italic"
            >+ Insert Node</button>
        )}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-6 rounded-[2rem] border border-emerald-900/10 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0ba9f]" size={20} />
          <input 
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#fdfbf7] border border-emerald-900/10 rounded-2xl py-3.5 pl-12 pr-6 outline-none focus:border-[#2d5a27]/30 transition-all text-sm font-medium italic placeholder-[#a0ba9f]"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
          {["All", "Easy", "Medium", "Hard"].map(level => (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap italic ${
                filter === level 
                  ? "bg-[#2d5a27] text-white shadow-lg shadow-emerald-900/20" 
                  : "bg-emerald-50 text-[#a0ba9f] border border-emerald-900/5 hover:bg-emerald-100/50 hover:text-[#4a7c44]"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Questions table header */}
      <div className="hidden md:grid grid-cols-12 px-8 text-[10px] font-black text-[#a0ba9f] uppercase tracking-widest mb-2 italic">
        <div className="col-span-2 text-[#2d5a27]/50 italic">Integrity</div>
        <div className="col-span-6">Problem Structure</div>
        <div className="col-span-2">Complexity</div>
        <div className="col-span-2 text-right">Access</div>
      </div>

      {/* Questions list */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredQuestions.map((q, i) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              key={q._id}
              className="group grid grid-cols-1 md:grid-cols-12 items-center px-8 py-5 bg-white border border-emerald-900/10 rounded-[2rem] hover:bg-emerald-50/40 hover:border-[#2d5a27]/30 transition-all cursor-pointer relative overflow-hidden shadow-sm shadow-emerald-900/5"
              onClick={() => navigate(`/editor/${q._id}`)}
            >
              <div className="col-span-2 mb-2 md:mb-0">
                {solvedIds.has(q._id) ? (
                  <div className="flex items-center space-x-2 text-emerald-600">
                    <CheckCircle2 size={20} className="fill-emerald-50" />
                    <span className="text-[10px] font-black uppercase tracking-widest italic">Verified</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-[#a0ba9f]/30">
                    <Circle size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest italic opacity-0 group-hover:opacity-100 transition-opacity">Untested</span>
                  </div>
                )}
              </div>
              <div className="col-span-6 mb-2 md:mb-0">
                <h3 className="text-[#1a2e1a] font-extrabold group-hover:text-[#2d5a27] transition-colors uppercase tracking-tighter text-base italic">
                  {i + 1}. {q.title}
                </h3>
              </div>
              <div className="col-span-2 mb-2 md:mb-0">
                <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-inner italic ${
                  q.difficulty === "Easy" ? "bg-emerald-100 text-emerald-800" :
                  q.difficulty === "Medium" ? "bg-amber-100 text-amber-800" :
                  "bg-rose-100 text-rose-800"
                }`}>
                  {q.difficulty}
                </span>
              </div>
              <div className="col-span-2 flex justify-end space-x-3">
                {isAdmin && (
                  <>
                    <button 
                      onClick={(e) => { e.stopPropagation(); navigate(`/admin/edit/${q._id}`); }}
                      className="p-2 bg-emerald-50 text-[#2d5a27] rounded-xl hover:bg-emerald-100 transition-all border border-emerald-900/10 shadow-sm"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteQuestion(q._id); }}
                      className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-all border border-rose-900/10 shadow-sm"
                    >
                      <Trash2 size={18} />
                    </button>
                  </>
                )}
                <div className="p-2 bg-[#fdfbf7] text-[#2d5a27] rounded-xl group-hover:bg-[#2d5a27] group-hover:text-white transition-all border border-emerald-900/10 shadow-sm">
                  <ChevronRight size={18} />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredQuestions.length === 0 && (
          <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-emerald-900/10 opacity-50">
            <TrendingUp size={64} className="mx-auto text-[#a0ba9f] mb-6" />
            <p className="text-[#a0ba9f] font-black uppercase tracking-[0.2em] text-xs italic">Zero Parity Found in Knowledge Matrix</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Questions;