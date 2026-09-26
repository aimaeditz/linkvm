import React from 'react';
import * as Icons from 'lucide-react';
import { Globe } from 'lucide-react';

const COMMON_ICONS = [
  'Globe',
  'Link',
  'Github',
  'Twitter',
  'Instagram',
  'Youtube',
  'Linkedin',
  'Twitch',
  'Music',
  'Mail',
  'MessageCircle',
  'ShoppingBag',
  'BookOpen',
  'Camera',
  'Video',
  'Headphones',
  'Calendar',
  'FileText',
  'Sparkles',
  'Star',
  'Heart',
  'Compass',
  'Code',
  'Briefcase',
];

export function getIconComponent(name?: string | null): React.ComponentType<{ className?: string }> {
  if (!name) return Globe;
  const Component = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name];
  return Component || Globe;
}

interface IconPickerProps {
  selectedIcon?: string | null;
  onSelectIcon: (iconName: string) => void;
  onClose?: () => void;
}

export const IconPicker: React.FC<IconPickerProps> = ({
  selectedIcon,
  onSelectIcon,
}) => {
  return (
    <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl max-h-48 overflow-y-auto">
      <div className="text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">Select Icon</div>
      <div className="grid grid-cols-6 gap-2">
        {COMMON_ICONS.map((iconName) => {
          const IconComp = getIconComponent(iconName);
          const isSelected = selectedIcon === iconName;
          return (
            <button
              key={iconName}
              type="button"
              onClick={() => onSelectIcon(iconName)}
              className={`p-2 rounded-xl flex items-center justify-center transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200/80'
              }`}
              title={iconName}
            >
              <IconComp className="w-4 h-4" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
