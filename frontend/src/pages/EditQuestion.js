import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Trash2, 
  Save, 
  ArrowLeft, 
  Code2, 
  Database, 
  AlertCircle,
  Hash,
  FileText,
  Loader2,
  CheckCircle2,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function EditQuestion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "Easy",
    functionName: "solution",
    testCases: []
  });

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/questions");
        const q = res.data.find(item => item._id === id);
        if (q) {
          setFormData({
            title: q.title || "",
            description: q.description || "",
            difficulty: q.difficulty || "Easy",
            functionName: q.functionName || "solution",
            testCases: q.testCases || []
          });
        }
      } catch (error) {
        console.error("Error fetching question:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const updateTestCase = (index, field, value) => {
    const newTestCases = [...formData.testCases];
    newTestCases[index][field] = value;
    setFormData({ ...formData, testCases: newTestCases });
  };

  const addTestCase = () => {
    setFormData({
      ...formData,
      testCases: [...formData.testCases, { input: "", output: "" }]
    });
  };

  const removeTestCase = (index) => {
    const newTestCases = formData.testCases.filter((_, i) => i !== index);
    setFormData({ ...formData, testCases: newTestCases });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(
        `http://localhost:5000/api/questions/${id}`,
        formData,
        {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") }
        }
      );
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error(error);
      alert("Failed to update question.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center">
        <Loader2 className="text-[#2d5a27] animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#1a2e1a] p-8 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate("/questions")}
            className="flex items-center gap-2 text-[#2d5a27] hover:text-[#1f3f1b] transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold uppercase tracking-widest text-[10px] italic">Problem Bank / Audit</span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2d5a27] rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/20">
                <FileText className="text-white" size={24} />
            </div>
            <h1 className="text-3xl font-black text-[#1a2e1a] tracking-tighter italic uppercase">Refactor Problem</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Main Info Card */}
          <div className="bg-white border border-emerald-900/10 rounded-3xl p-8 shadow-lg space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#2d5a27] uppercase tracking-widest ml-1 italic">Problem Identifier</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0ba9f]" size={18} />
                  <input
                    required
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full bg-[#fdfbf7] border border-emerald-900/10 rounded-2xl py-3 pl-12 pr-4 text-[#1a2e1a] placeholder-[#a0ba9f] outline-none focus:border-[#2d5a27]/50 focus:ring-4 focus:ring-[#2d5a27]/5 transition-all font-semibold text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#2d5a27] uppercase tracking-widest ml-1 italic">Target Function Registry</label>
                <div className="relative">
                  <Code2 className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0ba9f]" size={18} />
                  <input
                    required
                    name="functionName"
                    value={formData.functionName}
                    onChange={handleChange}
                    className="w-full bg-[#fdfbf7] border border-emerald-900/10 rounded-2xl py-3 pl-12 pr-4 text-[#1a2e1a] placeholder-[#a0ba9f] outline-none focus:border-[#2d5a27]/50 focus:ring-4 focus:ring-[#2d5a27]/5 transition-all font-mono text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#2d5a27] uppercase tracking-widest ml-1 italic">Detailed Logic [MARKDOWN]</label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 text-[#a0ba9f]" size={18} />
                <textarea
                  required
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  className="w-full bg-[#fdfbf7] border border-emerald-900/10 rounded-2xl py-3 pl-12 pr-4 text-[#1a2e1a] placeholder-[#a0ba9f] outline-none focus:border-[#2d5a27]/50 focus:ring-4 focus:ring-[#2d5a27]/5 transition-all font-medium leading-relaxed text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#2d5a27] uppercase tracking-widest ml-1 italic">Difficulty Tier Adjustment</label>
              <div className="flex gap-4">
                {["Easy", "Medium", "Hard"].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData({ ...formData, difficulty: level })}
                    className={`flex-1 py-3 px-6 rounded-2xl font-bold border transition-all text-xs ${
                      formData.difficulty === level 
                        ? (level === 'Easy' ? 'bg-emerald-100 border-emerald-500 text-emerald-800 shadow-lg shadow-emerald-500/20' :
                           level === 'Medium' ? 'bg-amber-100 border-amber-500 text-amber-800 shadow-lg shadow-amber-500/20' :
                           'bg-rose-100 border-rose-500 text-rose-800 shadow-lg shadow-rose-500/20')
                        : 'bg-[#fdfbf7] border-emerald-900/10 text-[#a0ba9f] hover:border-emerald-900/20'
                    }`}
                  >
                    {level.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Test Cases Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <Database className="text-[#2d5a27]" size={20} />
                <h2 className="text-lg font-bold text-[#1a2e1a] tracking-tight uppercase italic">Validation Vectors</h2>
              </div>
              <span className="text-[10px] font-bold text-[#2d5a27] uppercase tracking-widest bg-emerald-50 border border-emerald-900/10 px-3 py-1 rounded-full italic">
                {formData.testCases.length} Active Nodes
              </span>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {formData.testCases.map((tc, index) => (
                  <motion.div 
                    key={index}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white border border-emerald-900/10 rounded-3xl p-6 relative group overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#2d5a27]/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-black text-[#2d5a27] uppercase tracking-widest italic group-hover:translate-x-1 transition-transform inline-block font-mono underline decoration-emerald-900/30 underline-offset-4">VECTOR ID: 0{index + 1}</span>
                      <button 
                        type="button"
                        onClick={() => removeTestCase(index)}
                        className="text-[#a0ba9f] hover:text-rose-500 transition-colors p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <div className="text-[10px] font-black text-[#2d5a27] uppercase tracking-widest ml-1 italic">Input Stream</div>
                         <textarea
                            value={tc.input}
                            onChange={(e) => updateTestCase(index, 'input', e.target.value)}
                            rows={2}
                            className="w-full bg-[#fdfbf7] border border-emerald-900/10 rounded-2xl py-3 px-4 text-[#2d5a27] placeholder-[#a0ba9f] outline-none focus:border-[#2d5a27]/50 focus:ring-4 focus:ring-[#2d5a27]/5 transition-all font-mono text-xs italic"
                         />
                      </div>
                      <div className="space-y-2">
                         <div className="text-[10px] font-black text-[#2d5a27] uppercase tracking-widest ml-1 italic">Expected Yield</div>
                         <textarea
                            value={tc.output}
                            onChange={(e) => updateTestCase(index, 'output', e.target.value)}
                            rows={2}
                            className="w-full bg-[#fdfbf7] border border-emerald-900/10 rounded-2xl py-3 px-4 text-rose-600 placeholder-[#a0ba9f] outline-none focus:border-[#2d5a27]/50 focus:ring-4 focus:ring-[#2d5a27]/5 transition-all font-mono text-xs italic"
                         />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <button
                type="button"
                onClick={addTestCase}
                className="w-full py-4 border-2 border-dashed border-emerald-900/10 rounded-3xl text-[#2d5a27] font-bold uppercase tracking-widest text-[10px] hover:border-[#2d5a27]/30 hover:text-[#2d5a27] transition-all bg-emerald-50/5 flex items-center justify-center gap-2 group italic font-mono"
              >
                <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                Initialize New Vector Instance
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              disabled={saving}
              type="submit"
              className={`flex-1 font-black py-4 rounded-3xl transition-all shadow-lg flex items-center justify-center gap-3 uppercase tracking-tighter italic text-lg border ${
                success 
                ? "bg-emerald-600 text-white border-emerald-400/20" 
                : "bg-[#2d5a27] hover:bg-[#1f3f1b] text-white border-emerald-900/20 shadow-emerald-900/20"
              }`}
            >
              {saving ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white"></div>
              ) : success ? (
                <>
                  <CheckCircle2 size={24} />
                  Registry Synchronized
                </>
              ) : (
                <>
                  <Save size={20} />
                  Update Questions
                </>
              )}
            </button>
          </div>
        </form>
        
        <div className="mt-12 p-6 bg-emerald-50 rounded-3xl border border-emerald-900/10 flex items-start gap-4">
            <AlertCircle className="text-[#2d5a27] mt-1" size={20} />
            <div className="text-sm">
                <h4 className="font-bold text-[#2d5a27] uppercase tracking-widest text-[10px] mb-1 italic">Architectural Continuity Check</h4>
                <p className="text-[#4a5d4a] leading-relaxed italic text-xs font-bold uppercase tracking-tight">Synchronizing updates will affect all future user submissions. Ensure the validation suite covers edge cases for all runtimes.</p>
            </div>
        </div>
      </motion.div>
    </div>
  );
}

export default EditQuestion;