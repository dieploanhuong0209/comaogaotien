import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

interface LoginPageProps {
  onLogin: (pass: string) => void;
  error?: string;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, error }) => {
  const [pass, setPass] = useState('');
  const [shake, setShake] = useState(false);

  // Trigger shake animation when error changes
  useEffect(() => {
    if (error) {
      setShake(true);
      const timer = setTimeout(() => setShake(false), 400); // match animation duration
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(pass);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden font-sans">
      {/* Dynamic Background Blobs */}
      <div
        className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#f1f5f9] rounded-full blur-[140px] opacity-60 animate-float pointer-events-none"
      />
      <div
        className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#e2e8f0] rounded-full blur-[120px] opacity-50 animate-float-reverse pointer-events-none"
      />

      <div 
        className="w-full max-w-[400px] z-10 px-4 animate-fade-in-up"
      >
        <div className="bg-white/40 backdrop-blur-3xl p-8 md:p-10 rounded-[40px] border border-white/60 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] flex flex-col items-center">
          <form onSubmit={handleSubmit} className="w-full">
            <div 
              className="relative group animate-fade-in-up animate-delay-300 opacity-0-init"
              style={{ animationFillMode: 'forwards' }}
            >
              <div className={`relative transition-transform duration-300 focus-within:scale-[1.02] ${shake ? 'animate-shake' : ''}`}>
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
              </div>
            </div>

            <div className={`overflow-hidden transition-all duration-300 ease-in-out flex justify-center ${error ? 'h-auto mt-4 opacity-100' : 'h-0 mt-0 opacity-0'}`}>
              <p className="text-[10px] text-red-500 font-bold tracking-[0.05em] text-center w-full">
                {error}
              </p>
            </div>
          </form>

          <footer 
            className="w-full mt-8 flex flex-col items-center animate-fade-in animate-delay-600 opacity-0-init"
            style={{ animationFillMode: 'forwards' }}
          >
            <p className="text-[10px] text-slate-400 font-medium tracking-wider text-center whitespace-nowrap">
              contact <span className="text-black/40">Huong Diep</span> for the password
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

