import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  GitBranch as Github, 
  BrainCircuit, 
  Award, 
  BarChart3, 
  CheckCircle2,
  Loader2
} from "lucide-react";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/user/profile", {
          headers: { Authorization: "Bearer " + token }
        });
        setProfile(res.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  const runAiAnalysis = async () => {
    setAnalyzing(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/submissions/analyze", {
        headers: { Authorization: "Bearer " + token }
      });
      setAiAnalysis(res.data);
    } catch (error) {
      console.error("Error running AI analysis:", error);
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-cream">
        <Loader2 className="animate-spin text-leaf" size={48} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-full bg-cream">
        <div className="text-center">
          <p className="text-leaf text-lg font-bold">Failed to load profile</p>
          <p className="text-sage text-sm mt-2">Please refresh the page or try again</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 bg-cream min-h-screen text-forest font-sans">
      {/* Header Profile Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-leaf/10 p-8 rounded-3xl flex flex-col md:flex-row items-center md:items-start gap-8 shadow-xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5 text-leaf">
            <User size={160} />
        </div>

        <div className="w-32 h-32 bg-leaf/10 rounded-full flex items-center justify-center border-2 border-leaf/30">
            <User size={64} className="text-leaf" />
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl font-bold text-forest mb-2">{profile.name}</h1>
          <div className="flex items-center justify-center md:justify-start space-x-4 text-sage mb-6 font-bold text-xs uppercase tracking-widest italic">
            <div className="flex items-center space-x-1.5">
                <Mail size={16} />
                <span>{profile.email}</span>
            </div>
            <span className="text-leaf/20">|</span>
            <span className="text-leaf italic">Level: Advanced Developer</span>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <button 
                onClick={runAiAnalysis}
                disabled={analyzing}
                className="bg-leaf hover:bg-leaf-light disabled:opacity-50 text-white font-bold py-2.5 px-6 rounded-xl transition-all flex items-center space-x-2 shadow-lg shadow-leaf/20"
            >
                {analyzing ? <Loader2 className="animate-spin" size={20} /> : <BrainCircuit size={20} />}
                <span>Get AI Coach Analysis</span>
            </button>
            <button className="bg-white hover:bg-cream text-forest font-bold py-2.5 px-6 rounded-xl transition-all flex items-center space-x-2 border border-leaf/10 shadow-sm">
                <Github size={20} />
                <span>Sync with GitHub</span>
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Stats Column */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white border border-leaf/10 p-6 rounded-3xl shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-leaf group-hover:scale-110 transition-transform">
                <Award size={48} />
            </div>
            <h3 className="text-sm font-bold text-sage uppercase tracking-widest mb-6 italic">Achievements</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-cream rounded-2xl border border-leaf/5">
                <CheckCircle2 className="text-leaf" size={20} />
                <span className="text-sm font-bold text-forest">Early Adopter</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-cream rounded-2xl border border-leaf/5">
                <CheckCircle2 className="text-leaf" size={20} />
                <span className="text-sm font-bold text-forest">Problem Solver</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insights Column */}
        <div className="md:col-span-2 space-y-6">
            <div className="bg-white border border-leaf/10 p-8 rounded-3xl shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-leaf/10 rounded-xl">
                            <BrainCircuit className="text-leaf" size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-forest tracking-tight">AI Coach Insights</h2>
                    </div>
                </div>

                {aiAnalysis ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="prose prose-forest prose-invert max-w-none"
                    >
                        <div className="text-forest/80 leading-relaxed font-medium italic whitespace-pre-wrap">
                            {aiAnalysis.analysis}
                        </div>
                    </motion.div>
                ) : (
                    <div className="text-center py-12 bg-cream/50 rounded-2xl border border-dashed border-leaf/20">
                        <BarChart3 className="mx-auto text-leaf/20 mb-4" size={48} />
                        <p className="text-sage font-bold italic">No active analysis. Initialize the AI Coach to begin.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;