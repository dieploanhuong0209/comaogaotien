import React from 'react';
import { Info, X, CheckCircle, AlertCircle } from 'lucide-react';

interface AlertModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
  type?: 'success' | 'error' | 'info';
}

const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  title,
  message,
  onClose,
  type = 'info'
}) => {
  if (!isOpen) return null;

  const icons = {
    success: <CheckCircle size={28} className="text-black" />,
    error: <AlertCircle size={28} className="text-red-500" />,
    info: <Info size={28} className="text-black" />
  };

  const bgColors = {
    success: 'bg-brand-200/40',
    error: 'bg-red-50',
    info: 'bg-black/5'
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-card border-white/60 shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 bg-white/90">
        <div className="p-10 flex flex-col items-center text-center">
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-black/5 ${bgColors[type]}`}>
            {icons[type]}
          </div>
          <h3 className="text-xl font-black text-black mb-3 uppercase tracking-widest text-sm">{title}</h3>
          <p className="text-black/40 text-xs font-medium leading-relaxed mb-8">
            {message}
          </p>
          <button 
            onClick={onClose}
            className="w-full py-4 bg-black hover:bg-black/90 text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-xl shadow-black/10 transition-all active:scale-95"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
