import React, { useState, useEffect } from 'react';
import { Plus, Info, Clock, Users } from 'lucide-react';
import { CATEGORIES } from '../services/mockData';
import { Grade, QualityLevel, RateCardItem } from '../types';

interface CalculatorFormProps {
  onAddItem: (item: RateCardItem, customName: string, quality: QualityLevel, grade: Grade, quantity: number, percentage: number, isOT: boolean) => void;
}

const CalculatorForm: React.FC<CalculatorFormProps> = ({ onAddItem }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORIES[0].name);
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [customName, setCustomName] = useState<string>('');
  const [quality, setQuality] = useState<QualityLevel>(QualityLevel.Standard);
  const [grade, setGrade] = useState<Grade>(Grade.A);
  const [quantity, setQuantity] = useState<number>(1);
  const [percentage, setPercentage] = useState<number>(100);
  const [isOT, setIsOT] = useState<boolean>(false);
  const [currentPrice, setCurrentPrice] = useState<number>(0);

  // Filter items based on category
  const activeItems = CATEGORIES.find(c => c.name === selectedCategory)?.items || [];

  // Set default item when category changes
  useEffect(() => {
    if (activeItems.length > 0) {
      setSelectedItemId(activeItems[0].id);
      // Removed setCustomName('') so the input persists when changing categories
    }
  }, [selectedCategory, activeItems]);

  // Determine current price based on selection
  useEffect(() => {
    const item = activeItems.find(i => i.id === selectedItemId);
    if (item && item.prices[quality] && item.prices[quality]![grade]) {
      setCurrentPrice(item.prices[quality]![grade]!);
    } else {
      // Fallback logic if price not explicitly defined for that level/grade
      const standardPrice = item?.prices[QualityLevel.Standard]?.[Grade.A];
      setCurrentPrice(standardPrice || 0);
    }
  }, [selectedItemId, quality, grade, activeItems]);

  const handleAdd = () => {
    const item = activeItems.find(i => i.id === selectedItemId);
    if (item) {
      onAddItem(item, customName || item.name, quality, grade, quantity, percentage, isOT);
      // Reset critical fields for next entry
      setQuantity(1);
      setCustomName('');
      setPercentage(100);
      setIsOT(false);
    }
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  
  // Calculate preview total
  const previewTotal = currentPrice * quantity * (percentage / 100) * (isOT ? 1.5 : 1);

  return (
    <div className="glass-card p-8 border-white/40">
      <div className="flex items-center gap-3 mb-8 border-b border-black/5 pb-6">
        <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center shadow-lg shadow-black/10">
          <Plus size={24} />
        </div>
        <h2 className="text-xl font-bold text-black tracking-tight">Thêm bài / Hạng mục</h2>
      </div>

      <div className="space-y-6">
        
        {/* User Input Name */}
        <div>
          <label className="block text-xs font-bold text-black/40 uppercase tracking-widest mb-2 ml-1">Tên bài (Input)</label>
          <input 
            type="text" 
            placeholder="VD: Bài PR cho nhãn hàng X..."
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="w-full px-4 py-3 bg-black/5 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black/10 transition-all outline-none text-sm font-medium"
          />
        </div>

        {/* Category Selection */}
        <div>
          <label className="block text-xs font-bold text-black/40 uppercase tracking-widest mb-2 ml-1">Nhóm định dạng (Mapping)</label>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-3 bg-black/5 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black/10 transition-all outline-none text-sm font-medium appearance-none cursor-pointer"
          >
            {CATEGORIES.map(cat => (
              <option key={cat.name} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Item Selection (Mapped Format) */}
        <div>
          <label className="block text-xs font-bold text-black/40 uppercase tracking-widest mb-2 ml-1">Định dạng chuẩn</label>
          <select 
            value={selectedItemId}
            onChange={(e) => setSelectedItemId(e.target.value)}
            className="w-full px-4 py-3 bg-black/5 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black/10 transition-all outline-none text-sm font-medium appearance-none cursor-pointer"
          >
            {activeItems.map(item => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        </div>

        {/* Quality & Grade Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-black/40 uppercase tracking-widest mb-2 ml-1">Level</label>
            <select 
              value={quality}
              onChange={(e) => setQuality(e.target.value as QualityLevel)}
              className="w-full px-4 py-3 bg-black/5 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black/10 transition-all outline-none text-sm font-medium appearance-none cursor-pointer"
            >
              {Object.values(QualityLevel).map(q => (
                <option key={q} value={q}>{q}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-black/40 uppercase tracking-widest mb-2 ml-1">Grade</label>
            <div className="flex bg-black/5 p-1 rounded-xl h-[46px]">
              {Object.values(Grade).map(g => (
                <button
                  key={g}
                  onClick={() => setGrade(g)}
                  className={`flex-1 py-1 text-sm font-bold rounded-lg transition-all ${
                    grade === g 
                      ? 'bg-white text-black shadow-sm' 
                      : 'text-black/30 hover:text-black/50'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quantity, Percentage, OT */}
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-1">
            <label className="block text-xs font-bold text-black/40 uppercase tracking-widest mb-2 ml-1">SL</label>
            <input 
              type="number" 
              min="0.5"
              step="0.5"
              value={quantity}
              onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 bg-black/5 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black/10 transition-all outline-none text-sm font-medium"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-bold text-black/40 uppercase tracking-widest mb-2 ml-1 flex items-center gap-1">
              <Users size={14}/> %
            </label>
            <input 
              type="number" 
              min="1"
              max="100"
              value={percentage}
              onChange={(e) => setPercentage(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 bg-black/5 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black/10 transition-all outline-none text-sm font-medium"
            />
          </div>
           <div className="col-span-1 flex flex-col justify-end">
            <label className="flex items-center gap-2 p-3 bg-black/5 rounded-xl cursor-pointer hover:bg-black/10 transition-all h-[46px]">
              <input 
                type="checkbox" 
                checked={isOT}
                onChange={(e) => setIsOT(e.target.checked)}
                className="w-4 h-4 accent-black rounded focus:ring-black"
              />
              <span className="text-xs font-bold text-black flex items-center gap-1">
                 OT <span className="text-[10px] text-black/30 font-normal">x1.5</span>
              </span>
            </label>
          </div>
        </div>

        {/* Total Preview */}
        <div className="bg-brand-200/20 p-6 rounded-2xl border border-brand-200/30 flex justify-between items-center">
            <div>
              <span className="text-[10px] text-black/40 font-bold block uppercase tracking-wider mb-1">Đơn giá gốc</span>
              <span className="text-base font-bold text-black/60">{formatCurrency(currentPrice)}</span>
            </div>
             <div className="text-right">
              <span className="text-[10px] text-black/40 font-bold block uppercase tracking-wider mb-1">Thành tiền</span>
              <span className="text-2xl font-black text-black">{formatCurrency(previewTotal)}</span>
            </div>
        </div>

        <button 
          onClick={handleAdd}
          className="w-full py-4 px-6 bg-black hover:bg-black/90 text-white font-bold rounded-xl shadow-xl shadow-black/10 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
        >
          <Plus size={20} />
          Thêm vào danh sách
        </button>
      </div>
    </div>
  );
};

export default CalculatorForm;