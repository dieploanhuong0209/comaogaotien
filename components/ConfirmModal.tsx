import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  type = 'warning'
}) => {
  if (!isOpen) return null;

  const colors = {
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    warning: 'bg-black hover:bg-black/90 text-white',
    info: 'bg-black hover:bg-black/90 text-white'
  };

  const iconColors = {
    danger: 'text-red-500 bg-red-50',
    warning: 'text-black bg-black/5',
    info: 'text-black bg-black/5'
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-card border-white/60 shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 bg-white/90">
        <div className="flex items-center justify-between p-6 border-b border-black/5">
          <h3 className="font-black text-black flex items-center gap-3 uppercase tracking-widest text-sm">
            <div className={`p-2 rounded-xl ${iconColors[type]}`}>
              <AlertTriangle size={20} />
            </div>
            {title}
          </h3>
          <button onClick={onCancel} className="text-black/20 hover:text-black transition-all p-2 rounded-xl hover:bg-black/5">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-8">
          <p className="text-black/60 font-medium leading-relaxed">
            {message}
          </p>
        </div>

        <div className="p-6 bg-black/[0.02] flex justify-end gap-4">
          <button 
            onClick={onCancel}
            className="px-6 py-2.5 text-black/40 hover:text-black font-bold uppercase tracking-widest text-xs transition-all"
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm}
            className={`px-8 py-2.5 font-black uppercase tracking-widest text-xs rounded-xl shadow-xl shadow-black/10 transition-all active:scale-95 ${colors[type]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
