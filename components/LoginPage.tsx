import React, { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-[#f0eff2] font-sans">
      <div className="w-full max-w-[420px] px-6">
        <div className="bg-[#e8e7eb] p-10 rounded-[48px] shadow-2xl shadow-black/5 flex flex-col items-center">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="relative bg-white/70 backdrop-blur-md rounded-3xl p-1 mb-8">
              <input
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className="w-full pr-14 pl-6 py-4 bg-transparent border-none outline-none text-slate-500 placeholder-slate-400 text-base"
                placeholder="enter password"
                required
              />
              <button
                type="submit"
                className="absolute right-2 top-1.5 bottom-1.5 w-12 flex items-center justify-center bg-black/10 hover:bg-black/20 text-white rounded-2xl transition-all active:scale-95"
              >
                <ArrowRight size={20} />
              </button>
            </div>

            {error && (
              <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest text-center mb-4 transition-all animate-in fade-in slide-in-from-top-1">
                {error}
              </p>
            )}
          </form>

          <p className="text-slate-400 text-xs font-medium">
            contact <span className="text-black/40">Huong Diep</span> for the password
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

