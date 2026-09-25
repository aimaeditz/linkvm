import React, { useState } from 'react';
import { THEME_PRESETS, THEME_CATEGORIES } from '../../lib/themes';
import { ThemePreset, ThemeConfig } from '../../types';
import { Check, Search } from 'lucide-react';
import { getThemeStyles } from '../../lib/constants';

interface ThemeGridProps {
  currentTheme: ThemeConfig;
  onSelectPreset: (preset: ThemePreset) => void;
}

export const ThemeGrid: React.FC<ThemeGridProps> = ({
  currentTheme,
  onSelectPreset,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract all categories excluding "All"
  const categoriesList = THEME_CATEGORIES.filter((cat) => cat !== 'All');

  // Filter themes based on search query
  const getFilteredPresets = (presets: ThemePreset[]) => {
    return presets.filter((preset) => {
      const matchesSearch =
        preset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        preset.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  };

  return (
    <div className="space-y-8 w-full">
      {/* Search and Category Pills Bar */}
      <div className="flex flex-col gap-4">
        {/* Search Input */}
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search premium presets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-950 transition-all text-sm font-medium"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar w-full">
          {THEME_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-950 text-white shadow-md'
                  : 'bg-slate-50 text-slate-600 border border-slate-200/60 hover:bg-slate-100 hover:text-slate-950'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Row Organized Presets */}
      <div className="space-y-10">
        {categoriesList
          .filter((cat) => selectedCategory === 'All' || selectedCategory === cat)
          .map((cat) => {
            const categoryPresets = THEME_PRESETS.filter((p) => p.category === cat);
            const matchingPresets = getFilteredPresets(categoryPresets);

            // Hide the category row if there are no matching presets
            if (matchingPresets.length === 0) return null;

            return (
              <div key={cat} className="space-y-3">
                {/* Category Header */}
                <h4 className="text-sm font-semibold text-slate-700 mb-3 mt-8 flex items-center gap-2">
                  <span>{cat}</span>
                  <span className="text-xs text-slate-400 font-normal">· {matchingPresets.length}</span>
                </h4>

                {/* Grid for themes in this category */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                  {matchingPresets.map((preset) => {
                    const isSelected = currentTheme.presetId === preset.id;
                    const { bgStyle } = getThemeStyles(preset);

                    // Build specific mini signature styles based on preset signature or style
                    let miniButtonStyle: React.CSSProperties = {
                      backgroundColor: preset.buttonColor,
                      borderColor: preset.buttonBorderColor || 'transparent',
                      borderWidth: preset.buttonStyle === 'outline' || preset.buttonStyle === 'bordered' ? '1px' : '0px',
                      borderRadius: preset.buttonShape === 'rounded-full' || preset.buttonShape === 'pill' ? '9999px' : '6px',
                    };

                    // Implement signature styles faithfully:
                    if (preset.signature === '3d') {
                      miniButtonStyle.boxShadow = `3px 3px 0px ${preset.buttonBorderColor || '#000000'}`;
                    } else if (preset.signature === 'glow') {
                      miniButtonStyle.boxShadow = `0 0 8px ${preset.buttonColor}80`;
                    } else if (preset.signature === 'glass') {
                      miniButtonStyle.backgroundColor = 'rgba(255,255,255,0.25)';
                      miniButtonStyle.backdropFilter = 'blur(4px)';
                      miniButtonStyle.borderColor = 'rgba(255,255,255,0.4)';
                      miniButtonStyle.borderWidth = '1px';
                    }

                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => onSelectPreset(preset)}
                        className={`group text-left p-3 rounded-2xl border transition-all flex flex-col justify-between aspect-square w-full bg-white cursor-pointer relative focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                          isSelected
                            ? 'border-indigo-500 ring-2 ring-indigo-500'
                            : 'border-slate-200/70 hover:border-slate-300 hover:shadow-md'
                        }`}
                      >
                        {/* Mini CSS Preview Area (60% height) */}
                        <div
                          className="w-full h-[60%] rounded-xl p-2.5 flex flex-col justify-between overflow-hidden relative border border-slate-100"
                          style={bgStyle}
                        >
                          {/* Two mini dots at top of preview */}
                          <div className="flex items-center gap-1">
                            <div
                              className="w-2.5 h-2.5 rounded-full border border-white/10 shrink-0"
                              style={{ backgroundColor: preset.headingColor }}
                            />
                            <div
                              className="w-1.5 h-1.5 rounded-full border border-white/5 opacity-80 shrink-0"
                              style={{ backgroundColor: preset.textColor }}
                            />
                          </div>

                          {/* Two mini link bars */}
                          <div className="space-y-1.5 w-full">
                            <div className="w-full h-2 rounded-sm" style={miniButtonStyle} />
                            <div className="w-full h-2 rounded-sm opacity-80" style={miniButtonStyle} />
                          </div>
                        </div>

                        {/* Theme Name & Category Label */}
                        <div className="mt-2 min-w-0 w-full flex items-center justify-between gap-1">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">
                              {preset.name}
                            </p>
                            <p className="text-xs text-slate-400 truncate mt-0.5">
                              {preset.category}
                            </p>
                          </div>
                          {isSelected && (
                            <span className="w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center shrink-0 shadow-xs animate-in zoom-in-50 duration-200">
                              <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
