import React, { useState } from 'react';
import { X, Play, FileText, AlertTriangle } from 'lucide-react';

interface BulkInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProcess: (text: string) => void;
}

const BulkInputModal: React.FC<BulkInputModalProps> = ({ isOpen, onClose, onProcess }) => {
  const [text, setText] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-card border-white/60 shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] bg-white/90">
        <div className="flex items-center justify-between p-8 border-b border-black/5">
          <h3 className="text-sm font-black text-black flex items-center gap-3 uppercase tracking-[0.2em]">
            <FileText className="text-black" size={20} />
            Nhập nhanh (Chế độ Báo cáo)
          </h3>
          <button onClick={onClose} className="text-black/20 hover:text-black transition-all bg-black/5 p-2 rounded-xl hover:bg-black/10">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-8 overflow-y-auto flex-1">
          <div className="bg-brand-200/20 border border-brand-200/40 rounded-2xl p-6 mb-8 text-xs text-black/60">
            <p className="font-black mb-3 flex items-center gap-2 uppercase tracking-widest text-black"><AlertTriangle size={16}/> Hướng dẫn xử lý:</p>
            <ul className="list-disc pl-5 space-y-2 opacity-90 font-medium">
              <li>Copy danh sách công việc từ file Excel, chat hoặc email và dán vào bên dưới.</li>
              <li>Hệ thống tự động nhận diện: <strong>Tên bài</strong>, <strong>Hạng (A/B/C)</strong>, <strong>Loại (Simple/Standard...)</strong> và <strong>Số lượng</strong>.</li>
              <li>Các dòng trùng loại sẽ được <strong>tự động gộp nhóm</strong>.</li>
              <li>Ví dụ: <em>"- 2 bài PR hạng A"</em>, <em>"Kịch bản tiktok x3"</em>, <em>"Post social: 5 cái (Grade B)"</em></li>
            </ul>
          </div>

          <textarea
            className="w-full h-64 p-6 border border-black/5 rounded-2xl focus:ring-4 focus:ring-brand-200/50 focus:border-brand-200 bg-white/50 font-mono text-xs leading-relaxed transition-all outline-none"
            placeholder="- 2 bài PR hạng A&#10;- 1 Kịch bản tiktok&#10;- Post social thường: 5 cái (Grade B)&#10;- Minigame x1 (Special)..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className="p-8 border-t border-black/5 bg-black/[0.02] rounded-b-xl flex justify-end gap-4">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 text-black/40 hover:text-black font-bold uppercase tracking-widest text-xs transition-all"
          >
            Hủy bỏ
          </button>
          <button 
            onClick={() => { onProcess(text); onClose(); setText(''); }}
            className="px-8 py-3 bg-black hover:bg-black/90 text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-xl shadow-black/10 flex items-center gap-3 transition-all active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed"
            disabled={!text.trim()}
          >
            <Play size={18} />
            Xử lý & Gộp nhóm
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkInputModal;
