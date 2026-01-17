import React, { useState } from "react";
import { PlusCircle, MinusCircle, ArrowLeft } from "lucide-react";

function ViewHeader({ title, onBack, darkMode }) {
    return (
        <div className="flex items-center gap-4 mb-6">
            <button
                onClick={onBack}
                className={`p-2 rounded-full ${darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100"} shadow-sm transition-colors`}
            >
                <ArrowLeft size={20} />
            </button>
            <h2 className="text-xl font-black tracking-tight">{title}</h2>
        </div>
    );
}

export default function TransactionForm({ type, onAdd, onBack, darkMode }) {
    const [text, setText] = useState("");
    const [amount, setAmount] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text || !amount) return;
        onAdd({
            id: Date.now(),
            text,
            amount: type === "chiqim" ? -Math.abs(+amount) : Math.abs(+amount),
            date: new Date().toISOString(),
        });
        onBack();
    };

    const isExpense = type === "chiqim";

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ViewHeader title={isExpense ? "Chiqim yozish" : "Kirim yozish"} onBack={onBack} darkMode={darkMode} />
            <form onSubmit={handleSubmit} className={`p-6 rounded-[32px] shadow-xl ${darkMode ? "bg-gray-800/50 border border-gray-700" : "bg-white border border-gray-100"} space-y-5 blur-bg`}>
                <div className={`p-4 rounded-2xl flex items-center gap-3 ${isExpense ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500"}`}>
                    {isExpense ? <MinusCircle size={32} /> : <PlusCircle size={32} />}
                    <span className="text-sm font-black uppercase tracking-widest">{isExpense ? "Xarajat" : "Daromad"}</span>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Nomi</label>
                    <input
                        autoFocus
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={isExpense ? "Masalan: Tushlik" : "Masalan: Oylik"}
                        className={`w-full p-4 rounded-2xl border-none ring-1 transition-all outline-none text-base ${darkMode ? "bg-gray-700/50 ring-gray-600 focus:ring-blue-500" : "bg-gray-50 ring-gray-200 focus:ring-blue-500"}`}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Summa (UZS)</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0"
                        className={`w-full p-4 rounded-2xl border-none ring-1 transition-all outline-none text-xl font-mono ${darkMode ? "bg-gray-700/50 ring-gray-600 focus:ring-blue-500" : "bg-gray-50 ring-gray-200 focus:ring-blue-500"}`}
                    />
                </div>

                <button
                    type="submit"
                    className={`w-full p-4 rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-all ${isExpense ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"} text-white`}
                >
                    Saqlash
                </button>
            </form>
        </div>
    );
}
