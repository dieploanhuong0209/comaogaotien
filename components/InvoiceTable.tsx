import React from 'react';
import { Trash2, Download, FileText, AlertCircle, Clock } from 'lucide-react';
import { LineItem, QualityLevel, Grade } from '../types';

interface InvoiceTableProps {
  items: LineItem[];
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof LineItem, value: any) => void;
  onClear: () => void;
  onExport: () => void;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ items, onRemove, onUpdate, onClear, onExport }) => {
  const totalAmount = items.reduce((sum, item) => sum + item.total, 0);

  const formatCurrency = (val: number) => {
    if (val === 0) return "N/A";
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  if (items.length === 0) {
    return (
      <div className="glass-card p-12 border-white/40 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
        <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mb-6">
          <FileText size={40} className="text-black/20" />
        </div>
        <h3 className="text-xl font-bold text-black mb-3">Chưa có dữ liệu</h3>
        <p className="text-black/40 max-w-xs mx-auto text-sm leading-relaxed">
          Vui lòng nhập tên bài và chọn định dạng chuẩn để hệ thống tính toán nhuận bút.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card border-white/40 overflow-hidden flex flex-col h-full">
      <div className="p-8 border-b border-black/5 flex justify-between items-center bg-white/50 sticky top-0 z-10">
        <h2 className="text-xl font-bold text-black tracking-tight">Bảng kết quả tính nhuận bút</h2>
        <div className="flex gap-4">
          <button 
            onClick={onClear}
            className="px-4 py-2 text-sm text-black/40 hover:text-red-500 transition-colors font-bold uppercase tracking-wider"
          >
            Xóa tất cả
          </button>
          <button 
            onClick={onExport}
            className="px-6 py-2.5 text-sm bg-black text-white hover:bg-black/90 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-black/10 font-bold active:scale-95"
          >
            <Download size={16} />
            Xuất Excel
          </button>
        </div>
      </div>

      <div className="overflow-x-auto flex-1 custom-scrollbar">
        <table className="w-full text-left text-sm">
          <thead className="bg-black/5 text-black/40 font-bold uppercase tracking-widest text-[10px] border-b border-black/5">
            <tr>
              <th className="px-6 py-4 w-10 text-center">#</th>
              <th className="px-6 py-4">Tên bài (Input)</th>
              <th className="px-6 py-4">Định dạng (Mapped)</th>
              <th className="px-6 py-4 w-40">Phân hạng (Edit)</th>
              <th className="px-6 py-4 text-right">Đơn giá</th>
              <th className="px-6 py-4 text-center w-16">SL</th>
              <th className="px-6 py-4 text-center w-16" title="Tỷ lệ phần trăm">%</th>
              <th className="px-6 py-4 text-center w-12" title="Overtime x1.5">OT</th>
              <th className="px-6 py-4 text-right">Thành tiền</th>
              <th className="px-6 py-4 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {items.map((item, index) => (
              <tr key={item.id} className="hover:bg-black/[0.02] transition-colors group">
                <td className="px-6 py-5 text-center text-black/30 font-medium">{index + 1}</td>
                <td className="px-6 py-5">
                  <input 
                    type="text"
                    value={item.inputName}
                    onChange={(e) => onUpdate(item.id, 'inputName', e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 p-0 text-black font-bold placeholder-black/20"
                  />
                </td>
                <td className="px-6 py-5">
                  <div className="text-black/80 font-medium max-w-[200px] truncate" title={item.name}>{item.name}</div>
                  <div className="text-[10px] text-black/30 font-bold uppercase tracking-wider truncate" title={item.category}>{item.category}</div>
                </td>
                <td className="px-6 py-5">
                   <div 
                     className="flex flex-col gap-2 p-1 rounded-xl border border-transparent hover:border-black/5 transition-all"
                     title={`Phân hạng: ${item.quality} - Grade ${item.grade}`}
                   >
                     <select 
                       value={item.quality}
                       onChange={(e) => onUpdate(item.id, 'quality', e.target.value)}
                       title={`Level: ${item.quality}`}
                       className="block w-full rounded-lg border-transparent text-[11px] py-1.5 pl-2 pr-6 bg-black/5 focus:bg-white focus:ring-2 focus:ring-black/5 cursor-pointer font-bold text-black/60 appearance-none"
                     >
                        {Object.values(QualityLevel).map(q => (
                          <option key={q} value={q}>{q}</option>
                        ))}
                     </select>
                     
                     <select 
                       value={item.grade}
                       onChange={(e) => onUpdate(item.id, 'grade', e.target.value)}
                       title={`Grade: ${item.grade}`}
                       className={`block w-full rounded-lg border-transparent text-[11px] py-1.5 pl-2 pr-6 focus:ring-2 focus:ring-opacity-50 cursor-pointer font-black appearance-none
                        ${item.grade === 'A' ? 'bg-brand-200/40 text-brand-900 focus:ring-brand-200' : 
                          item.grade === 'B' ? 'bg-brand-300/40 text-brand-900 focus:ring-brand-300' : 
                          'bg-black/5 text-black/40 focus:ring-black/5'}`}
                     >
                        {Object.values(Grade).map(g => (
                          <option key={g} value={g}>Grade {g}</option>
                        ))}
                     </select>
                   </div>
                </td>
                <td className="px-6 py-5 text-right font-mono text-black/40 text-[11px] font-bold">
                  {item.unitPrice === 0 ? <span className="text-red-500">N/A</span> : formatCurrency(item.unitPrice)}
                </td>
                <td className="px-6 py-5 text-center font-black text-black">
                  {item.quantity}
                </td>
                <td className="px-6 py-5 text-center text-black/60">
                  {item.percentage === 100 ? (
                    <span className="text-black/20 font-medium">100%</span>
                  ) : (
                    <span className="text-black font-black">{item.percentage}%</span>
                  )}
                </td>
                <td className="px-6 py-5 text-center">
                  {item.isOT ? (
                    <div className="flex justify-center">
                       <span className="inline-flex items-center justify-center w-7 h-7 bg-black text-white rounded-lg shadow-lg shadow-black/10" title="Có tính OT (x1.5)">
                        <Clock size={14} strokeWidth={3} />
                      </span>
                    </div>
                  ) : (
                    <span className="text-black/10">-</span>
                  )}
                </td>
                <td className="px-6 py-5 text-right font-mono font-black text-black">
                  {formatCurrency(item.total)}
                </td>
                <td className="px-6 py-5 text-right">
                  <button 
                    onClick={() => onRemove(item.id)}
                    className="p-2 text-black/20 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    title="Xóa dòng này"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-black/[0.02] p-8 border-t border-black/5">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-bold text-black/30 uppercase tracking-widest">Tổng số lượng hạng mục:</span>
          <span className="font-black text-black">{items.reduce((acc, i) => acc + i.quantity, 0)}</span>
        </div>
        <div className="flex justify-between items-end border-t border-black/5 pt-6">
          <div>
            <span className="text-xs font-black text-black/20 uppercase tracking-[0.2em]">Tổng cộng nhuận bút</span>
            <div className="text-[10px] text-black/30 mt-1 font-medium italic">Đã bao gồm OT và tỷ lệ chia sẻ</div>
          </div>
          <span className="text-4xl font-black text-black">{formatCurrency(totalAmount)}</span>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTable;
