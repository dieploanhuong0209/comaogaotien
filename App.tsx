import React, { useState, useEffect } from 'react';
import { Layers, Calculator, HelpCircle, LayoutDashboard, List, FileInput, LogOut } from 'lucide-react';
import CalculatorForm from './components/CalculatorForm';
import InvoiceTable from './components/InvoiceTable';
import Dashboard from './components/Dashboard';
import BulkInputModal from './components/BulkInputModal';
import ConfirmModal from './components/ConfirmModal';
import AlertModal from './components/AlertModal';
import LoginPage from './components/LoginPage';
import { LineItem, RateCardItem, QualityLevel, Grade } from './types';
import { ALL_ITEMS } from './services/mockData';
import { parseBulkInput } from './services/parser';
import * as XLSX from 'xlsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');
  const [items, setItems] = useState<LineItem[]>([]);
  const [activeTab, setActiveTab] = useState<'calculator' | 'dashboard'>('calculator');
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  
  // Modal states
  const [confirmConfig, setConfirmConfig] = useState<{isOpen: boolean, title: string, message: string, onConfirm: () => void} | null>(null);
  const [alertConfig, setAlertConfig] = useState<{isOpen: boolean, title: string, message: string, type: 'success' | 'error' | 'info'} | null>(null);

  useEffect(() => {
    const auth = sessionStorage.getItem('is_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (pass: string) => {
    const envPass = import.meta.env.VITE_APP_PASS || 'HuongDiepp';

    if (pass === envPass) {
      setIsAuthenticated(true);
      sessionStorage.setItem('is_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Mật khẩu không chính xác');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('is_auth');
  };

  // Helper to calculate total based on all factors
  const calculateTotal = (unitPrice: number, quantity: number, percentage: number, isOT: boolean) => {
    const otMultiplier = isOT ? 1.5 : 1;
    const shareMultiplier = percentage / 100;
    return unitPrice * quantity * otMultiplier * shareMultiplier;
  };

  const handleAddItem = (
    rateCardItem: RateCardItem, 
    customName: string,
    quality: QualityLevel, 
    grade: Grade, 
    quantity: number,
    percentage: number,
    isOT: boolean
  ) => {
    // Determine price - fallback to 0 if not defined in map
    const price = rateCardItem.prices[quality]?.[grade] || 
                  rateCardItem.prices[QualityLevel.Standard]?.[Grade.A] || 0;

    const newItem: LineItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      rateCardId: rateCardItem.id,
      inputName: customName,
      name: rateCardItem.name,
      category: rateCardItem.category,
      quality,
      grade,
      quantity,
      percentage,
      isOT,
      unitPrice: price,
      total: calculateTotal(price, quantity, percentage, isOT),
    };

    setItems(prev => [...prev, newItem]);
  };

  const handleUpdateItem = (id: string, field: keyof LineItem, value: any) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item;

      const updatedItem = { ...item, [field]: value };

      // Re-calculate Logic
      // Check if any field affecting price has changed
      if (['quality', 'grade', 'quantity', 'percentage', 'isOT'].includes(field as string)) {
        const rateCardItem = ALL_ITEMS.find(r => r.id === item.rateCardId);
        
        let currentUnitPrice = item.unitPrice;

        // If Quality or Grade changed, fetch new Unit Price
        if (field === 'quality' || field === 'grade') {
            if (rateCardItem) {
                currentUnitPrice = rateCardItem.prices[updatedItem.quality]?.[updatedItem.grade] || 
                                   rateCardItem.prices[QualityLevel.Standard]?.[Grade.A] || 0;
            }
        }
        
        updatedItem.unitPrice = currentUnitPrice;
        updatedItem.total = calculateTotal(
            currentUnitPrice, 
            updatedItem.quantity, 
            updatedItem.percentage, 
            updatedItem.isOT
        );
      }

      return updatedItem;
    }));
  };

  const handleBulkProcess = (text: string) => {
    const parsedItems = parseBulkInput(text, ALL_ITEMS);
    if (parsedItems.length > 0) {
      setItems(prev => [...prev, ...parsedItems]);
      // Switch to calculator tab to see results
      setActiveTab('calculator');
      setAlertConfig({
        isOpen: true,
        title: 'Thành công',
        message: `Đã xử lý và thêm ${parsedItems.length} hạng mục vào danh sách.`,
        type: 'success'
      });
    } else {
      setAlertConfig({
        isOpen: true,
        title: 'Thông báo',
        message: 'Không tìm thấy nội dung hợp lệ nào. Vui lòng kiểm tra lại định dạng đầu vào.',
        type: 'error'
      });
    }
  };

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleClear = () => {
    setConfirmConfig({
      isOpen: true,
      title: 'Xác nhận xóa',
      message: 'Bạn có chắc chắn muốn xóa toàn bộ danh sách? Hành động này không thể hoàn tác.',
      onConfirm: () => {
        setItems([]);
        setConfirmConfig(null);
      }
    });
  };

  const handleExportExcel = () => {
    if (items.length === 0) {
      setAlertConfig({
        isOpen: true,
        title: 'Thông báo',
        message: 'Danh sách trống, không có dữ liệu để xuất.',
        type: 'info'
      });
      return;
    }

    const data = items.map((item, index) => ({
      'STT': index + 1,
      'Tên bài (Input)': item.inputName,
      'Định dạng (Mapped)': item.name,
      'Nhóm': item.category,
      'Level': item.quality,
      'Grade': item.grade,
      'Đơn giá': item.unitPrice,
      'Số lượng': item.quantity,
      'Tỷ lệ (%)': item.percentage,
      'OT (x1.5)': item.isOT ? 'Có' : 'Không',
      'Thành tiền': item.total
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Royalty");
    
    // Auto-size columns
    const colWidths = [
      { wch: 5 },
      { wch: 40 },
      { wch: 30 },
      { wch: 20 },
      { wch: 15 },
      { wch: 10 },
      { wch: 15 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 15 },
    ];
    ws['!cols'] = colWidths;

    XLSX.writeFile(wb, `Hương Diệp_Royalty_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} error={loginError} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-black relative overflow-x-hidden">
      {/* Background Accents */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-200/20 blur-[120px] rounded-full -z-10 animate-pulse"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-300/20 blur-[120px] rounded-full -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <BulkInputModal 
        isOpen={isBulkModalOpen} 
        onClose={() => setIsBulkModalOpen(false)} 
        onProcess={handleBulkProcess}
      />

      {confirmConfig && (
        <ConfirmModal 
          isOpen={confirmConfig.isOpen}
          title={confirmConfig.title}
          message={confirmConfig.message}
          onConfirm={confirmConfig.onConfirm}
          onCancel={() => setConfirmConfig(null)}
          type="danger"
        />
      )}

      {alertConfig && (
        <AlertModal 
          isOpen={alertConfig.isOpen}
          title={alertConfig.title}
          message={alertConfig.message}
          onClose={() => setAlertConfig(null)}
          type={alertConfig.type}
        />
      )}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-black/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-black p-2.5 rounded-xl text-white shadow-lg shadow-black/10">
              <Calculator size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-black leading-none">Cơm áo gạo tiền</h1>
              <span className="text-xs text-black/40 font-medium italic mt-1 block">Bút sa là tiền về túi!</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex bg-black/5 p-1 rounded-xl">
              <button 
                onClick={() => setActiveTab('calculator')}
                className={`px-6 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${activeTab === 'calculator' ? 'bg-white text-black shadow-sm' : 'text-black/50 hover:text-black'}`}
              >
                <List size={16} />
                Tính toán
              </button>
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`px-6 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${activeTab === 'dashboard' ? 'bg-white text-black shadow-sm' : 'text-black/50 hover:text-black'}`}
              >
                <LayoutDashboard size={16} />
                Thống kê
              </button>
            </nav>
            <div className="h-8 w-px bg-black/10 hidden md:block"></div>
            
            <button 
              onClick={() => setIsBulkModalOpen(true)}
              className="px-4 py-2 text-sm font-bold text-black bg-brand-200 hover:bg-brand-200/80 rounded-xl flex items-center gap-2 transition-all active:scale-95"
            >
              <FileInput size={16} />
              Nhập nhanh
            </button>

            <button 
              onClick={handleLogout}
              className="p-2 text-black/20 hover:text-black transition-all rounded-xl hover:bg-black/5"
              title="Đăng xuất"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {activeTab === 'dashboard' && (
           <Dashboard items={items} />
        )}

        <div className={`flex flex-col lg:flex-row gap-8 items-start ${activeTab === 'dashboard' ? 'opacity-50 pointer-events-none filter grayscale' : ''}`}>
          
          {/* Left Column: Form */}
          <div className="w-full lg:w-1/3 space-y-8">
            <div className="lg:sticky lg:top-28">
              <CalculatorForm onAddItem={handleAddItem} />
              
              <div className="mt-8 glass-card p-6 border-brand-200/50 bg-brand-50/30">
                 <h4 className="font-bold text-black text-sm mb-4 flex items-center gap-2">
                   <Layers size={18} className="text-brand-700"/> Nguyên tắc tính giá
                 </h4>
                 <ul className="text-xs text-black/60 space-y-3 list-none">
                   <li className="flex gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0"></span>
                     <span><strong>Dữ liệu:</strong> Sử dụng danh mục 103 định dạng (2024).</span>
                   </li>
                   <li className="flex gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0"></span>
                     <span><strong>Quy trình:</strong> Map tên bài (Input) sang Định dạng chuẩn.</span>
                   </li>
                   <li className="flex gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0"></span>
                     <span><strong>Giá:</strong> Tự động tính theo Level & Grade.</span>
                   </li>
                   <li className="flex gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0"></span>
                     <span><strong>OT:</strong> Nhân 1.5 lần tổng tiền thành phần.</span>
                   </li>
                   <li className="flex gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0"></span>
                     <span><strong>Tỷ lệ (%):</strong> Chia sẻ doanh thu theo phần trăm nhập vào.</span>
                   </li>
                 </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Invoice/Table */}
          <div className="w-full lg:w-2/3 h-full min-h-[500px]">
            <InvoiceTable 
              items={items} 
              onRemove={handleRemoveItem} 
              onUpdate={handleUpdateItem}
              onClear={handleClear}
              onExport={handleExportExcel}
            />
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-black/5 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row justify-between items-center text-sm text-black/40">
          <p className="font-medium">Bản quyền thuộc về Hương Diệp</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
             <span className="px-3 py-1 bg-black/5 rounded-full text-xs font-bold">V3.4.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
