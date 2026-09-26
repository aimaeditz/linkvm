import React, { useState, useEffect, useRef } from 'react';
import { SocialLinks, User, LinkItem, ThemeConfig } from '../../types';
import { validateSocialLink, platformDisplayNames, platformPlaceholders, SocialFieldName } from '../../lib/social-validators';
import { StorageService } from '../../lib/storage';
import { AutoSaveIndicator } from './AutoSaveIndicator';
import { ProfilePreview } from './ProfilePreview';
import { MobilePreviewToggle } from './MobilePreviewToggle';
import {
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  Github,
  Music,
  Phone,
  Send,
  MessageSquare,
  Tv,
  Mail,
  Globe,
  CheckCircle,
  XCircle,
  Sparkles,
} from 'lucide-react';

interface SocialLinksFormProps {
  formData: SocialLinks;
  onChange: (updated: Partial<SocialLinks>) => void;
  onValidityChange?: (isValid: boolean) => void;
  user?: User;
  theme?: ThemeConfig;
  links?: LinkItem[];
}

export const SocialLinksForm: React.FC<SocialLinksFormProps> = ({
  formData,
  onChange,
  onValidityChange,
  user,
  theme,
  links,
}) => {
  const activeUser = user || StorageService.getCurrentUser() || {
    id: 'guest',
    name: 'Creator',
    username: 'creator',
    email: 'creator@linkvm.online',
    bio: 'Consolidate all your links into one place.',
    avatarUrl: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const activeLinks = links || StorageService.getLinks();
  const activeTheme = theme || StorageService.getTheme();

  // Local state for validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'idle' | 'error'>('saved');

  // Debounced auto-save ref
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Define fields in the precise order requested
  const fields: { id: SocialFieldName; label: string; placeholder: string; icon: React.ReactNode }[] = [
    { id: 'instagram', label: 'Instagram', placeholder: platformPlaceholders.instagram, icon: <Instagram className="w-4 h-4 text-slate-400" /> },
    { id: 'youtube', label: 'YouTube', placeholder: platformPlaceholders.youtube, icon: <Youtube className="w-4 h-4 text-slate-400" /> },
    { id: 'twitter', label: 'X (Twitter)', placeholder: platformPlaceholders.twitter, icon: <Twitter className="w-4 h-4 text-slate-400" /> },
    { id: 'linkedin', label: 'LinkedIn', placeholder: platformPlaceholders.linkedin, icon: <Linkedin className="w-4 h-4 text-slate-400" /> },
    { id: 'github', label: 'GitHub', placeholder: platformPlaceholders.github, icon: <Github className="w-4 h-4 text-slate-400" /> },
    { id: 'tiktok', label: 'TikTok', placeholder: platformPlaceholders.tiktok, icon: <Music className="w-4 h-4 text-slate-400" /> },
    { id: 'whatsapp', label: 'WhatsApp', placeholder: platformPlaceholders.whatsapp, icon: <Phone className="w-4 h-4 text-slate-400" /> },
    { id: 'telegram', label: 'Telegram', placeholder: platformPlaceholders.telegram, icon: <Send className="w-4 h-4 text-slate-400" /> },
    { id: 'discord', label: 'Discord', placeholder: platformPlaceholders.discord, icon: <MessageSquare className="w-4 h-4 text-slate-400" /> },
    { id: 'twitch', label: 'Twitch', placeholder: platformPlaceholders.twitch, icon: <Tv className="w-4 h-4 text-slate-400" /> },
    { id: 'spotify', label: 'Spotify', placeholder: platformPlaceholders.spotify, icon: <Music className="w-4 h-4 text-slate-400" /> },
    { id: 'email', label: 'Email', placeholder: platformPlaceholders.email, icon: <Mail className="w-4 h-4 text-slate-400" /> },
    { id: 'website', label: 'Personal Website', placeholder: platformPlaceholders.website, icon: <Globe className="w-4 h-4 text-slate-400" /> },
  ];

  // Perform a full validation sweep and report validity back to parent
  const validateAllFields = (currentState: SocialLinks) => {
    const newErrors: Record<string, string> = {};
    let isAllValid = true;

    fields.forEach((field) => {
      const val = (currentState as unknown as Record<string, string | null | undefined>)[field.id] || '';
      if (val) {
        const validation = validateSocialLink(field.id, val);
        if (!validation.isValid) {
          newErrors[field.id] = validation.error || 'Invalid link';
          isAllValid = false;
        }
      }
    });

    setErrors(newErrors);
    if (onValidityChange) {
      onValidityChange(isAllValid);
    }
    return isAllValid;
  };

  const handleChange = (key: SocialFieldName, value: string) => {
    // Notify parent immediately for real-time live preview update
    const updatedDraft = { ...formData, [key]: value || null };
    onChange({ [key]: value || null });

    // Validate the changed field specifically
    const validation = validateSocialLink(key, value);
    setErrors((prev) => {
      const copy = { ...prev };
      if (!validation.isValid && value) {
        copy[key] = validation.error || 'Invalid link';
      } else {
        delete copy[key];
      }
      return copy;
    });

    // Report aggregate validity to parent
    const hasAnyError = !validation.isValid && value;
    if (onValidityChange) {
      const currentErrors = { ...errors };
      if (!validation.isValid && value) {
        currentErrors[key] = validation.error || 'Invalid link';
      } else {
        delete currentErrors[key];
      }
      onValidityChange(Object.keys(currentErrors).length === 0);
    }

    // Debounce the auto-save to Database/StorageService (800ms)
    setAutoSaveStatus('saving');

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      const isAllValid = validateAllFields(updatedDraft);
      if (isAllValid) {
        try {
          StorageService.updateSocials(updatedDraft);
          setAutoSaveStatus('saved');
        } catch (err) {
          setAutoSaveStatus('error');
        }
      } else {
        setAutoSaveStatus('error');
      }
    }, 800);
  };

  // Perform initial validation sweep on mount
  useEffect(() => {
    validateAllFields(formData);
    return () => {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    };
  }, []);

  // Split into left grid, right grid, and footer row as requested
  const gridFields = fields.slice(0, 12);
  const leftGridFields = gridFields.slice(0, 6);
  const rightGridFields = gridFields.slice(6, 12);
  const fullWidthField = fields[12]; // website

  const renderField = (field: typeof fields[0]) => {
    const val = (formData as unknown as Record<string, string | null | undefined>)[field.id] || '';
    const hasError = Boolean(errors[field.id]);
    const isValidAndFilled = val && !hasError;

    return (
      <div key={field.id} className="space-y-1.5 w-full">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            {field.icon}
            <span>{field.label}</span>
          </label>
          {isValidAndFilled && (
            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Valid URL</span>
            </span>
          )}
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder={field.placeholder}
            value={val}
            onChange={(e) => handleChange(field.id, e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono transition-all ${
              hasError
                ? 'border-rose-300 bg-rose-50/20 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                : isValidAndFilled
                ? 'border-emerald-300 bg-emerald-50/10 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                : 'border-slate-200 focus:border-slate-900 bg-white'
            }`}
          />
        </div>
        {hasError && (
          <p className="text-[11px] font-medium text-rose-600 animate-in fade-in slide-in-from-top-1 duration-200">
            {errors[field.id]}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-start">
      {/* Left Area (60%): Redesigned Form Fields */}
      <div className="lg:col-span-7 space-y-6 w-full">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-6 shadow-xs relative">
          {/* Header & AutoSave status */}
          <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Social Connections</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Paste your absolute profile URLs. Cross-platform links are rejected automatically.
              </p>
            </div>
            <div className="shrink-0">
              <AutoSaveIndicator status={autoSaveStatus} />
            </div>
          </div>

          {/* Dual Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="space-y-4">{leftGridFields.map(renderField)}</div>
            <div className="space-y-4">{rightGridFields.map(renderField)}</div>
          </div>

          {/* Full-width Website Row */}
          <div className="pt-4 border-t border-slate-100 w-full">
            {renderField(fullWidthField)}
          </div>
        </div>
      </div>

      {/* Right Area (40%, sticky): Live Phone Preview */}
      <div className="lg:col-span-5 space-y-6 sticky top-6 hidden lg:block">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col items-center justify-center shadow-xs">
          <ProfilePreview
            user={activeUser}
            links={activeLinks}
            theme={activeTheme}
            socials={formData}
          />
        </div>
      </div>

      {/* Floating Preview button for Mobile Drawer support */}
      <MobilePreviewToggle
        user={activeUser}
        links={activeLinks}
        theme={activeTheme}
        socials={formData}
      />
    </div>
  );
};
