import React, { useState } from 'react';
import { Palette, Check, Sparkles } from 'lucide-react';
import { User, LinkItem, ThemeConfig } from '../../types';
import { THEME_PRESETS } from '../../lib/themes';
import { StorageService } from '../../lib/storage';

interface AppearancePageProps {
  user: User;
  links: LinkItem[];
  theme: ThemeConfig;
  onThemeChange: () => void;
}

export const AppearancePage: React.FC<AppearancePageProps> = ({
  user,
  theme,
  onThemeChange,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState(theme.presetId || THEME_PRESETS[0].id);

  const handleSelectPreset = (preset: typeof THEME_PRESETS[0]) => {
    setSelectedPresetId(preset.id);
    StorageService.updateTheme({
      presetId: preset.id,
      bgColor: preset.bgColor,
      bgGradientFrom: preset.bgGradientFrom,
      bgGradientTo: preset.bgGradientTo,
      bgGradientAngle: preset.bgGradientAngle,
      bgType: preset.bgType,
      textColor: preset.textColor,
      headingColor: preset.headingColor,
      buttonColor: preset.buttonColor,
      buttonTextColor: preset.buttonTextColor,
      buttonBorderColor: preset.buttonBorderColor,
      buttonStyle: preset.buttonStyle,
      buttonShape: preset.buttonShape,
      fontFamily: preset.fontFamily,
    });
    onThemeChange();
  };

  return (
    <div className="space-y-8 w-full font-sans">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200/60">
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Appearance &amp; Theme Studio
          </h2>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            48 Unlocked Themes
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Customize your profile background, button styles, typography, and theme preset.
        </p>
      </div>

      {/* Preset Theme Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Palette className="w-4 h-4 text-indigo-600" />
          <span>Curated Theme Presets</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {THEME_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`p-5 rounded-3xl border text-left transition-all relative overflow-hidden flex flex-col justify-between h-44 cursor-pointer shadow-2xs hover:shadow-md ${
                  isSelected
                    ? 'border-indigo-600 ring-2 ring-indigo-600/20 bg-white'
                    : 'border-slate-200/80 bg-white hover:border-slate-300'
                }`}
              >
                {/* Theme Background Specimen */}
                <div
                  className="w-full h-20 rounded-2xl mb-3 p-3 flex flex-col justify-end border border-slate-200/60 shadow-inner"
                  style={{
                    backgroundColor: preset.bgColor,
                    background:
                      preset.bgType === 'gradient' && preset.bgGradientFrom && preset.bgGradientTo
                        ? `linear-gradient(135deg, ${preset.bgGradientFrom}, ${preset.bgGradientTo})`
                        : preset.bgColor,
                  }}
                >
                  <div
                    className="w-full py-1.5 px-3 rounded-lg text-[10px] font-bold text-center truncate shadow-2xs"
                    style={{
                      backgroundColor: preset.buttonColor,
                      color: preset.buttonTextColor,
                    }}
                  >
                    Sample Button
                  </div>
                </div>

                {/* Info */}
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{preset.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{preset.tagline}</p>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
