import React from "react";

export default function DashboardCard({ title, icon: Icon, color, onClick, subtitle, isActive }) {
    return (
        <button
            onClick={onClick}
            className={`
        flex flex-col items-center justify-center p-4 rounded-3xl 
        transition-all duration-300 transform btn-pressed
        ${color} text-white
        ${isActive
                    ? `ring-4 ring-offset-4 ring-blue-500/50 scale-90`
                    : 'opacity-100 hover:scale-[0.98] shadow-lg'}
        w-full aspect-square
      `}
        >
            <Icon size={28} className="text-white mb-2" />
            <span className="text-[10px] font-black leading-tight tracking-tight uppercase">{title}</span>
        </button>
    );
}
