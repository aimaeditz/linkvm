import React, { useState } from 'react';
import {
  ThemeConfig,
  ButtonStyle,
  ButtonShape,
  ButtonHover,
  FontFamily,
  StickerPack,
  CardStyle,
} from '../../types';
import {
  RotateCcw,
  Palette,
  Type,
  MousePointer,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { DEFAULT_THEME, THEME_PRESETS, presetToConfig } from '../../lib/themes';

interface ThemeControlsProps {
  theme: ThemeConfig;
  onChange: (partial: Partial<ThemeConfig>) => void;
}

export const ThemeControls: React.FC<ThemeControlsProps> = ({
  theme,
  onChange,
}) => {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    wallpaper: true,
    buttons: true,
    socials: false,
    colors: true,
    text: false,
    stickers: false,
    footer: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const fonts: { id: FontFamily; label: string }[] = [
    { id: 'Inter', label: 'Inter' },
    { id: 'Manrope', label: 'Manrope' },
    { id: 'Sora', label: 'Sora' },
    { id: 'DM Sans', label: 'DM Sans' },
    { id: 'Space Grotesk', label: 'Space Grotesk' },
    { id: 'Plus Jakarta Sans', label: 'Plus Jakarta' },
    { id: 'Instrument Serif', label: 'Instrument Serif (Serif)' },
    { id: 'Bricolage Grotesque', label: 'Bricolage' },
  ];

  const buttonStyles: { id: ButtonStyle; label: string }[] = [
    { id: 'solid', label: 'Solid' },
    { id: 'bordered', label: 'Bordered' },
    { id: 'outline', label: 'Outline' },
    { id: 'soft', label: 'Soft' },
    { id: 'glass', label: 'Glass' },
    { id: 'gradient', label: 'Gradient' },
    { id: 'shadow', label: '3D Shadow' },
    { id: 'glow', label: 'Neon Glow' },
  ];

  const buttonShapes: { id: ButtonShape; label: string }[] = [
    { id: 'rounded', label: 'Rounded' },
    { id: 'pill', label: 'Pill' },
    { id: 'square', label: 'Square' },
    { id: 'sharp', label: 'Sharp' },
  ];

  const buttonHovers: { id: ButtonHover; label: string }[] = [
    { id: 'lift', label: 'Lift' },
    { id: 'glow', label: 'Glow' },
    { id: 'darken', label: 'Darken' },
    { id: 'underline', label: 'Underline' },
    { id: 'shimmer', label: 'Shimmer' },
  ];

  const cardStyles: { id: CardStyle; label: string }[] = [
    { id: 'minimal', label: 'Minimal' },
    { id: 'elevated', label: 'Elevated' },
    { id: 'glass', label: 'Glass' },
    { id: '3d', label: '3D shadow' },
  ];

  const stickerPacks: { id: StickerPack; label: string }[] = [
    { id: 'none', label: 'None' },
    { id: 'geometric', label: 'Geometric' },
    { id: 'minimal-dots', label: 'Minimal Dots' },
    { id: 'subtle-lines', label: 'Subtle Lines' },
  ];

  const handleResetToPreset = () => {
    const preset = THEME_PRESETS.find((p) => p.id === theme.presetId) || DEFAULT_THEME;
    onChange(presetToConfig(preset, theme.userId));
  };

  const isPresetCustomizable = theme.customizable;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 space-y-4 shadow-2xs w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Custom Theme Designer</h3>
          <p className="text-xs text-slate-500">Fine-tune backgrounds, buttons, colors, and typography</p>
        </div>
        <button
          type="button"
          onClick={handleResetToPreset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Preset Defaults</span>
        </button>
      </div>

      {!isPresetCustomizable && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 font-semibold">
          This is a premium curated theme preset. To customize every control, select any of our highly customizable presets in the tab list!
        </div>
      )}

      <div className={`space-y-4 ${!isPresetCustomizable ? 'opacity-50 pointer-events-none' : ''}`}>
        {/* Accordion Row 1: Wallpaper / Background */}
        <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white">
          <button
            type="button"
            onClick={() => toggleSection('wallpaper')}
            className="w-full flex items-center justify-between p-3.5 bg-slate-50/50 hover:bg-slate-50 font-bold text-xs text-slate-800"
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-900" />
              <span>Wallpaper &amp; Background</span>
            </div>
            {openSections.wallpaper ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
          {openSections.wallpaper && (
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onChange({ bgType: 'solid' })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                    theme.bgType === 'solid'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  Solid Color
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      bgType: 'gradient',
                      bgGradientFrom: theme.bgGradientFrom || theme.bgColor,
                      bgGradientTo: theme.bgGradientTo || '#FAFAFA',
                      bgGradientAngle: theme.bgGradientAngle || 'to-b',
                    })
                  }
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                    theme.bgType === 'gradient'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  Linear Gradient
                </button>
              </div>

              {theme.bgType === 'solid' ? (
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-600">Background Color:</span>
                  <input
                    type="color"
                    value={theme.bgColor}
                    onChange={(e) => onChange({ bgColor: e.target.value })}
                    className="w-8 h-8 rounded-lg cursor-pointer p-0 bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={theme.bgColor}
                    onChange={(e) => onChange({ bgColor: e.target.value })}
                    className="text-xs font-mono px-2 py-1 rounded bg-white border border-slate-200 uppercase w-28 text-slate-800"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[11px] font-semibold text-slate-600">Gradient Start</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.bgGradientFrom || '#FFFFFF'}
                        onChange={(e) => onChange({ bgGradientFrom: e.target.value })}
                        className="w-7 h-7 rounded cursor-pointer p-0 border-0"
                      />
                      <input
                        type="text"
                        value={theme.bgGradientFrom || '#FFFFFF'}
                        onChange={(e) => onChange({ bgGradientFrom: e.target.value })}
                        className="text-xs font-mono px-2 py-1 rounded bg-white border border-slate-200 uppercase w-full text-slate-800"
                      />
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[11px] font-semibold text-slate-600">Gradient End</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.bgGradientTo || '#FAFAFA'}
                        onChange={(e) => onChange({ bgGradientTo: e.target.value })}
                        className="w-7 h-7 rounded cursor-pointer p-0 border-0"
                      />
                      <input
                        type="text"
                        value={theme.bgGradientTo || '#FAFAFA'}
                        onChange={(e) => onChange({ bgGradientTo: e.target.value })}
                        className="text-xs font-mono px-2 py-1 rounded bg-white border border-slate-200 uppercase w-full text-slate-800"
                      />
                    </div>
                  </div>
                  <div className="col-span-1 sm:col-span-2 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[11px] font-semibold text-slate-600">Gradient Angle</span>
                    <div className="flex gap-1.5">
                      {[
                        { label: '135° (Diag)', value: '135deg' },
                        { label: '180° (To Bottom)', value: 'to-b' },
                        { label: '45° (To Top Right)', value: 'to-tr' },
                        { label: '90° (To Right)', value: 'to-r' },
                      ].map((ang) => (
                        <button
                          key={ang.value}
                          type="button"
                          onClick={() => onChange({ bgGradientAngle: ang.value })}
                          className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer ${
                            theme.bgGradientAngle === ang.value || (!theme.bgGradientAngle && ang.value === '135deg')
                              ? 'bg-slate-950 text-white border-slate-950 shadow-xs'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {ang.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Accordion Row 2: Buttons & Cards */}
        <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white">
          <button
            type="button"
            onClick={() => toggleSection('buttons')}
            className="w-full flex items-center justify-between p-3.5 bg-slate-50/50 hover:bg-slate-50 font-bold text-xs text-slate-800"
          >
            <div className="flex items-center gap-2">
              <MousePointer className="w-4 h-4 text-slate-900" />
              <span>Button &amp; Card Style, Shape, Hover</span>
            </div>
            {openSections.buttons ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
          {openSections.buttons && (
            <div className="p-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Button Style</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {buttonStyles.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => onChange({ buttonStyle: s.id })}
                      className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                        theme.buttonStyle === s.id
                          ? 'bg-slate-950 text-white border-slate-950 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Button Shape</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {buttonShapes.map((s) => {
                    const isShapeSelected =
                      theme.buttonShape === s.id ||
                      (s.id === 'rounded' && theme.buttonShape === 'rounded-xl') ||
                      (s.id === 'pill' && theme.buttonShape === 'rounded-full') ||
                      (s.id === 'square' && theme.buttonShape === 'rounded-md') ||
                      (s.id === 'sharp' && theme.buttonShape === 'rounded-none');

                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => onChange({ buttonShape: s.id })}
                        className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                          isShapeSelected
                            ? 'bg-slate-950 text-white border-slate-950 shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Hover Motion Effect</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                  {buttonHovers.map((h) => (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => onChange({ buttonHover: h.id })}
                      className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                        theme.buttonHover === h.id
                          ? 'bg-slate-950 text-white border-slate-950 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {h.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Card Container Style</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {cardStyles.map((c) => {
                    const isCardSelected =
                      theme.cardStyle === c.id ||
                      (c.id === 'minimal' && (theme.cardStyle === 'card-white' || theme.cardStyle === 'card-flat')) ||
                      (c.id === 'glass' && theme.cardStyle === 'card-glass') ||
                      (c.id === '3d' && theme.cardStyle === 'card-bordered');

                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => onChange({ cardStyle: c.id })}
                        className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                          isCardSelected
                            ? 'bg-slate-950 text-white border-slate-950 shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Accordion Row: Social Icon Style */}
        <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white">
          <button
            type="button"
            onClick={() => toggleSection('socials')}
            className="w-full flex items-center justify-between p-3.5 bg-slate-50/50 hover:bg-slate-50 font-bold text-xs text-slate-800"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-slate-900" />
              <span>Social Icon Style</span>
            </div>
            {openSections.socials ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
          {openSections.socials && (
            <div className="p-4 space-y-4">
              {/* Size */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Icon Size</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'small', label: 'Small (28px)' },
                    { id: 'medium', label: 'Medium (36px)' },
                    { id: 'large', label: 'Large (44px)' },
                  ].map((sz) => (
                    <button
                      key={sz.id}
                      type="button"
                      onClick={() => onChange({ socialIconSize: sz.id })}
                      className={`py-2 px-1 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                        (theme.socialIconSize || 'medium') === sz.id
                          ? 'bg-slate-950 text-white border-slate-950 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {sz.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Shape */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Icon Shape</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'circle', label: 'Circle' },
                    { id: 'rounded-square', label: 'Rounded Square' },
                    { id: 'square', label: 'Square' },
                  ].map((sh) => (
                    <button
                      key={sh.id}
                      type="button"
                      onClick={() => onChange({ socialIconShape: sh.id })}
                      className={`py-2 px-1 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                        (theme.socialIconShape || 'circle') === sh.id
                          ? 'bg-slate-950 text-white border-slate-950 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {sh.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fill */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Icon Fill</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'outline', label: 'Outline' },
                    { id: 'solid', label: 'Solid' },
                  ].map((fl) => (
                    <button
                      key={fl.id}
                      type="button"
                      onClick={() => onChange({ socialIconFill: fl.id })}
                      className={`py-2 px-1 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                        (theme.socialIconFill || 'outline') === fl.id
                          ? 'bg-slate-950 text-white border-slate-950 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {fl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-600 block">Icon Color</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={theme.socialIconColor || '#0F172A'}
                      onChange={(e) => onChange({ socialIconColor: e.target.value })}
                      className="w-7 h-7 rounded cursor-pointer p-0 border-0"
                    />
                    <input
                      type="text"
                      value={theme.socialIconColor || '#0F172A'}
                      onChange={(e) => onChange({ socialIconColor: e.target.value })}
                      className="w-full text-[10px] font-mono px-1.5 py-1 rounded bg-white border border-slate-200 uppercase text-slate-800"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-600 block">Bg Color</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={theme.socialIconBg || '#FFFFFF'}
                      onChange={(e) => onChange({ socialIconBg: e.target.value })}
                      className="w-7 h-7 rounded cursor-pointer p-0 border-0"
                    />
                    <input
                      type="text"
                      value={theme.socialIconBg || '#FFFFFF'}
                      onChange={(e) => onChange({ socialIconBg: e.target.value })}
                      className="w-full text-[10px] font-mono px-1.5 py-1 rounded bg-white border border-slate-200 uppercase text-slate-800"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-600 block">Border Color</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={theme.socialIconBorder || '#E2E8F0'}
                      onChange={(e) => onChange({ socialIconBorder: e.target.value })}
                      className="w-7 h-7 rounded cursor-pointer p-0 border-0"
                    />
                    <input
                      type="text"
                      value={theme.socialIconBorder || '#E2E8F0'}
                      onChange={(e) => onChange({ socialIconBorder: e.target.value })}
                      className="w-full text-[10px] font-mono px-1.5 py-1 rounded bg-white border border-slate-200 uppercase text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Spacing */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Icon Spacing</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'tight', label: 'Tight' },
                    { id: 'normal', label: 'Normal' },
                    { id: 'relaxed', label: 'Relaxed' },
                  ].map((sp) => (
                    <button
                      key={sp.id}
                      type="button"
                      onClick={() => onChange({ socialIconSpacing: sp.id })}
                      className={`py-2 px-1 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                        (theme.socialIconSpacing || 'normal') === sp.id
                          ? 'bg-slate-950 text-white border-slate-950 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {sp.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Layout */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Icon Layout</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'row', label: 'Single Row' },
                    { id: 'two-rows', label: 'Two Rows' },
                    { id: 'wrap', label: 'Wrap' },
                  ].map((ly) => (
                    <button
                      key={ly.id}
                      type="button"
                      onClick={() => onChange({ socialIconLayout: ly.id })}
                      className={`py-2 px-1 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                        (theme.socialIconLayout || 'row') === ly.id
                          ? 'bg-slate-950 text-white border-slate-950 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {ly.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Alignment */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Icon Alignment</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'left', label: 'Left' },
                    { id: 'center', label: 'Center' },
                    { id: 'right', label: 'Right' },
                  ].map((al) => (
                    <button
                      key={al.id}
                      type="button"
                      onClick={() => onChange({ socialIconAlign: al.id })}
                      className={`py-2 px-1 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                        (theme.socialIconAlign || 'center') === al.id
                          ? 'bg-slate-950 text-white border-slate-950 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {al.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Accordion Row 3: Colors */}
        <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white">
          <button
            type="button"
            onClick={() => toggleSection('colors')}
            className="w-full flex items-center justify-between p-3.5 bg-slate-50/50 hover:bg-slate-50 font-bold text-xs text-slate-800"
          >
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-slate-900" />
              <span>Colors &amp; Theme Palette</span>
            </div>
            {openSections.colors ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
          {openSections.colors && (
            <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[11px] font-semibold text-slate-600">Button Background</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.buttonColor}
                    onChange={(e) => onChange({ buttonColor: e.target.value })}
                    className="w-7 h-7 rounded cursor-pointer p-0 border-0"
                  />
                  <input
                    type="text"
                    value={theme.buttonColor}
                    onChange={(e) => onChange({ buttonColor: e.target.value })}
                    className="w-full text-xs font-mono px-2 py-1 rounded bg-white border border-slate-200 uppercase text-slate-800"
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[11px] font-semibold text-slate-600">Button Text Color</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.buttonTextColor}
                    onChange={(e) => onChange({ buttonTextColor: e.target.value })}
                    className="w-7 h-7 rounded cursor-pointer p-0 border-0"
                  />
                  <input
                    type="text"
                    value={theme.buttonTextColor}
                    onChange={(e) => onChange({ buttonTextColor: e.target.value })}
                    className="w-full text-xs font-mono px-2 py-1 rounded bg-white border border-slate-200 uppercase text-slate-800"
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[11px] font-semibold text-slate-600">Button Border Color</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.buttonBorderColor || theme.buttonColor}
                    onChange={(e) => onChange({ buttonBorderColor: e.target.value })}
                    className="w-7 h-7 rounded cursor-pointer p-0 border-0"
                  />
                  <input
                    type="text"
                    value={theme.buttonBorderColor || theme.buttonColor}
                    onChange={(e) => onChange({ buttonBorderColor: e.target.value })}
                    className="w-full text-xs font-mono px-2 py-1 rounded bg-white border border-slate-200 uppercase text-slate-800"
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[11px] font-semibold text-slate-600">Heading Color</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.headingColor}
                    onChange={(e) => onChange({ headingColor: e.target.value })}
                    className="w-7 h-7 rounded cursor-pointer p-0 border-0"
                  />
                  <input
                    type="text"
                    value={theme.headingColor}
                    onChange={(e) => onChange({ headingColor: e.target.value })}
                    className="w-full text-xs font-mono px-2 py-1 rounded bg-white border border-slate-200 uppercase text-slate-800"
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[11px] font-semibold text-slate-600">Body Text Color</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.textColor}
                    onChange={(e) => onChange({ textColor: e.target.value })}
                    className="w-7 h-7 rounded cursor-pointer p-0 border-0"
                  />
                  <input
                    type="text"
                    value={theme.textColor}
                    onChange={(e) => onChange({ textColor: e.target.value })}
                    className="w-full text-xs font-mono px-2 py-1 rounded bg-white border border-slate-200 uppercase text-slate-800"
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[11px] font-semibold text-slate-600">Link Hover Accent</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.linkHoverColor}
                    onChange={(e) => onChange({ linkHoverColor: e.target.value })}
                    className="w-7 h-7 rounded cursor-pointer p-0 border-0"
                  />
                  <input
                    type="text"
                    value={theme.linkHoverColor}
                    onChange={(e) => onChange({ linkHoverColor: e.target.value })}
                    className="w-full text-xs font-mono px-2 py-1 rounded bg-white border border-slate-200 uppercase text-slate-800"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Accordion Row 4: Text & Typography */}
        <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white">
          <button
            type="button"
            onClick={() => toggleSection('text')}
            className="w-full flex items-center justify-between p-3.5 bg-slate-50/50 hover:bg-slate-50 font-bold text-xs text-slate-800"
          >
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-slate-900" />
              <span>Typography &amp; Fonts</span>
            </div>
            {openSections.text ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
          {openSections.text && (
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Heading Font</label>
                  <select
                    value={theme.headingFont || theme.fontFamily}
                    onChange={(e) => {
                      const selectedFont = e.target.value as FontFamily;
                      onChange({ headingFont: selectedFont, fontFamily: selectedFont });
                    }}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800"
                  >
                    {fonts.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Body Font</label>
                  <select
                    value={theme.bodyFont || theme.fontFamily}
                    onChange={(e) => onChange({ bodyFont: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800"
                  >
                    {fonts.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Base Font Size</label>
                  <div className="flex gap-1.5">
                    {[
                      { label: 'Small', value: 14 },
                      { label: 'Medium', value: 16 },
                      { label: 'Large', value: 18 },
                    ].map((sz) => (
                      <button
                        key={sz.value}
                        type="button"
                        onClick={() => onChange({ baseSize: sz.value })}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer ${
                          theme.baseSize === sz.value
                            ? 'bg-slate-950 text-white border-slate-950 shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {sz.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Font Weight</label>
                  <div className="flex gap-1.5">
                    {[
                      { label: 'Regular', value: 'normal' },
                      { label: 'Medium', value: 'medium' },
                      { label: 'Semibold', value: 'semibold' },
                    ].map((fw) => (
                      <button
                        key={fw.value}
                        type="button"
                        onClick={() => onChange({ fontWeight: fw.value })}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer ${
                          theme.fontWeight === fw.value
                            ? 'bg-slate-950 text-white border-slate-950 shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {fw.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Letter Spacing</label>
                  <div className="flex gap-1.5">
                    {[
                      { label: 'Tight', value: 'tight' },
                      { label: 'Normal', value: 'normal' },
                      { label: 'Wide', value: 'wide' },
                    ].map((ls) => (
                      <button
                        key={ls.value}
                        type="button"
                        onClick={() => onChange({ letterSpacing: ls.value })}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer ${
                          theme.letterSpacing === ls.value
                            ? 'bg-slate-950 text-white border-slate-950 shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {ls.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Accordion Row 5: Stickers */}
        <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white">
          <button
            type="button"
            onClick={() => toggleSection('stickers')}
            className="w-full flex items-center justify-between p-3.5 bg-slate-50/50 hover:bg-slate-50 font-bold text-xs text-slate-800"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-slate-900" />
              <span>Decorative Stickers</span>
            </div>
            {openSections.stickers ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
          {openSections.stickers && (
            <div className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {stickerPacks.map((pack) => (
                  <button
                    key={pack.id}
                    type="button"
                    onClick={() => onChange({ stickerPack: pack.id })}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                      (theme.stickerPack || 'none') === pack.id
                        ? 'bg-slate-950 text-white border-slate-950 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {pack.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profile Footer Badge Info */}
      <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-slate-50/60 p-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <span className="font-bold text-slate-700">Profile Footer Branding</span>
          <span className="font-extrabold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100 tracking-wide">
            Made with LinkVM — 100% Free Forever
          </span>
        </div>
      </div>
    </div>
  );
};
