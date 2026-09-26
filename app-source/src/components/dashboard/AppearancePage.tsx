import React, { useState, useEffect, useRef } from 'react';
import { User, LinkItem, ThemeConfig, ThemePreset } from '../../types';
import { ThemeGrid } from './ThemeGrid';
import { ThemeControls } from './ThemeControls';
import { ProfilePreview } from './ProfilePreview';
import { MobilePreviewToggle } from './MobilePreviewToggle';
import { StorageService } from '../../lib/storage';
import { Palette, Sliders, Check, Save, Loader2, AlertCircle } from 'lucide-react';
import { presetToConfig } from '../../lib/themes';
import { themeOverrideSchema } from '../../lib/validators';

interface AppearancePageProps {
  user: User;
  links: LinkItem[];
  theme: ThemeConfig;
  onThemeChange: () => void;
}

export const AppearancePage: React.FC<AppearancePageProps> = ({
  user,
  links,
  theme,
  onThemeChange,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'customize'>('presets');
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(theme);
  const [initialSavedTheme, setInitialSavedTheme] = useState<ThemeConfig>(theme);
  
  // Statuses
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'idle'>('idle');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isSavingManual, setIsSavingManual] = useState(false);

  // Debounce ref
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync state if prop changes from outside
  useEffect(() => {
    setCurrentTheme(theme);
    setInitialSavedTheme(theme);
  }, [theme]);

  // Check if current form is dirty (different from last saved DB state)
  const isDirty = JSON.stringify(currentTheme) !== JSON.stringify(initialSavedTheme);

  // Clear toast helper
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Safe Auto-Save function (800ms debounce)
  const triggerAutoSave = (updatedTheme: ThemeConfig) => {
    setSaveStatus('saving');
    
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      // 1. Zod validation
      const validation = themeOverrideSchema.safeParse(updatedTheme);
      if (!validation.success) {
        setSaveStatus('idle');
        const firstErr = validation.error.issues[0]?.message || 'Invalid styling values.';
        showToast(`Auto-save skipped: ${firstErr}`, 'error');
        return;
      }

      // 2. Perform local update
      StorageService.updateTheme(updatedTheme);
      setInitialSavedTheme(updatedTheme);
      onThemeChange();
      setSaveStatus('saved');

      setTimeout(() => {
        setSaveStatus('idle');
      }, 1500);
    }, 800);
  };

  // Re-usable theme changing handler
  const handleThemeChange = (partial: Partial<ThemeConfig>) => {
    const updated = {
      ...currentTheme,
      ...partial,
      updatedAt: new Date().toISOString(),
    };
    setCurrentTheme(updated);
    
    // Safety auto-save net
    triggerAutoSave(updated);
  };

  const handleSelectPreset = (preset: ThemePreset) => {
    const newConfig = presetToConfig(preset, user.id);
    setCurrentTheme(newConfig);
    
    // Safety auto-save net
    triggerAutoSave(newConfig);
  };

  // Explicit Manual Save (Part 3)
  const handleExplicitSave = async () => {
    if (!isDirty || isSavingManual) return;

    setIsSavingManual(true);
    setSaveStatus('saving');

    // 1. Zod schema validation
    const validation = themeOverrideSchema.safeParse(currentTheme);
    if (!validation.success) {
      const errMsg = validation.error.issues[0]?.message || 'Theme structure is invalid.';
      showToast(`Validation Error: ${errMsg}`, 'error');
      setIsSavingManual(false);
      setSaveStatus('idle');
      return;
    }

    try {
      // Update DB state
      StorageService.updateTheme(currentTheme);
      setInitialSavedTheme(currentTheme);
      onThemeChange();
      
      setSaveStatus('saved');
      showToast('Theme presets and customizations saved successfully!', 'success');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred while saving.';
      showToast(message, 'error');
    } finally {
      setIsSavingManual(false);
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    }
  };

  // Cancel & Revert
  const handleCancelRevert = () => {
    if (!isDirty) return;
    
    setCurrentTheme(initialSavedTheme);
    // Sync state back to storage
    StorageService.updateTheme(initialSavedTheme);
    onThemeChange();
    
    showToast('Reverted changes back to last saved state.', 'success');
  };

  return (
    <div className="space-y-8 w-full min-w-0 animate-in fade-in duration-500">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-5 border-b border-slate-200/60 w-full">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Appearance &amp; Themes
            </h2>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[13px] font-extrabold shadow-sm transition-transform duration-300 hover:scale-105">
              <Check className="w-3.5 h-3.5 stroke-[3.5] text-emerald-600" />
              <span>48 Free Presets · Premium · Free Forever</span>
            </span>
            {saveStatus === 'saving' && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 animate-pulse bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                <Loader2 className="w-3 h-3 animate-spin" /> Saving…
              </span>
            )}
            {saveStatus === 'saved' && (
              <span className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100 animate-in zoom-in-95 duration-200">
                <Check className="w-3.5 h-3.5 stroke-[3]" /> Saved
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1.5 max-w-2xl">
            Choose from 48 beautifully crafted premium themes — every theme is 100% free forever. Adjust colors, fonts, shadows, and hover transitions in real-time.
          </p>
        </div>

        {/* Action Buttons: Cancel | Save (Wired to isDirty) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            disabled={!isDirty}
            onClick={handleCancelRevert}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all border duration-200 shadow-2xs ${
              isDirty
                ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 cursor-pointer active:scale-95'
                : 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed'
            }`}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!isDirty || isSavingManual}
            onClick={handleExplicitSave}
            className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-extrabold text-white transition-all duration-300 shadow-md ${
              isDirty && !isSavingManual
                ? 'bg-gradient-to-b from-slate-900 to-slate-800 hover:from-slate-850 hover:to-slate-750 cursor-pointer active:scale-95 hover:shadow-lg'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none border border-slate-100'
            }`}
          >
            {isSavingManual ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>{isSavingManual ? 'Saving' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Main Full-Width Flex Layout: Left Side Controls, Right Side Sticky Preview */}
      <div className="flex flex-col lg:flex-row gap-8 items-start w-full min-w-0">
        {/* Left Controls column */}
        <div className="flex-1 min-w-0 w-full space-y-6">
          <div className="flex items-center p-1 bg-slate-100 border border-slate-200/40 rounded-2xl w-fit">
            <button
              type="button"
              onClick={() => setActiveTab('presets')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'presets'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Palette className="w-4 h-4 text-slate-900" />
              <span>48 Presets</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('customize')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'customize'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Sliders className="w-4 h-4 text-slate-900" />
              <span>Custom Controls</span>
            </button>
          </div>

          {activeTab === 'presets' ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-950">Premium Theme Library</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Click any of the 48 premium presets across 12 distinct categories to instantly theme your page.
                </p>
              </div>
              <ThemeGrid currentTheme={currentTheme} onSelectPreset={handleSelectPreset} />
            </div>
          ) : (
            <ThemeControls theme={currentTheme} onChange={handleThemeChange} />
          )}
        </div>

        {/* Right Sticky Preview (lg+) */}
        <div className="hidden lg:block w-[320px] xl:w-[360px] shrink-0 sticky top-24">
          <ProfilePreview user={user} links={links} theme={currentTheme} />
        </div>
      </div>

      {/* Slide-over floating responsive preview for tablet/mobile screen sizes */}
      <MobilePreviewToggle user={user} links={links} theme={currentTheme} />

      {/* Floating Status Toasts */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4.5 py-3 rounded-2xl shadow-xl border animate-in slide-in-from-bottom-5 duration-300 bg-slate-900 text-white border-slate-800">
          {toast.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span className="text-xs font-bold">{toast.message}</span>
        </div>
      )}
    </div>
  );
};
