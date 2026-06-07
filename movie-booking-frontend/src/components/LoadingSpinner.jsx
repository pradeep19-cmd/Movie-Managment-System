import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-24 gap-4">
    <div className="relative">
      <div className="w-14 h-14 rounded-full border-2 border-white/10 border-t-red-500 animate-spin" />
      <div className="absolute inset-0 flex items-center justify-center">
        <Loader2 size={20} className="text-red-500 animate-pulse" />
      </div>
    </div>
    <p className="text-gray-400 text-sm">{message}</p>
  </div>
);

export default LoadingSpinner;
