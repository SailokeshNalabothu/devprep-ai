import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, Code2 } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      navigate("/dashboard");
    } catch (error) {
       setError(error.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-cream relative overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-leaf/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sage/10 rounded-full blur-[120px]"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md px-8 py-10 bg-white/80 backdrop-blur-xl border border-leaf/10 rounded-3xl shadow-2xl relative z-10 mx-4"
      >
        <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-14 h-14 bg-leaf rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-leaf/20">
                <Code2 size={28} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-forest tracking-tighter mb-2">Welcome Back</h1>
            <p className="text-sage text-[10px] font-bold uppercase tracking-widest italic font-mono">Professional Platform Staging [v1.0.4]</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-leaf/60 uppercase ml-1 italic tracking-widest">Entry ID / Email</label>
                <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-leaf/40 group-focus-within:text-leaf transition-colors" size={20} />
                    <input
                        type="email"
                        placeholder="coder@devprep.ai"
                        className="w-full bg-cream/50 border border-leaf/20 p-4 pl-12 rounded-2xl text-forest outline-none focus:border-leaf/50 focus:ring-4 focus:ring-leaf/5 transition-all text-sm placeholder-leaf/30"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-leaf/60 uppercase ml-1 italic tracking-widest">Security Key / Password</label>
                <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-leaf/40 group-focus-within:text-leaf transition-colors" size={20} />
                    <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-cream/50 border border-leaf/20 p-4 pl-12 rounded-2xl text-forest outline-none focus:border-leaf/50 focus:ring-4 focus:ring-leaf/5 transition-all text-sm placeholder-leaf/30"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
            </div>

            {error && (
                <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-sm font-medium italic"
                >
                    {error}
                </motion.div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-leaf hover:bg-leaf-light text-white font-bold h-14 rounded-2xl transition-all shadow-lg shadow-leaf/20 flex items-center justify-center space-x-2 group border border-leaf/20"
            >
                <span className="uppercase tracking-tighter text-sm italic">{loading ? "Authenticating..." : "Establish Session"}</span>
                {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
            </button>
        </form>

        <div className="mt-8 text-center">
            <p className="text-sage text-sm font-medium italic">
                New to the ecosystem?{" "}
                <Link to="/signup" className="text-leaf font-bold hover:underline underline-offset-4 decoration-leaf/30">
                    Register Entity
                </Link>
            </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;