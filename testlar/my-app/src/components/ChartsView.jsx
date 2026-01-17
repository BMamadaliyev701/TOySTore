import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, PieChart as PieChartIcon } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat("uz-UZ", {
        style: "currency",
        currency: "UZS",
        minimumFractionDigits: 0,
    }).format(amount);
};

export default function ChartsView({ transactions, darkMode }) {
    const [period, setPeriod] = useState('monthly');
    const [currentDate, setCurrentDate] = useState(new Date());

    const filteredData = useMemo(() => {
        const filtered = transactions.filter(t => {
            const tDate = new Date(t.date);
            if (period === 'daily') {
                return tDate.toDateString() === currentDate.toDateString();
            } else {
                return tDate.getMonth() === currentDate.getMonth() && tDate.getFullYear() === currentDate.getFullYear();
            }
        });

        const income = Math.abs(filtered.filter(t => t.amount > 0).reduce((a, b) => a + b.amount, 0));
        const expense = Math.abs(filtered.filter(t => t.amount < 0).reduce((a, b) => a + b.amount, 0));

        return [
            { name: 'Kirim', value: income, color: '#22c55e' },
            { name: 'Chiqim', value: expense, color: '#ef4444' }
        ].filter(d => d.value > 0);
    }, [transactions, period, currentDate]);

    const changeDate = (offset) => {
        const newDate = new Date(currentDate);
        if (period === 'daily') {
            newDate.setDate(newDate.getDate() + offset);
        } else {
            newDate.setMonth(newDate.getMonth() + offset);
        }
        setCurrentDate(newDate);
    };

    return (
        <div className="animate-in fade-in duration-500 pb-24">
            <div className={`p-6 rounded-[32px] ${darkMode ? "bg-gray-800/50 border border-gray-700" : "bg-white border border-gray-100"} shadow-xl`}>
                <div className="flex bg-gray-100/50 dark:bg-gray-700/50 p-1 rounded-2xl mb-6">
                    <button onClick={() => setPeriod('daily')} className={`flex-1 py-2 text-xs rounded-xl font-black transition-all ${period === 'daily' ? "bg-blue-500 text-white shadow-sm" : "opacity-40"}`}>KUNLIK</button>
                    <button onClick={() => setPeriod('monthly')} className={`flex-1 py-2 text-xs rounded-xl font-black transition-all ${period === 'monthly' ? "bg-blue-500 text-white shadow-sm" : "opacity-40"}`}>OYLIK</button>
                </div>

                <div className="flex items-center justify-between mb-6">
                    <button onClick={() => changeDate(-1)} className="p-1 opacity-40 hover:opacity-100 transition-opacity"><ChevronLeft size={24} /></button>
                    <span className="text-sm font-black uppercase tracking-tight">
                        {period === 'daily' ? currentDate.toLocaleDateString("uz-UZ", { day: 'numeric', month: 'long' }) : currentDate.toLocaleDateString("uz-UZ", { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={() => changeDate(1)} className="p-1 opacity-40 hover:opacity-100 transition-opacity"><ChevronRight size={24} /></button>
                </div>

                <div className="h-64 w-full">
                    {filteredData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={filteredData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {filteredData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', background: darkMode ? '#1f2937' : '#fff', fontSize: '12px' }}
                                    formatter={(value) => formatCurrency(value)}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full opacity-10">
                            <PieChartIcon size={48} className="mb-2" />
                            <p className="text-[10px] font-black">MA'LUMOT YO'Q</p>
                        </div>
                    )}
                </div>

                <div className="mt-4 space-y-2">
                    {filteredData.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/50 dark:bg-gray-700/30">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-xs font-bold">{item.name}</span>
                            </div>
                            <span className="text-xs font-black">{formatCurrency(item.value)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
