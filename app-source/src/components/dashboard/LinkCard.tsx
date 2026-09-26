import React, { useState } from 'react';
import {
  GripVertical,
  ExternalLink,
  Copy,
  Check,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  MousePointerClick,
} from 'lucide-react';
import { LinkItem } from '../../types';
import { getIconComponent } from './IconPicker';
import { copyToClipboard } from '../../lib/utils';

interface LinkCardProps {
  link: LinkItem;
  onEdit: (link: LinkItem) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string, visible: boolean) => void;
  dragHandleProps?: Record<string, unknown>;
}

export const LinkCard: React.FC<LinkCardProps> = ({
  link,
  onEdit,
  onDelete,
  onToggleVisibility,
  dragHandleProps,
}) => {
  const [copied, setCopied] = useState(false);
  const IconComponent = getIconComponent(link.icon);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const ok = await copyToClipboard(link.url);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={`group relative bg-white rounded-2xl border transition-all duration-200 p-4 shadow-xs hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
        link.visible ? 'border-slate-200/90' : 'border-slate-200/50 bg-slate-50/60 opacity-75'
      } ${link.highlighted ? 'ring-2 ring-amber-400/50 bg-amber-50/20' : ''}`}
    >
      {/* Left section: drag handle, icon, title & destination */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div
          {...dragHandleProps}
          className="cursor-grab active:cursor-grabbing p-1 text-slate-300 hover:text-slate-600 rounded-lg shrink-0 transition-colors"
          title="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </div>

        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
            link.highlighted
              ? 'bg-amber-100 text-amber-800'
              : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'
          }`}
        >
          <IconComponent className="w-5 h-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-slate-900 truncate">{link.title}</h4>
            {link.highlighted && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                <Sparkles className="w-2.5 h-2.5" />
                Featured
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-400 hover:text-indigo-600 truncate max-w-xs font-mono transition-colors"
            >
              {link.url.replace(/^https?:\/\//i, '')}
            </a>
            <button
              type="button"
              onClick={handleCopy}
              className="text-slate-400 hover:text-indigo-600 p-0.5 rounded transition-colors"
              title="Copy URL"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </div>

      {/* Right section: clicks counter, visibility toggle, edit, delete */}
      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        {/* Real clicks badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100/90 text-slate-600 text-xs font-semibold">
          <MousePointerClick className="w-3.5 h-3.5 text-indigo-500" />
          <span>{link.clicks || 0}</span>
          <span className="text-[10px] text-slate-400 font-normal">clicks</span>
        </div>

        {/* Visibility switch */}
        <button
          type="button"
          onClick={() => onToggleVisibility(link.id, !link.visible)}
          className={`p-1.5 rounded-xl border transition-colors ${
            link.visible
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
              : 'bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200'
          }`}
          title={link.visible ? 'Visible on profile' : 'Hidden from profile'}
        >
          {link.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>

        {/* Edit button */}
        <button
          type="button"
          onClick={() => onEdit(link)}
          className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-colors"
          title="Edit link"
        >
          <Edit2 className="w-4 h-4" />
        </button>

        {/* Delete button */}
        <button
          type="button"
          onClick={() => onDelete(link.id)}
          className="p-1.5 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-colors"
          title="Delete link"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
