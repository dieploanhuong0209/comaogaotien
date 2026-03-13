import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { LineItem } from '../types';

interface DashboardProps {
  items: LineItem[];
}

const COLORS = ['#000000', '#BBECCA', '#B7E6DC', '#4ade80', '#22c55e', '#16a34a', '#15803d', '#14532d'];

const Dashboard: React.FC<DashboardProps> = ({ items }) => {
  if (items.length === 0) return null;

  const totalRevenue = items.reduce((sum, item) => sum + item.total, 0);

  // Helper to calculate percentage
  const toPercent = (value: number) => {
    if (totalRevenue === 0) return 0;
    return parseFloat(((value / totalRevenue) * 100).toFixed(1));
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  // Aggregate by Category
  const rawDataByCategory = items.reduce((acc, item) => {
    const existing = acc.find(d => d.name === item.category);
    if (existing) {
      existing.rawValue += item.total;
    } else {
      acc.push({ name: item.category, rawValue: item.total });
    }
    return acc;
  }, [] as { name: string; rawValue: number }[]);

  const dataByCategory = rawDataByCategory.map(d => ({
    name: d.name,
    value: toPercent(d.rawValue), // Convert to %
    amount: d.rawValue
  })).sort((a, b) => b.value - a.value);

  // Aggregate by Grade
  const rawDataByGrade = items.reduce((acc, item) => {
     const existing = acc.find(d => d.name === `Grade ${item.grade}`);
    if (existing) {
      existing.rawValue += item.total;
    } else {
      acc.push({ name: `Grade ${item.grade}`, rawValue: item.total });
    }
    return acc;
  }, [] as { name: string; rawValue: number }[]);

  const dataByGrade = rawDataByGrade.map(d => ({
    name: d.name,
    value: toPercent(d.rawValue), // Convert to %
    amount: d.rawValue
  })).sort((a, b) => b.name.localeCompare(a.name));

  // Aggregate by Item Name (Top 5)
  const rawDataByItem = items.reduce((acc, item) => {
    const existing = acc.find(d => d.name === item.name);
    if (existing) {
      existing.rawValue += item.total;
    } else {
      acc.push({ name: item.name, rawValue: item.total });
    }
    return acc;
  }, [] as { name: string; rawValue: number }[]);

  const dataByItem = rawDataByItem
    .sort((a, b) => b.rawValue - a.rawValue)
    .slice(0, 5)
    .map(d => ({
      name: d.name,
      value: toPercent(d.rawValue),
      amount: d.rawValue
    }));


  const formatPercent = (val: number) => `${val}%`;

  // Custom Tooltip to show both % and Value
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-card p-4 border-white/60 shadow-xl text-xs">
          <p className="font-black text-black mb-1">{data.name}</p>
          <div className="flex items-center gap-2">
            <span className="text-black font-black text-lg">{data.value}%</span>
            <span className="text-black/30 font-medium">
              {formatCurrency(data.amount)}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 mb-12">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-8 border-white/40 bg-brand-200/10">
          <p className="text-[10px] font-black text-black/30 uppercase tracking-[0.2em] mb-2">Tổng nhuận bút</p>
          <p className="text-3xl font-black text-black">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="glass-card p-8 border-white/40 bg-brand-300/10">
          <p className="text-[10px] font-black text-black/30 uppercase tracking-[0.2em] mb-2">Tổng số lượng</p>
          <p className="text-3xl font-black text-black">{items.reduce((acc, i) => acc + i.quantity, 0)} <span className="text-sm font-bold text-black/30">hạng mục</span></p>
        </div>
        <div className="glass-card p-8 border-white/40 bg-black/[0.02]">
          <p className="text-[10px] font-black text-black/30 uppercase tracking-[0.2em] mb-2">Đơn giá TB</p>
          <p className="text-3xl font-black text-black">
            {formatCurrency(Math.round(totalRevenue / items.reduce((acc, i) => acc + i.quantity, 0)))}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Category Distribution */}
      <div className="glass-card p-8 border-white/40">
        <h3 className="text-[10px] font-black text-black/30 uppercase tracking-[0.2em] mb-8">Tỷ trọng theo nhóm (%)</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dataByCategory}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={90}
                paddingAngle={8}
                dataKey="value"
                stroke="none"
              >
                {dataByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grade Distribution */}
       <div className="glass-card p-8 border-white/40">
        <h3 className="text-[10px] font-black text-black/30 uppercase tracking-[0.2em] mb-8">Tỷ trọng theo Grade (%)</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dataByGrade}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(0,0,0,0.05)" />
              <XAxis type="number" tickFormatter={formatPercent} domain={[0, 'auto']} tick={{fontSize: 10, fontWeight: 'bold', fill: 'rgba(0,0,0,0.2)'}} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 10, fontWeight: 'bold', fill: 'rgba(0,0,0,0.4)'}} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(0,0,0,0.02)'}} />
              <Bar dataKey="value" fill="#000000" radius={[0, 8, 8, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Items */}
      <div className="glass-card p-8 border-white/40 lg:col-span-2">
        <h3 className="text-[10px] font-black text-black/30 uppercase tracking-[0.2em] mb-8">Top 5 Định dạng theo doanh thu</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dataByItem}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="name" tick={{fontSize: 10, fontWeight: 'bold', fill: 'rgba(0,0,0,0.4)'}} interval={0} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={formatPercent} tick={{fontSize: 10, fontWeight: 'bold', fill: 'rgba(0,0,0,0.2)'}} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(0,0,0,0.02)'}} />
              <Bar dataKey="value" fill="#BBECCA" radius={[8, 8, 0, 0]} barSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;