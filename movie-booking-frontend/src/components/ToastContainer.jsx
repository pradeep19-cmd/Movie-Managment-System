import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const ICONS = {
  success: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  error: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  info: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  warning: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
};

let toastId = 0;
const listeners = new Set();

export const toast = {
  show: (message, type = 'info', duration = 4000) => {
    const id = ++toastId;
    listeners.forEach((cb) => cb({ id, message, type, duration }));
    return id;
  },
  success: (msg, dur) => toast.show(msg, 'success', dur),
  error: (msg, dur) => toast.show(msg, 'error', dur),
  info: (msg, dur) => toast.show(msg, 'info', dur),
  warning: (msg, dur) => toast.show(msg, 'warning', dur),
};

const ToastItem = ({ id, message, type, duration, onRemove }) => {
  const { icon: Icon, color, bg } = ICONS[type] || ICONS.info;
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onRemove(id), 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onRemove]);

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border ${bg} shadow-2xl transition-all duration-300 ${
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
      }`}
    >
      <Icon size={18} className={`${color} shrink-0 mt-0.5`} />
      <p className="text-sm text-gray-200 flex-1">{message}</p>
      <button
        onClick={() => { setVisible(false); setTimeout(() => onRemove(id), 300); }}
        className="text-gray-500 hover:text-white transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
};

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handler = (t) => setToasts((prev) => [...prev, t]);
    listeners.add(handler);
    return () => listeners.delete(handler);
  }, []);

  const remove = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-2 w-80">
      {toasts.map((t) => (
        <ToastItem key={t.id} {...t} onRemove={remove} />
      ))}
    </div>
  );
};

export default ToastContainer;
