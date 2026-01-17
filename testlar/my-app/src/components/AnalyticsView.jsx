import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Wallet, Trash2 } from "lucide-react";

const formatCurrency = (amount) => {
    return new Intl.NumberFormat("uz-UZ", {
        style: "currency",
        currency: "UZS",
        minimumFractionDigits: 0,
    }).format(amount);
};

const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString("uz-UZ", {
        month: "long",
        day: "numeric",
    });
};

export default function AnalyticsView({ transactions, darkMode, onDelete }) {
    const [period, setPeriod] = useState('daily');
    const [currentDate, setCurrentDate] = useState(new Date());

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const tDate = new Date(t.date);
            if (period === 'daily') {
                return tDate.toDateString() === currentDate.toDateString();
            } else {
                return tDate.getMonth() === currentDate.getMonth() && tDate.getFullYear() === currentDate.getFullYear();
            }
        });
    }, [transactions, period, currentDate]);

    const stats = useMemo(() => {
        const income = filteredTransactions.filter(t => t.amount > 0).reduce((a, b) => a + b.amount, 0);
        const expense = filteredTransactions.filter(t => t.amount < 0).reduce((a, b) => a + b.amount, 0);
        return { income, expense: Math.abs(expense), balance: income + expense };
    }, [filteredTransactions]);

    const changeDate = (offset) => {
        const newDate = new Date(currentDate);
        if (period === 'daily') {
            newDate.setDate(newDate.getDate() + offset);
        } else {
            newDate.setMonth(newDate.getMonth() + offset);
        }
        setCurrentDate(newDate);
    };

    const periodLabel = period === 'daily'
        ? currentDate.toLocaleDateString("uz-UZ", { day: 'numeric', month: 'long' })
        : currentDate.toLocaleDateString("uz-UZ", { month: 'long', year: 'numeric' });

    return (
        <div className="space-y-6 pb-24 animate-in fade-in duration-500">
            <div className={`p-5 rounded-[32px] ${darkMode ? "bg-gray-800/50 border border-gray-700" : "bg-white border border-gray-100"} shadow-xl`}>
                <div className="flex bg-gray-100/50 dark:bg-gray-700/50 p-1 rounded-2xl mb-5">
                    <button onClick={() => setPeriod('daily')} className={`flex-1 py-2 text-xs rounded-xl font-black transition-all ${period === 'daily' ? "bg-white dark:bg-gray-600 shadow-sm" : "opacity-40"}`}>KUNLIK</button>
                    <button onClick={() => setPeriod('monthly')} className={`flex-1 py-2 text-xs rounded-xl font-black transition-all ${period === 'monthly' ? "bg-white dark:bg-gray-600 shadow-sm" : "opacity-40"}`}>OYLIK</button>
                </div>

                <div className="flex items-center justify-between mb-6">
                    <button onClick={() => changeDate(-1)} className="p-1 opacity-40 hover:opacity-100 transition-opacity"><ChevronLeft size={24} /></button>
                    <span className="text-sm font-black uppercase tracking-tight">{periodLabel}</span>
                    <button onClick={() => changeDate(1)} className="p-1 opacity-40 hover:opacity-100 transition-opacity"><ChevronRight size={24} /></button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-3 rounded-2xl bg-green-500/10 text-green-600">
                        <p className="text-[8px] font-black uppercase mb-1">Kirim</p>
                        <p className="text-[10px] font-black">{formatCurrency(stats.income)}</p>
                    </div>
                    <div className="text-center p-3 rounded-2xl bg-red-500/10 text-red-600">
                        <p className="text-[8px] font-black uppercase mb-1">Chiqim</p>
                        <p className="text-[10px] font-black">{formatCurrency(stats.expense)}</p>
                    </div>
                    <div className="text-center p-3 rounded-2xl bg-blue-500/10 text-blue-600">
                        <p className="text-[8px] font-black uppercase mb-1">Balans</p>
                        <p className="text-[10px] font-black">{formatCurrency(stats.balance)}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                {filteredTransactions.length === 0 ? (
                    <div className="text-center py-10 opacity-20">
                        <Wallet size={48} className="mx-auto mb-2" />
                        <p className="text-xs font-black">MA'LUMOT YO'Q</p>
                    </div>
                ) : (
                    filteredTransactions.map(t => (
                        <div key={t.id} className={`p-4 rounded-2xl flex items-center justify-between shadow-sm border border-gray-100 dark:border-gray-800 ${darkMode ? "bg-gray-800/30" : "bg-white"}`}>
                            <div className="flex-1 min-w-0 pr-3">
                                <p className="font-bold text-sm truncate">{t.text}</p>
                                <p className="text-[10px] opacity-40 font-black uppercase">{formatDate(t.date)}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`font-black text-sm ${t.amount > 0 ? "text-green-500" : "text-red-500"}`}>
                                    {t.amount > 0 ? "+" : ""}{formatCurrency(t.amount)}
                                </span>
                                <button onClick={() => onDelete(t.id)} className="p-2 opacity-20 hover:opacity-100 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
