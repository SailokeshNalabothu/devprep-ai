import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Trash2, 
  Save, 
  ArrowLeft, 
  Code2, 
  Database, 
  AlertCircle,
  Hash,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function AddQuestion() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "Easy",
    functionName: "solution",
    testCases: [{ input: "", output: "" }]
  });

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
    if (formData.testCases.length === 1) return;
    const newTestCases = formData.testCases.filter((_, i) => i !== index);
    setFormData({ ...formData, testCases: newTestCases });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        "http://localhost:5000/api/questions/add",
        formData,
        {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") }
        }
      );
      navigate("/questions");
    } catch (error) {
      console.error(error);
      alert("Failed to add question. Please check all fields.");
    } finally {
      setLoading(false);
    }
  };

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
            <span className="font-bold uppercase tracking-widest text-[10px] italic">Access Bank / History</span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2d5a27] rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/20">
                <Plus className="text-white" size={24} />
            </div>
            <h1 className="text-3xl font-black text-[#1a2e1a] tracking-tighter italic uppercase">Architect Problem</h1>
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
                    placeholder="e.g. Two Sum"
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
                    placeholder="e.g. solve"
                    className="w-full bg-[#fdfbf7] border border-emerald-900/10 rounded-2xl py-3 pl-12 pr-4 text-[#1a2e1a] placeholder-[#a0ba9f] outline-none focus:border-[#2d5a27]/50 focus:ring-4 focus:ring-[#2d5a27]/5 transition-all font-mono text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#2d5a27] uppercase tracking-widest ml-1 italic">System Description [MARKDOWN]</label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 text-[#a0ba9f]" size={18} />
                <textarea
                  required
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describe the problem, constraints, and examples..."
                  className="w-full bg-[#fdfbf7] border border-emerald-900/10 rounded-2xl py-3 pl-12 pr-4 text-[#1a2e1a] placeholder-[#a0ba9f] outline-none focus:border-[#2d5a27]/50 focus:ring-4 focus:ring-[#2d5a27]/5 transition-all font-medium leading-relaxed text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#2d5a27] uppercase tracking-widest ml-1 italic">Difficulty Tier Allocation</label>
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
                <h2 className="text-lg font-bold text-[#1a2e1a] tracking-tight uppercase italic">Validation Matrix</h2>
              </div>
              <span className="text-[10px] font-bold text-[#2d5a27] uppercase tracking-widest bg-emerald-50 border border-emerald-900/10 px-3 py-1 rounded-full italic">
                {formData.testCases.length} Vectors Defined
              </span>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {formData.testCases.map((tc, index) => (
                  <motion.div 
                    key={index}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
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
                            placeholder="e.g. [2, 7, 11, 15], 9"
                            rows={2}
                            className="w-full bg-[#fdfbf7] border border-emerald-900/10 rounded-2xl py-3 px-4 text-[#2d5a27] placeholder-[#a0ba9f] outline-none focus:border-[#2d5a27]/50 focus:ring-4 focus:ring-[#2d5a27]/5 transition-all font-mono text-xs italic"
                         />
                      </div>
                      <div className="space-y-2">
                         <div className="text-[10px] font-black text-[#2d5a27] uppercase tracking-widest ml-1 italic">Expected Yield</div>
                         <textarea
                            value={tc.output}
                            onChange={(e) => updateTestCase(index, 'output', e.target.value)}
                            placeholder="e.g. [0, 1]"
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
                Initialize New Validation Vector
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              disabled={loading}
              type="submit"
              className="flex-1 bg-[#2d5a27] hover:bg-[#1f3f1b] disabled:bg-emerald-900/20 disabled:text-[#a0ba9f] text-white font-black py-4 rounded-3xl transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-3 uppercase tracking-tighter italic text-lg border border-emerald-900/20"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white"></div>
              ) : (
                <>
                  <Save size={20} />
                  Establish Problem Logic
                </>
              )}
            </button>
          </div>
        </form>
        
        <div className="mt-12 p-6 bg-emerald-50 rounded-3xl border border-emerald-900/10 flex items-start gap-4">
            <AlertCircle className="text-[#2d5a27] mt-1" size={20} />
            <div className="text-sm">
                <h4 className="font-bold text-[#2d5a27] uppercase tracking-widest text-[10px] mb-1 italic">Architectural Integrity Check</h4>
                <p className="text-[#4a5d4a] leading-relaxed italic text-xs font-bold uppercase tracking-tight">Ensure the Target Function matches the expected signature. Standard I/O parsing is automated for C/C++/Java environments.</p>
            </div>
        </div>
      </motion.div>
    </div>
  );
}

export default AddQuestion;