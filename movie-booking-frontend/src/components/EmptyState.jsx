import { InboxIcon } from 'lucide-react';

const EmptyState = ({ icon: Icon = InboxIcon, title = 'Nothing here yet', message = '', action }) => (
  <div className="flex flex-col items-center justify-center py-24 gap-4">
    <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
      <Icon size={36} className="text-gray-600" />
    </div>
    <div className="text-center">
      <h3 className="text-white font-semibold text-lg mb-1">{title}</h3>
      {message && <p className="text-gray-500 text-sm max-w-xs">{message}</p>}
    </div>
    {action && (
      <button onClick={action.onClick} className="btn-primary mt-2">
        {action.label}
      </button>
    )}
  </div>
);

export default EmptyState;
