import React, { useState, useEffect, useMemo } from "react";
import {
    PlusCircle,
    MinusCircle,
    BarChart3,
    PieChart as PieChartIcon,
    Sun,
    Moon,
    Wallet,
    Calendar
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

import DashboardCard from "./components/DashboardCard";
import TransactionForm from "./components/TransactionForm";
import AnalyticsView from "./components/AnalyticsView";

// --- Yordamchi Funksiyalar ---
const formatCurrency = (amount) => {
    return new Intl.NumberFormat("uz-UZ", {
        style: "currency",
        currency: "UZS",
        minimumFractionDigits: 0,
    }).format(amount);
};

const isToday = (dateString) => {
    const today = new Date();
    const date = new Date(dateString);
    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
};

const formatDateShort = (isoString) => {
    return new Date(isoString).toLocaleTimeString("uz-UZ", {
        hour: '2-digit',
        minute: '2-digit',
    });
};

export default function App() {
    const [view, setView] = useState("dashboard");
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
    const [transactions, setTransactions] = useState(() => {
        const saved = localStorage.getItem("transactions");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("darkMode", darkMode);
        if (darkMode) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    }, [darkMode]);

    useEffect(() => {
        localStorage.setItem("transactions", JSON.stringify(transactions));
    }, [transactions]);

    const addTransaction = (t) => setTransactions([t, ...transactions]);
    const deleteTransaction = (id) => setTransactions(transactions.filter(t => t.id !== id));

    const totalBalance = transactions.reduce((acc, t) => acc + t.amount, 0);

    // Dashboard uchun faqat bugungi ma'lumotlar
    const todayTransactions = useMemo(() => {
        return transactions.filter(t => isToday(t.date));
    }, [transactions]);

    const chartData = useMemo(() => {
        const income = Math.abs(todayTransactions.filter(t => t.amount > 0).reduce((a, b) => a + b.amount, 0));
        const expense = Math.abs(todayTransactions.filter(t => t.amount < 0).reduce((a, b) => a + b.amount, 0));
        return [
            { name: 'Kirim', value: income, color: '#22c55e' },
            { name: 'Chiqim', value: expense, color: '#ef4444' }
        ].filter(d => d.value > 0);
    }, [todayTransactions]);

    return (
        <div className={`min-h-screen flex flex-col transition-colors duration-500 font-sans selection:bg-blue-500 selection:text-white ${darkMode ? "bg-[#020617] text-gray-100" : "bg-slate-300 text-gray-900"}`}>

            {/* Header */}
            <div className={`max-w-md mx-auto w-full px-6 pt-12 pb-6 flex justify-between items-center bg-transparent z-10`}>
                <button 
                    onClick={() => setView("dashboard")}
                    className="flex items-center gap-3 group active:scale-95 transition-transform"
                >
                    <div className="bg-blue-600 p-3 rounded-2xl shadow-xl shadow-blue-500/30 group-hover:bg-blue-500 transition-colors">
                        <Wallet className="text-white" size={28} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tight">Mening Moliya</h1>
                        <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Bosh sahifa</p>
                    </div>
                </button>
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`p-4 rounded-2xl border-2 transition-all active:scale-90 ${darkMode ? "bg-gray-800 border-gray-700 text-yellow-400" : "bg-white border-gray-100 text-gray-800 shadow-lg"}`}
                >
                    {darkMode ? <Sun size={24} /> : <Moon size={24} />}
                </button>
            </div>

            {/* Main Content Area - Top Part */}
            <main className="flex-1 max-w-md mx-auto w-full px-6 overflow-y-auto pb-32">
                <div className="relative">
                    {view === "dashboard" && (
                        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 mt-4 space-y-6">
                            <div className={`p-8 rounded-[40px] shadow-2xl relative overflow-hidden group ${darkMode ? "bg-gradient-to-br from-blue-700 to-indigo-900" : "bg-blue-600"} text-white`}>
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Wallet size={140} />
                                </div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 opacity-70">Umumiy Balans</h3>
                                <p className="text-5xl font-black mb-1 tracking-tight">
                                    {formatCurrency(totalBalance)}
                                </p>
                                <div className="mt-4 flex items-center gap-2 opacity-60 text-[10px] font-bold uppercase trekking-widest">
                                    <Calendar size={12} />
                                    <span>{new Date().toLocaleDateString("uz-UZ", { day: 'numeric', month: 'long' })}</span>
                                </div>
                            </div>

                            {/* Today's Stats Chart */}
                            <div className={`p-6 rounded-[40px] shadow-xl ${darkMode ? "bg-gray-900/50 border border-gray-800" : "bg-white"} flex flex-col items-center`}>
                                <div className="w-full flex justify-between items-center mb-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40">Bugungi Statistika</h4>
                                    <span className="text-[8px] bg-blue-500/10 text-blue-500 px-2 py-1 rounded-full font-black uppercase italic">LIVE</span>
                                </div>
                                <div className="h-48 w-full">
                                    {chartData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={chartData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={45}
                                                    outerRadius={65}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {chartData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{ borderRadius: '12px', border: 'none', background: darkMode ? '#1e293b' : '#fff', fontSize: '10px', fontWeight: 'bold' }}
                                                    formatter={(value) => formatCurrency(value)}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full opacity-10">
                                            <PieChartIcon size={40} />
                                            <p className="text-[8px] font-black mt-2 uppercase">Bugun amallar yo'q</p>
                                        </div>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-4 w-full mt-4">
                                    <div className={`flex flex-col p-3 rounded-2xl ${darkMode ? 'bg-gray-800/50' : 'bg-slate-50'}`}>
                                        <span className="text-[8px] font-black uppercase opacity-40 mb-1">Kirim</span>
                                        <span className="text-xs font-black text-green-500">{formatCurrency(chartData.find(d => d.name === 'Kirim')?.value || 0)}</span>
                                    </div>
                                    <div className={`flex flex-col p-3 rounded-2xl ${darkMode ? 'bg-gray-800/50' : 'bg-slate-50'}`}>
                                        <span className="text-[8px] font-black uppercase opacity-40 mb-1">Chiqim</span>
                                        <span className="text-xs font-black text-red-500">{formatCurrency(chartData.find(d => d.name === 'Chiqim')?.value || 0)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Today's Activities List */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-4">Bugungi amallar</h4>
                                {todayTransactions.length === 0 ? (
                                    <div className={`p-8 rounded-[30px] border-2 border-dashed ${darkMode ? 'border-gray-800 opacity-20' : 'border-slate-400 opacity-30'} text-center`}>
                                        <p className="text-[10px] font-black uppercase">Hali hech narsa yo'q</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {todayTransactions.slice(0, 5).map(t => (
                                            <div key={t.id} className={`p-4 rounded-[25px] flex items-center justify-between shadow-sm border ${darkMode ? "bg-gray-900/40 border-gray-800" : "bg-white border-slate-200"}`}>
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-xl ${t.amount > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                                        {t.amount > 0 ? <PlusCircle size={16} /> : <MinusCircle size={16} />}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm leading-tight">{t.text}</p>
                                                        <p className="text-[8px] font-black opacity-30 uppercase">{formatDateShort(t.date)}</p>
                                                    </div>
                                                </div>
                                                <span className={`font-black text-sm ${t.amount > 0 ? "text-green-500" : "text-red-500"}`}>
                                                    {t.amount > 0 ? "+" : ""}{formatCurrency(t.amount)}
                                                </span>
                                            </div>
                                        ))}
                                        {todayTransactions.length > 5 && (
                                            <button 
                                                onClick={() => setView("tahlil")}
                                                className="w-full py-2 text-[10px] font-black uppercase opacity-40 hover:opacity-100 transition-opacity"
                                            >
                                                Barchasini ko'rish
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {view === "kirim" && <TransactionForm type="kirim" onAdd={addTransaction} onBack={() => setView("dashboard")} darkMode={darkMode} />}
                    {view === "chiqim" && <TransactionForm type="chiqim" onAdd={addTransaction} onBack={() => setView("dashboard")} darkMode={darkMode} />}
                    {view === "tahlil" && <AnalyticsView transactions={transactions} onDelete={deleteTransaction} darkMode={darkMode} />}
                </div>
            </main>

            {/* Navigation Menu - Bottom Part */}
            <div className="fixed bottom-0 left-0 right-0 p-4 tab-bar z-20">
                <div className={`max-w-md mx-auto grid grid-cols-4 gap-3 p-1`}>
                    <DashboardCard
                        title="KIRIM"
                        icon={PlusCircle}
                        color="bg-green-500"
                        onClick={() => setView("kirim")}
                        isActive={view === "kirim"}
                    />
                    <DashboardCard
                        title="CHIQIM"
                        icon={MinusCircle}
                        color="bg-red-500"
                        onClick={() => setView("chiqim")}
                        isActive={view === "chiqim"}
                    />
                    <DashboardCard
                        title="TAHLIL"
                        icon={BarChart3}
                        color="bg-amber-500"
                        onClick={() => setView("tahlil")}
                        isActive={view === "tahlil"}
                    />
                    <DashboardCard
                        title="ASOSIY"
                        icon={PieChartIcon}
                        color="bg-slate-700"
                        onClick={() => setView("dashboard")}
                        isActive={view === "dashboard"}
                    />
                </div>
            </div>
        </div>
    );
}
