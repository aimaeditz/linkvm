import React, { useState } from 'react';
import {
  Globe,
  Link as LinkIcon,
  Github,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Twitch,
  Facebook,
  Mail,
  Phone,
  MessageSquare,
  Send,
  Music,
  ShoppingBag,
  ShoppingCart,
  DollarSign,
  CreditCard,
  Briefcase,
  Folder,
  Code,
  Terminal,
  Cpu,
  Bookmark,
  Heart,
  Star,
  Sparkles,
  Camera,
  Video,
  Play,
  FileText,
  Book,
  Compass,
  MapPin,
  Calendar,
  Clock,
  Award,
  Zap,
  Flame,
  Coffee,
  Gift,
  HelpCircle,
  Share2,
  Download,
  Upload,
  Search,
  Check,
  X,
  Layers,
  Layout,
  Radio,
  Headphones,
  Podcast,
  Sliders,
  Smile,
  Shield,
  Tag,
  Key,
  Database,
  Cloud,
  Server,
  Monitor,
  Smartphone,
} from 'lucide-react';

export const ICONS_LIST = [
  { name: 'Globe', icon: Globe, category: 'General' },
  { name: 'Link', icon: LinkIcon, category: 'General' },
  { name: 'Github', icon: Github, category: 'Social' },
  { name: 'Twitter', icon: Twitter, category: 'Social' },
  { name: 'Instagram', icon: Instagram, category: 'Social' },
  { name: 'Linkedin', icon: Linkedin, category: 'Social' },
  { name: 'Youtube', icon: Youtube, category: 'Media' },
  { name: 'Twitch', icon: Twitch, category: 'Media' },
  { name: 'Facebook', icon: Facebook, category: 'Social' },
  { name: 'Mail', icon: Mail, category: 'Contact' },
  { name: 'Phone', icon: Phone, category: 'Contact' },
  { name: 'MessageSquare', icon: MessageSquare, category: 'Contact' },
  { name: 'Send', icon: Send, category: 'Contact' },
  { name: 'Music', icon: Music, category: 'Media' },
  { name: 'Headphones', icon: Headphones, category: 'Media' },
  { name: 'Podcast', icon: Podcast, category: 'Media' },
  { name: 'Play', icon: Play, category: 'Media' },
  { name: 'Video', icon: Video, category: 'Media' },
  { name: 'Camera', icon: Camera, category: 'Media' },
  { name: 'ShoppingBag', icon: ShoppingBag, category: 'Commerce' },
  { name: 'ShoppingCart', icon: ShoppingCart, category: 'Commerce' },
  { name: 'DollarSign', icon: DollarSign, category: 'Commerce' },
  { name: 'CreditCard', icon: CreditCard, category: 'Commerce' },
  { name: 'Gift', icon: Gift, category: 'Commerce' },
  { name: 'Coffee', icon: Coffee, category: 'Commerce' },
  { name: 'Briefcase', icon: Briefcase, category: 'Work' },
  { name: 'Folder', icon: Folder, category: 'Work' },
  { name: 'Code', icon: Code, category: 'Dev' },
  { name: 'Terminal', icon: Terminal, category: 'Dev' },
  { name: 'Cpu', icon: Cpu, category: 'Dev' },
  { name: 'Database', icon: Database, category: 'Dev' },
  { name: 'Cloud', icon: Cloud, category: 'Dev' },
  { name: 'Server', icon: Server, category: 'Dev' },
  { name: 'Monitor', icon: Monitor, category: 'Tech' },
  { name: 'Smartphone', icon: Smartphone, category: 'Tech' },
  { name: 'FileText', icon: FileText, category: 'General' },
  { name: 'Book', icon: Book, category: 'General' },
  { name: 'Bookmark', icon: Bookmark, category: 'General' },
  { name: 'Heart', icon: Heart, category: 'General' },
  { name: 'Star', icon: Star, category: 'General' },
  { name: 'Sparkles', icon: Sparkles, category: 'General' },
  { name: 'Zap', icon: Zap, category: 'General' },
  { name: 'Flame', icon: Flame, category: 'General' },
  { name: 'Award', icon: Award, category: 'General' },
  { name: 'Compass', icon: Compass, category: 'General' },
  { name: 'MapPin', icon: MapPin, category: 'General' },
  { name: 'Calendar', icon: Calendar, category: 'General' },
  { name: 'Clock', icon: Clock, category: 'General' },
  { name: 'Share2', icon: Share2, category: 'General' },
  { name: 'Download', icon: Download, category: 'General' },
  { name: 'Upload', icon: Upload, category: 'General' },
  { name: 'Shield', icon: Shield, category: 'General' },
  { name: 'Tag', icon: Tag, category: 'General' },
  { name: 'Key', icon: Key, category: 'General' },
  { name: 'Layers', icon: Layers, category: 'General' },
  { name: 'Layout', icon: Layout, category: 'General' },
  { name: 'Radio', icon: Radio, category: 'Media' },
  { name: 'Sliders', icon: Sliders, category: 'General' },
  { name: 'Smile', icon: Smile, category: 'General' },
  { name: 'HelpCircle', icon: HelpCircle, category: 'General' },
];

export const getIconComponent = (name?: string | null) => {
  if (!name) return Globe;
  const found = ICONS_LIST.find((i) => i.name.toLowerCase() === name.toLowerCase());
  return found ? found.icon : Globe;
};

interface IconPickerProps {
  selectedIcon?: string | null;
  onSelectIcon: (iconName: string) => void;
  onClose?: () => void;
}

export const IconPicker: React.FC<IconPickerProps> = ({
  selectedIcon,
  onSelectIcon,
  onClose,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'General', 'Social', 'Media', 'Commerce', 'Dev', 'Contact', 'Work'];

  const filtered = ICONS_LIST.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-3.5 space-y-3 shadow-lg">
      <div className="flex items-center justify-between gap-2">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search 60+ icons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-indigo-500"
          />
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold shrink-0 transition-colors ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-48 overflow-y-auto p-1">
        {filtered.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedIcon?.toLowerCase() === item.name.toLowerCase();
          return (
            <button
              key={item.name}
              type="button"
              onClick={() => onSelectIcon(item.name)}
              title={item.name}
              className={`p-2 rounded-xl flex flex-col items-center justify-center transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
            >
              <Icon className="w-4 h-4" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
