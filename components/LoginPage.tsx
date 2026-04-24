import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LoginPageProps {
  onLogin: (pass: string) => void;
  error?: string;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, error }) => {
  const [pass, setPass] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(pass);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden font-sans">
      {/* Dynamic Background Blobs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#f1f5f9] rounded-full blur-[140px] opacity-60"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -40, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#e2e8f0] rounded-full blur-[120px] opacity-50"
      />

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[400px] z-10 px-4"
      >
        <div className="bg-white/40 backdrop-blur-3xl p-8 md:p-10 rounded-[40px] border border-white/60 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] flex flex-col items-center">
          <form onSubmit={handleSubmit} className="w-full">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative group"
            >
              <motion.div
                whileFocus={{ scale: 1.02 }}
                animate={error ? { x: [-4, 4, -4, 4, 0] } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="relative"
              >
                <input
                  type="password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  autoFocus
                  className="w-full pr-14 pl-6 py-4 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-slate-100 rounded-2xl outline-none text-slate-800 placeholder-slate-300 text-sm font-medium transition-all focus:border-black/5 focus:ring-8 focus:ring-black/[0.02]"
                  placeholder="enter password"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 bottom-2 w-11 flex items-center justify-center bg-black text-white rounded-xl transition-all hover:bg-black/80 hover:shadow-lg active:scale-95"
                >
                  <ArrowRight size={20} />
                </button>
              </motion.div>
            </motion.div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.p 
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="text-[10px] text-red-500 font-bold tracking-[0.05em] text-center overflow-hidden"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </form>

          <motion.footer 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="w-full mt-8 flex flex-col items-center"
          >
            <p className="text-[10px] text-slate-400 font-medium tracking-wider text-center whitespace-nowrap">
              contact <span className="text-black/40">Huong Diep</span> for the password
            </p>
          </motion.footer>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;

