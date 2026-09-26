import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Check, Share2, Send, Mail, Globe } from 'lucide-react';
import { copyToClipboard } from '../../lib/utils';
import { buildPatternUrl, buildPatternDisplayUrl } from '../../lib/username-patterns';
import { getSiteUrl } from '../../lib/site';
import { StorageService } from '../../lib/storage';

interface ShareMenuProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  name?: string | null;
}

export const ShareMenu: React.FC<ShareMenuProps> = ({
  isOpen,
  onClose,
  username,
  name,
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState('{username}');

  useEffect(() => {
    if (isOpen) {
      const user = StorageService.getCurrentUser();
      if (user?.sharePattern) {
        setSelectedPattern(user.sharePattern);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const siteUrl = getSiteUrl();
  const publicUrl = buildPatternUrl(selectedPattern, username, siteUrl);
  const displayUrl = buildPatternDisplayUrl(selectedPattern, username, siteUrl);
  const displayName = name || username;

  const handleCopy = async () => {
    const ok = await copyToClipboard(publicUrl);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareOptions = [
    {
      name: 'X (Twitter)',
      icon: Send,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        `Check out my links on LinkVM: ${publicUrl}`
      )}`,
      color: 'bg-slate-900 text-white',
    },
    {
      name: 'WhatsApp',
      icon: Send,
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(
        `Check out my links: ${publicUrl}`
      )}`,
      color: 'bg-emerald-600 text-white',
    },
    {
      name: 'LinkedIn',
      icon: Share2,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicUrl)}`,
      color: 'bg-blue-600 text-white',
    },
    {
      name: 'Email',
      icon: Mail,
      url: `mailto:?subject=${encodeURIComponent(
        `${displayName}'s Links`
      )}&body=${encodeURIComponent(`Check out my links on LinkVM: ${publicUrl}`)}`,
      color: 'bg-slate-700 text-white',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Share Profile</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* QR Preview */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center space-y-2">
          <QRCodeSVG value={publicUrl} size={140} level="M" />
          <span className="text-[11px] font-mono text-slate-500">{displayUrl}</span>
        </div>

        {/* Copy Box */}
        <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-xl">
          <input
            type="text"
            readOnly
            value={publicUrl}
            className="w-full bg-transparent text-xs font-mono text-slate-700 px-2 focus:outline-hidden"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shrink-0 flex items-center gap-1 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Share options */}
        <div className="grid grid-cols-2 gap-2">
          {shareOptions.map((opt) => (
            <a
              key={opt.name}
              href={opt.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] ${opt.color}`}
            >
              <span>{opt.name}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
