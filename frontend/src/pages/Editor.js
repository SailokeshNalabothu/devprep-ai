import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Editor, DiffEditor } from "@monaco-editor/react";
import {
  Play,
  Send,
  Code2,
  MessageSquare,
  Lightbulb,
  History,
  ChevronDown,
  BrainCircuit,
  Maximize2,
  Settings,
  ChevronRight,
  Database,
  Cpu,
  Plus,
  Trash2,
  X,
  FileCode
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function CodeEditor() {
  const { id } = useParams();

  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [isCustom, setIsCustom] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [output, setOutput] = useState("");
  const [hints, setHints] = useState([]);
  const [review, setReview] = useState("");
  const [explanation, setExplanation] = useState("");
  const [complexity, setComplexity] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isComparing, setIsComparing] = useState(false);
  const [loadingHints, setLoadingHints] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [activeTab, setActiveTab] = useState("description"); // description, hints, submissions
  const [consoleOpen, setConsoleOpen] = useState(true);
  const [testResults, setTestResults] = useState(null);

  const getTemplates = (funcName) => ({
    javascript: `// JavaScript Solution\nfunction ${funcName}(nums, target) {\n    \n}`,
    python: `# Python Solution\ndef ${funcName}(nums, target):\n    pass`,
    cpp: `// C++ Solution\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nvector<int> ${funcName}(vector<int>& nums, int target) {\n    \n}`,
    c: `// C Solution\n#include <stdio.h>\n\nvoid ${funcName}() {\n    \n}`,
    java: `// Java Solution\nimport java.util.*;\n\npublic class Solution {\n    public int[] ${funcName}(int[] nums, int target) {\n        return new int[]{};\n    }\n}`
  });

  // LOAD SAVED CODE ON MOUNT OR LANG CHANGE
  useEffect(() => {
    const savedCode = localStorage.getItem(`devprep_code_${id}_${language}`);
    if (savedCode) {
      setCode(savedCode);
    } else if (question) {
      const templates = getTemplates(question.functionName || "solution");
      setCode(templates[language]);
    }
  }, [id, language, question]);

  // AUTO-SAVE ON CHANGE
  useEffect(() => {
    if (code) {
      localStorage.setItem(`devprep_code_${id}_${language}`, code);
    }
  }, [code, id, language]);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/questions");
        const found = res.data.find((q) => q._id === id);
        if (found) {
          setQuestion(found);
          // Initial load happens in the other useEffect once question is set
        }
      } catch (error) {
        console.error("Error fetching question:", error);
      }
    };
    fetchQuestion();
  }, [id]);

  const getHints = async () => {
    if (!question) return;
    setLoadingHints(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/submissions/hints/${id}`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      });
      setHints(res.data.hints);
      setActiveTab("hints");
    } catch (error) {
      console.error(error);
      alert("Error getting hints");
    } finally {
      setLoadingHints(false);
    }
  };

  const runCodeTask = async () => {
    setConsoleOpen(true);
    setOutput("Running...");
    setTestResults(null);
    try {
      const res = await axios.post("http://localhost:5000/api/submissions/run",
        { 
          code, 
          language,
          customInput: isCustom ? customInput : ""
        },
        { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
      );
      const result = res.data.result;
      if (!result) {
        setOutput("Execution failed. Service might be busy.");
        return;
      }
      setOutput(
        (result.stdout || "") + (result.stderr || "") +
        (result.compile_output || "") + (result.message || "") +
        (result.status?.description || "")
      );
    } catch (error) {
      console.error(error);
      setOutput("Error: " + (error.response?.data?.message || error.message));
    }
  };

  const fetchSubmissions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/submissions", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      });
      const filtered = res.data.filter(s => s.questionId?._id === id || s.questionId === id);
      setSubmissions(filtered.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  useEffect(() => {
    if (activeTab === "history") {
      fetchSubmissions();
    }
  }, [activeTab, id]);

  const submitCodeTask = async () => {
    setConsoleOpen(true);
    setOutput("Submitting...");
    setTestResults(null);
    setLoadingAI(true);
    try {
      const res = await axios.post("http://localhost:5000/api/submissions/submit",
        { questionId: id, code, language },
        { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
      );

      const { testResults, review, explanation, complexity } = res.data;
      setTestResults(testResults);

      const allPassed = testResults && testResults.every(r => r.status === "Passed");
      setOutput(allPassed ? "🎯 All test cases passed!" : "❌ Some test cases failed.");

      if (review || explanation || complexity) {
        setReview(review);
        setExplanation(explanation);
        setComplexity(complexity);
        setActiveTab("ai-feedback");
      } else {
        setActiveTab("description");
      }
    } catch (error) {
      console.error(error);
      setOutput("Error: " + (error.response?.data?.message || error.message));
    } finally {
      setLoadingAI(false);
    }
  };

  if (!question) return (
    <div className="h-screen bg-[#fdfbf7] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2d5a27]"></div>
    </div>
  );

  return (
    <div className="h-screen bg-[#fdfbf7] flex flex-col overflow-hidden font-sans text-[#1a2e1a]">
      {/* GLOBAL HEADER */}
      <header className="h-16 border-b border-emerald-900/10 flex items-center justify-between px-8 bg-white z-20 shadow-sm">
        <div className="flex items-center space-x-8">
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-[#2d5a27] rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/10 group-hover:bg-[#1f3f1b] transition-all">
              <Code2 size={22} className="text-white" />
            </div>
            <span className="font-black text-[#1a2e1a] tracking-tighter text-xl group-hover:text-[#2d5a27] transition-colors italic uppercase">DevPrep AI</span>
          </Link>
          <div className="h-8 w-px bg-emerald-900/5 mx-2"></div>
          <div className="flex items-center space-x-3 text-xs font-black uppercase tracking-widest italic opacity-70">
            <span className="text-[#a0ba9f]">Matrix</span>
            <ChevronRight size={14} className="text-[#a0ba9f]" />
            <span className="text-[#2d5a27] truncate max-w-[200px]">{question.title}</span>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          {/* Language Selector */}
          <div className="relative group">
            <select
              value={language}
              onChange={(e) => {
                const newLang = e.target.value;
                setLanguage(newLang);
                if (question) {
                  const templates = getTemplates(question.functionName || "solution");
                  setCode(templates[newLang]);
                }
              }}
              className="appearance-none bg-emerald-50 border border-emerald-900/10 text-[#2d5a27] text-[10px] font-black uppercase tracking-widest py-2.5 pl-6 pr-12 rounded-2xl outline-none focus:border-[#2d5a27]/40 hover:bg-emerald-100/50 cursor-pointer transition-all italic"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="c">C</option>
              <option value="java">Java</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2d5a27] pointer-events-none" size={14} />
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={runCodeTask}
              className="bg-emerald-50 border border-emerald-900/10 hover:bg-emerald-100 text-[#2d5a27] font-black py-2.5 px-6 rounded-2xl text-[10px] uppercase tracking-widest transition-all flex items-center space-x-2 shadow-sm italic"
            >
              <Play size={14} className="fill-[#2d5a27]" />
              <span>Initiate</span>
            </button>
            <button
              onClick={submitCodeTask}
              className="bg-[#2d5a27] hover:bg-[#1f3f1b] text-white font-black py-2.5 px-8 rounded-2xl text-[10px] uppercase tracking-widest transition-all flex items-center space-x-2 shadow-md shadow-emerald-900/20 border border-emerald-400/10 italic"
            >
              <Send size={14} />
              <span>Synchronize</span>
            </button>
          </div>

          <div className="h-8 w-px bg-emerald-900/5 mx-2"></div>
          <button className="p-2 text-[#a0ba9f] hover:text-[#2d5a27] transition-colors">
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* Main Split Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Content Panel */}
        <div className="w-[480px] border-r border-emerald-900/10 flex flex-col bg-white shadow-xl z-10">
          <div className="flex bg-[#f1f4f0] p-1.5 m-6 rounded-[1.5rem] border border-emerald-900/10 shadow-inner">
            {[
              { id: "description", icon: <MessageSquare size={14} />, label: "Structure" },
              { id: "hints", icon: <Lightbulb size={14} />, label: "Flow" },
              { id: "ai-feedback", icon: <BrainCircuit size={14} />, label: "Synthesis" },
              { id: "history", icon: <History size={14} />, label: "Archive" },
              { id: "visualizer", icon: <Settings size={14} />, label: "Trace" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center justify-center space-y-1 py-3 text-[9px] font-black uppercase tracking-tighter rounded-2xl transition-all italic ${activeTab === tab.id ? "bg-[#2d5a27] text-white shadow-md shadow-emerald-900/20" : "text-[#a0ba9f] hover:text-[#4a7c44]"
                  }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {activeTab === "description" && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <h1 className="text-3xl font-black text-[#1a2e1a] tracking-tighter italic uppercase">{question.title}</h1>
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest italic shadow-sm shadow-emerald-900/5 ${question.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-800' :
                          question.difficulty === 'Medium' ? 'bg-amber-100 text-amber-800' :
                            'bg-rose-100 text-rose-800'
                        }`}>
                        {question.difficulty}
                      </span>
                    </div>
                    <div className="text-[#4a5d4a] leading-relaxed text-base font-medium italic opacity-90 border-l-4 border-emerald-100 pl-6 py-2">
                      {question.description}
                    </div>

                    <div className="space-y-6 pt-8 mt-8 border-t border-emerald-900/5">
                      <h3 className="text-xs font-black text-[#2d5a27] uppercase flex items-center gap-3 tracking-[0.2em] italic">
                        <Database size={16} />
                        <span>Data Nodes</span>
                      </h3>
                      <div className="space-y-4">
                        {question.testCases?.slice(0, 2).map((tc, i) => (
                          <div key={i} className="p-6 bg-[#fdfbf7] border border-emerald-900/10 rounded-[2rem] space-y-4 shadow-sm group">
                            <div className="flex justify-between text-[10px] font-black text-[#a0ba9f] uppercase tracking-widest italic">
                              <span className="group-hover:text-[#2d5a27] transition-colors">Input Stream</span>
                              <span className="opacity-30">Sequence {i + 1}</span>
                            </div>
                            <code className="text-[#2d5a27] text-sm block font-mono bg-white p-4 rounded-xl border border-emerald-900/5 shadow-inner">{tc.input}</code>
                            <div className="text-[10px] font-black text-[#a0ba9f] uppercase tracking-widest italic pt-2">Awaiting State</div>
                            <code className="text-emerald-700 text-sm block font-black font-mono">{tc.expected}</code>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "hints" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between py-2 border-b border-emerald-900/5">
                      <h2 className="text-[10px] font-black text-[#a0ba9f] uppercase tracking-widest italic">Logic Propagation</h2>
                      <Lightbulb className="text-amber-500" size={20} />
                    </div>
                    {hints.length > 0 ? (
                      <div className="space-y-4">
                        {hints.map((hint, i) => (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={i}
                            className="p-6 bg-white border border-emerald-900/10 rounded-[2rem] relative overflow-hidden group shadow-sm"
                          >
                            <div className="absolute top-0 left-0 w-2 h-full bg-emerald-50"></div>
                            <span className="text-[10px] font-black text-[#2d5a27] uppercase mb-3 block tracking-tighter italic">Phase {i + 1}</span>
                            <p className="text-[#1a2e1a] text-sm font-bold leading-relaxed italic opacity-80">{hint}</p>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-24 text-center space-y-6">
                        <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center border border-emerald-900/10 shadow-inner">
                          <Lightbulb className="text-[#a0ba9f]" size={40} />
                        </div>
                        <button onClick={getHints} className="bg-[#2d5a27] text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-emerald-900/20 hover:bg-[#1f3f1b] transition-all italic">
                          {loadingHints ? "Synthesizing..." : "Request Logic"}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "ai-feedback" && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between py-2 border-b border-emerald-900/5">
                      <h2 className="text-[10px] font-black text-[#a0ba9f] uppercase tracking-widest italic">Neural Synthesis</h2>
                      <BrainCircuit className="text-[#2d5a27]" size={20} />
                    </div>
                    {loadingAI ? (
                      <div className="space-y-6 py-10">
                        <div className="animate-pulse bg-[#f1f4f0] h-32 rounded-[2rem] border border-emerald-900/5"></div>
                        <div className="animate-pulse bg-[#f1f4f0] h-48 rounded-[2rem] border border-emerald-900/5"></div>
                      </div>
                    ) : (
                      testResults ? (
                        <div className="space-y-6">
                          <div className="bg-[#f1f4f0] p-8 rounded-[2.5rem] border border-emerald-900/10 relative overflow-hidden shadow-sm">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                              <BrainCircuit size={120} className="text-[#2d5a27]" />
                            </div>
                            <h3 className="text-[10px] font-black text-[#2d5a27] uppercase mb-6 flex items-center gap-3 italic tracking-[0.2em]">
                              <Cpu size={14} />
                              Neural Audit
                            </h3>
                            <p className="text-[#1a2e1a] whitespace-pre-wrap leading-relaxed font-bold italic tracking-tight">{review}</p>
                          </div>
                          <div className="bg-white p-8 rounded-[2.5rem] border border-emerald-900/10 shadow-sm relative">
                            <h3 className="text-[10px] font-black text-emerald-600 uppercase mb-6 italic tracking-widest">Growth Perspective</h3>
                            <p className="text-[#1a2e1a] whitespace-pre-wrap leading-relaxed font-bold italic opacity-70 italic tracking-tight">{explanation}</p>
                          </div>
                          <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-900/10 shadow-inner">
                            <h3 className="text-[10px] font-black text-[#2d5a27] uppercase mb-4 flex items-center gap-3 italic">
                              <Maximize2 size={16} />
                              Efficiency Index
                            </h3>
                            <p className="text-[#1a2e1a] font-black italic tracking-tighter text-lg">{complexity}</p>
                          </div>
                        </div>
                      ) : <div className="text-center py-32 text-[#a0ba9f] italic font-black uppercase tracking-[0.2em] text-[10px]">Awaiting solution for neural profiling.</div>
                    )}
                  </div>
                )}

                {activeTab === "history" && (
                  <div className="space-y-8">
                    <h2 className="text-[10px] font-black text-[#a0ba9f] uppercase tracking-widest italic border-b border-emerald-900/5 pb-2">Version Archive</h2>
                    <div className="space-y-4">
                      {submissions.length === 0 ? (
                        <div className="text-center py-32 bg-[#fdfbf7] rounded-[3rem] border-2 border-dashed border-emerald-900/10 opacity-50">
                          <History size={64} className="mx-auto text-[#a0ba9f] mb-6" />
                          <p className="text-[#a0ba9f] font-black uppercase tracking-widest text-[10px] italic">Zero Records Found</p>
                        </div>
                      ) : (
                        submissions.map((s, idx) => (
                          <div 
                            key={s._id} 
                            onClick={() => {
                              setSelectedSubmission(s);
                              setIsComparing(true);
                            }}
                            className="bg-white border border-emerald-900/10 rounded-[2rem] p-6 hover:border-[#2d5a27]/40 transition-all cursor-pointer group relative overflow-hidden shadow-sm shadow-emerald-900/5"
                          >
                            {s.status === "Accepted" && (
                                <div className="absolute top-0 left-0 w-2 h-full bg-emerald-100"></div>
                            )}
                            <div className="flex items-center justify-between mb-4">
                               <span className="text-[10px] font-black text-[#a0ba9f] uppercase tracking-tighter italic group-hover:text-[#2d5a27] transition-colors">Ref_0{submissions.length - idx}</span>
                               <span className={`text-[10px] font-black uppercase italic px-3 py-1 rounded-full ${s.status === "Accepted" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                                 {s.status === "Accepted" ? "Success" : s.status}
                               </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-50 rounded-xl">
                                        <FileCode size={16} className="text-[#2d5a27]" />
                                    </div>
                                    <span className="text-xs font-black text-[#1a2e1a] uppercase italic">{s.language}</span>
                                </div>
                                <span className="text-[9px] text-[#a0ba9f] font-black uppercase tracking-widest">{new Date(s.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "visualizer" && (
                  <div className="space-y-8 h-full flex flex-col">
                    <h2 className="text-[10px] font-black text-[#a0ba9f] uppercase tracking-widest italic border-b border-emerald-900/5 pb-2">Botanical Trace</h2>
                    <div className="flex-1 bg-emerald-50 border border-emerald-900/10 rounded-[3rem] p-12 flex flex-col items-center justify-center text-center space-y-8 shadow-inner">
                        <div className="relative">
                            <BrainCircuit size={100} className="text-[#2d5a27]/10 animate-pulse" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Settings size={32} className="text-[#2d5a27]/30 animate-spin-slow" />
                            </div>
                        </div>
                        <div>
                            <p className="text-[#2d5a27] font-black uppercase tracking-widest text-sm mb-3 italic">Neural Staging Area</p>
                            <p className="text-[#a0ba9f] text-[10px] font-bold leading-relaxed uppercase tracking-[0.2em] max-w-[280px] italic">Execution Tracing and memory mapping are currently in architectural incubation phase.</p>
                        </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Monaco Editor + Dynamic Console */}
        <div className="flex-1 flex flex-col bg-cream overflow-hidden relative">
          <div className="flex-1 overflow-hidden relative border-l border-emerald-900/10">
            {isComparing && (
              <div className="absolute top-6 right-10 z-30 flex items-center gap-4 animate-fadeIn">
                 <div className="px-4 py-2 bg-[#2d5a27] border border-emerald-400/20 rounded-2xl backdrop-blur-md shadow-2xl flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></div>
                        <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Differential Synthesis</span>
                    </div>
                    <div className="h-5 w-px bg-white/20"></div>
                    <button 
                      onClick={() => setIsComparing(false)}
                      className="text-white/60 hover:text-white transition-colors"
                    >
                      <X size={16} />
                    </button>
                 </div>
              </div>
            )}
            {isComparing ? (
              <DiffEditor
                height="100%"
                theme="vs-dark"
                original={selectedSubmission?.code || ""}
                modified={code}
                language={language}
                options={{
                  fontSize: 15,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  renderSideBySide: true,
                  readOnly: true,
                  fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                  padding: { top: 30 }
                }}
              />
            ) : (
              <Editor
                height="100%"
                theme="vs-dark"
                language={language}
                value={code}
                onChange={(value) => setCode(value || "")}
                options={{
                  fontSize: 15,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  lineNumbers: "on",
                  roundedSelection: false,
                  padding: { top: 30, left: 20 },
                  fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                  fontLigatures: true,
                  cursorSmoothCaretAnimation: "on",
                  smoothScrolling: true,
                  backgroundColor: "#0d0f0d"
                }}
              />
            )}
          </div>

          {/* DYNAMIC CONSOLE SECTION */}
          <div
            className={`border-t border-emerald-900/20 flex flex-col transition-all duration-500 ease-in-out bg-white shadow-2xl ${consoleOpen ? "h-72" : "h-12"
              }`}
          >
            <div className="h-12 px-8 flex items-center justify-between border-b border-emerald-900/5 bg-[#fdfbf7]">
              <div className="flex items-center space-x-10">
                <button 
                  onClick={() => setIsCustom(false)}
                  className={`flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest transition-all italic relative py-4 ${!isCustom ? "text-[#2d5a27]" : "text-[#a0ba9f] hover:text-[#4a7c44]"}`}
                >
                  <History size={16} />
                  <span>Validation Log</span>
                  {!isCustom && <motion.div layoutId="consoleTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2d5a27]" />}
                </button>
                <button 
                  onClick={() => setIsCustom(true)}
                  className={`flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest transition-all italic relative py-4 ${isCustom ? "text-[#2d5a27]" : "text-[#a0ba9f] hover:text-[#4a7c44]"}`}
                >
                  <Plus size={16} />
                  <span>Custom Stream</span>
                  {isCustom && <motion.div layoutId="consoleTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2d5a27]" />}
                </button>
              </div>
              <button onClick={() => setConsoleOpen(!consoleOpen)} className="p-2 hover:bg-emerald-50 rounded-xl transition-all">
                <ChevronDown className={`text-[#a0ba9f] transform transition-transform duration-500 ${consoleOpen ? "rotate-0" : "rotate-180"}`} size={20} />
              </button>
            </div>

            <div className="flex-1 p-8 overflow-y-auto font-mono text-sm custom-scrollbar bg-white">
              {isCustom ? (
                <div className="h-full flex flex-col space-y-4">
                  <div className="text-[10px] font-black text-[#a0ba9f] uppercase tracking-widest flex items-center gap-3 italic">
                    <Database size={14} className="text-[#2d5a27]" />
                    Staging Environment (stdin)
                  </div>
                  <textarea
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Provide stream data for analysis..."
                    className="flex-1 bg-[#fdfbf7] border border-emerald-900/10 rounded-[2rem] p-6 text-[#2d5a27] font-bold placeholder-[#a0ba9f]/30 outline-none focus:border-[#2d5a27]/30 transition-all font-mono text-xs resize-none shadow-inner"
                  />
                </div>
              ) : testResults ? (
                <div className="space-y-4">
                  {testResults.map((res, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-2xl bg-[#fdfbf7] border border-emerald-900/5 hover:border-emerald-900/20 transition-all font-mono shadow-sm group"
                    >
                      <div className="flex items-center space-x-6">
                        <div className={`text-[10px] px-4 py-1.5 rounded-full font-black uppercase italic ${res.status === "Passed" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                          Case 0{i + 1}
                        </div>
                        <div className="text-[#a0ba9f] text-[10px] font-bold uppercase italic">
                          Input_Stream: <span className="text-[#2d5a27] font-black">{res.input}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="text-[#a0ba9f] text-[10px] font-black uppercase italic group-hover:text-[#4a7c44]">Exp: {res.expected}</span>
                        <div className="h-4 w-px bg-emerald-900/10"></div>
                        <span className={`font-black italic text-xs uppercase tracking-widest ${res.status === "Passed" ? "text-emerald-600" : "text-rose-600"}`}>
                          {res.status === "Passed" ? "VALIDATED" : "FAULT"}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-[#a0ba9f] italic font-black uppercase tracking-[0.4em] text-[10px] opacity-30 animate-pulse">
                    {output || "// Neural interface idle. Awaiting command trace..."}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodeEditor;