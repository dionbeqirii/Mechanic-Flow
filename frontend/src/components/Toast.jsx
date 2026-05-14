import React from 'react';
import { CheckCircle2, X, Trash2, AlertCircle } from 'lucide-react';

const CONFIG = {
  success: { border: 'border-green-500', icon: <CheckCircle2 className="text-green-500" size={22} /> },
  error:   { border: 'border-red-500',   icon: <AlertCircle  className="text-red-500"   size={22} /> },
  info:    { border: 'border-blue-500',  icon: <Trash2       className="text-blue-400"  size={22} /> },
};

export default function Toast({ toast, onClose }) {
  if (!toast.show) return null;
  const { border, icon } = CONFIG[toast.type] || CONFIG.success;
  return (
    <div className="fixed top-6 right-6 z-[200] animate-in fade-in slide-in-from-right-8 duration-300">
      <div className={`bg-slate-800 border-l-4 ${border} shadow-2xl rounded-r-xl p-4 flex items-center gap-4 min-w-[300px]`}>
        <div className="shrink-0">{icon}</div>
        <p className="text-sm font-medium text-white flex-1">{toast.message}</p>
        <button onClick={onClose} className="text-slate-500 hover:text-white ml-2">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = React.useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
  };
  const closeToast = () => setToast(t => ({ ...t, show: false }));
  return { toast, showToast, closeToast };
}
