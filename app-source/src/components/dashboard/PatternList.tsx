import React, { useState } from 'react';
import { Copy, Check, Star } from 'lucide-react';
import { PATTERNS, buildPatternDisplayUrl, buildPatternUrl } from '../../lib/username-patterns';
import { copyToClipboard } from '../../lib/utils';

interface PatternListProps {
  username: string;
  currentPattern?: string;
  onSetDefault?: (pattern: string) => void;
  compact?: boolean;
}

export const PatternList: React.FC<PatternListProps> = ({
  username,
  currentPattern = '{username}',
  onSetDefault,
  compact = false,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (pattern: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const fullUrl = buildPatternUrl(pattern, username);
    const success = await copyToClipboard(fullUrl);
    if (success) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    }
  };

  return (
    <div className="space-y-2 w-full">
      {PATTERNS.map((p) => {
        const displayUrl = buildPatternDisplayUrl(p.pattern, username);
        const isSelected = (currentPattern || '{username}') === p.pattern;

        return (
          <div
            key={p.id}
            className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
              isSelected
                ? 'bg-indigo-50/70 border-indigo-200 text-indigo-950 font-semibold'
                : 'bg-white border-slate-200/80 hover:bg-slate-50 text-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <span className={`w-2 h-2 rounded-full shrink-0 ${isSelected ? 'bg-indigo-600' : 'bg-slate-300'}`} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs truncate" title={displayUrl}>
                    {displayUrl}
                  </span>
                  {isSelected && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-indigo-600 bg-indigo-100/80 px-1.5 py-0.2 rounded">
                      Default
                    </span>
                  )}
                </div>
                {!compact && <p className="text-[10px] text-slate-500 truncate">{p.description}</p>}
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0 ml-2">
              <button
                type="button"
                onClick={(e) => handleCopy(p.pattern, p.id, e)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                title="Copy pattern link"
              >
                {copiedId === p.id ? (
                  <Check size={14} className="text-emerald-600" />
                ) : (
                  <Copy size={14} />
                )}
              </button>

              {onSetDefault && !isSelected && (
                <button
                  type="button"
                  onClick={() => onSetDefault(p.pattern)}
                  className="px-2 py-1 text-[10px] font-bold rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer inline-flex items-center gap-1"
                  title="Set as default share link"
                >
                  <Star size={10} className="text-amber-500 fill-amber-400" />
                  <span>Set default</span>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
