import React, { useState, useEffect } from 'react';
import { X, Sparkles, ExternalLink, Globe, Plus, Check, Eye } from 'lucide-react';
import { LinkItem, ThemeConfig } from '../../types';
import { linkSchema } from '../../lib/validators';
import { IconPicker, getIconComponent } from './IconPicker';
import { StorageService } from '../../lib/storage';
import { detectPlatformIcon } from '../../lib/icons';

interface LinkFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (link: {
    title: string;
    url: string;
    icon?: string | null;
    visible: boolean;
    openInNew: boolean;
    highlighted?: boolean;
    animation?: 'none' | 'pulse' | 'bounce' | 'glow';
  }) => void;
  initialData?: LinkItem | null;
}

export const LinkFormModal: React.FC<LinkFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [icon, setIcon] = useState<string | null>('Globe');
  const [visible, setVisible] = useState(true);
  const [openInNew, setOpenInNew] = useState(true);
  const [highlighted, setHighlighted] = useState(false);
  const [animation, setAnimation] = useState<'none' | 'pulse' | 'bounce' | 'glow'>('none');

  const [showIconPicker, setShowIconPicker] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<ThemeConfig>(StorageService.getTheme());

  useEffect(() => {
    if (isOpen) {
      setTheme(StorageService.getTheme());
    }
    if (initialData) {
      setTitle(initialData.title);
      setUrl(initialData.url);
      setIcon(initialData.icon || 'Globe');
      setVisible(initialData.visible);
      setOpenInNew(initialData.openInNew);
      setHighlighted(initialData.highlighted || false);
      setAnimation(initialData.animation || 'none');
    } else {
      setTitle('');
      setUrl('');
      setIcon('Globe');
      setVisible(true);
      setOpenInNew(true);
      setHighlighted(false);
      setAnimation('none');
    }
    setError(null);
    setShowIconPicker(false);
    setActiveTab('editor');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    let processedUrl = url.trim();
    if (processedUrl && !/^https?:\/\//i.test(processedUrl) && !/^mailto:/i.test(processedUrl)) {
      processedUrl = `https://${processedUrl}`;
    }

    // Auto-detect platform icon if icon is default/generic or matching
    let finalIcon = icon;
    const detected = detectPlatformIcon(processedUrl);
    if (detected && (!finalIcon || finalIcon.toLowerCase() === 'globe' || finalIcon.toLowerCase() === 'link')) {
      finalIcon = detected;
    }

    const result = linkSchema.safeParse({
      title,
      url: processedUrl,
      icon: finalIcon,
      visible,
      openInNew,
      highlighted,
      animation,
    });

    if (!result.success) {
      setError(result.error.issues[0]?.message || 'Invalid link details');
      return;
    }

    onSave({
      title: result.data.title,
      url: result.data.url,
      icon: result.data.icon,
      visible: result.data.visible,
      openInNew: result.data.openInNew,
      highlighted: result.data.highlighted,
      animation: result.data.animation,
    });

    onClose();
  };

  const SelectedIconComponent = getIconComponent(icon);

  const getButtonShapeClass = (shape: string) => {
    switch (shape) {
      case 'rounded-none':
        return 'rounded-none';
      case 'rounded-md':
        return 'rounded-md';
      case 'rounded-full':
        return 'rounded-full';
      default:
        return 'rounded-xl';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {initialData ? 'Edit Link & Preview' : 'Add New Link & Preview'}
            </h3>
            <p className="text-xs text-slate-500">Configure your title, destination URL, and live theme preview</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher: Edit Details | Live Preview */}
        <div className="px-5 pt-3 pb-1 border-b border-slate-100 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'editor'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Details &amp; Options
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'preview'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Button Preview</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              {error}
            </div>
          )}

          {activeTab === 'editor' ? (
            <div className="space-y-4">
              {/* Title & Icon selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Link Title</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowIconPicker(!showIconPicker)}
                    className="w-11 h-11 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 flex items-center justify-center text-slate-700 hover:text-indigo-600 transition-colors shrink-0"
                    title="Select icon"
                  >
                    <SelectedIconComponent className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    placeholder="e.g. My Portfolio / Latest Video / Newsletter"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={80}
                    required
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-indigo-500 bg-white"
                  />
                </div>
                {showIconPicker && (
                  <div className="pt-2">
                    <IconPicker
                      selectedIcon={icon}
                      onSelectIcon={(selected) => {
                        setIcon(selected);
                        setShowIconPicker(false);
                      }}
                      onClose={() => setShowIconPicker(false)}
                    />
                  </div>
                )}
              </div>

              {/* Destination URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Destination URL</label>
                <input
                  type="text"
                  placeholder="https://example.com/your-content (e.g. tiktok.com/@username, youtube.com/@channel)"
                  value={url}
                  onChange={(e) => {
                    const newUrl = e.target.value;
                    setUrl(newUrl);
                    const detected = detectPlatformIcon(newUrl);
                    if (detected) {
                      setIcon(detected);
                    }
                  }}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-indigo-500 bg-white font-mono text-xs"
                />
              </div>

              {/* Animation & Highlight */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Button Animation</label>
                  <select
                    value={animation}
                    onChange={(e) => setAnimation(e.target.value as 'none' | 'pulse' | 'bounce' | 'glow')}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-indigo-500 bg-white"
                  >
                    <option value="none">None (Standard)</option>
                    <option value="pulse">Pulse</option>
                    <option value="bounce">Bounce</option>
                    <option value="glow">Glow</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Featured Highlight</label>
                  <button
                    type="button"
                    onClick={() => setHighlighted(!highlighted)}
                    className={`w-full px-3 py-2 rounded-xl text-xs font-semibold border flex items-center justify-between transition-colors ${
                      highlighted
                        ? 'bg-amber-50 border-amber-300 text-amber-900'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{highlighted ? 'Featured' : 'Standard'}</span>
                    {highlighted && <Sparkles className="w-3.5 h-3.5 text-amber-600" />}
                  </button>
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-4">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visible}
                    onChange={(e) => setVisible(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Visible on profile</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={openInNew}
                    onChange={(e) => setOpenInNew(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Open in new tab</span>
                </label>
              </div>
            </div>
          ) : (
            /* Live Button Preview Panel (Part E & Problem 8) */
            <div className="space-y-4 py-2">
              <p className="text-xs text-slate-500">
                This is the exact rendering of your button on your active theme ({theme.fontFamily}):
              </p>

              <div
                className="p-6 rounded-2xl border border-slate-200/80 flex flex-col items-center justify-center space-y-4"
                style={{
                  backgroundColor: theme.bgColor,
                  background:
                    theme.bgType === 'gradient' && theme.bgGradientFrom && theme.bgGradientTo
                      ? `linear-gradient(135deg, ${theme.bgGradientFrom}, ${theme.bgGradientTo})`
                      : theme.bgColor,
                }}
              >
                <div
                  className={`w-full max-w-sm px-4 py-3.5 text-xs font-bold transition-all shadow-xs flex items-center justify-between gap-3 ${getButtonShapeClass(
                    theme.buttonShape
                  )} ${highlighted ? 'ring-2 ring-amber-400' : ''}`}
                  style={{
                    backgroundColor: theme.buttonColor,
                    color: theme.buttonTextColor,
                    border: `1px solid ${theme.buttonBorderColor}`,
                    fontFamily: theme.bodyFont || theme.fontFamily,
                  }}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <SelectedIconComponent className="w-4 h-4 shrink-0" />
                    <span className="truncate">{title || 'Your Link Title Preview'}</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70 shrink-0" />
                </div>
              </div>

              <div className="text-[11px] text-slate-400 font-mono text-center">
                Destination: {url || 'https://linkvm.online'}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm shadow-indigo-600/20 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{initialData ? 'Save Changes' : 'Create Link'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
