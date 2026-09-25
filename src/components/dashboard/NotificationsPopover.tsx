import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Sparkles, Link2, ShieldCheck, X } from 'lucide-react';

export const NotificationsPopover: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  const menuRef = useRef<HTMLDivElement>(null);

  const notifications = [
    {
      id: '1',
      title: 'Advanced Analytics Active',
      message: 'You can now track unique visitors and click-through rates directly on LinkVM.',
      icon: Sparkles,
      time: 'Just now',
      unread: true,
    },
    {
      id: '2',
      title: '50 Themes Available',
      message: 'Explore our expanded library of 50 handcrafted theme presets with live preview.',
      icon: Sparkles,
      time: '1 hour ago',
      unread: true,
    },
    {
      id: '3',
      title: 'Verified Creator Status',
      message: 'Your profile is active and verified on the Free Forever Plan.',
      icon: ShieldCheck,
      time: '1 day ago',
      unread: false,
    },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => {
    setUnreadCount(0);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors focus:outline-hidden"
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden z-40 animate-in fade-in zoom-in-95 duration-100">
          <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-slate-900">Notifications</h4>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
            {notifications.map((n) => {
              const Icon = n.icon;
              return (
                <div
                  key={n.id}
                  className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 transition-colors ${
                    n.unread ? 'bg-indigo-50/30' : ''
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800">{n.title}</p>
                    <p className="text-[11px] text-slate-500 leading-snug mt-0.5">{n.message}</p>
                    <span className="text-[10px] text-slate-400 mt-1 inline-block">{n.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
