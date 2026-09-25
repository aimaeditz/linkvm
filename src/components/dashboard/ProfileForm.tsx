import React, { useEffect, useRef } from 'react';
import { User, LinkItem, ThemeConfig } from '../../types';
import { StorageService } from '../../lib/storage';
import { validateUsername, isReservedUsername } from '../../lib/reserved-usernames';
import { CheckCircle2, AlertCircle, Loader2, AlertTriangle, Link as LinkIcon } from 'lucide-react';
import { MediaManager } from './MediaManager';
import { PatternList } from './PatternList';
import { ProfilePreview } from './ProfilePreview';

interface ProfileFormProps {
  user: User;
  links?: LinkItem[];
  theme?: ThemeConfig;
  formData: {
    name: string;
    username: string;
    bio: string;
    avatarUrl: string;
    sharePattern: string;
  };
  onChange: (updated: Partial<ProfileFormProps['formData']>) => void;
  checkStatus: 'idle' | 'checking' | 'available' | 'taken' | 'reserved' | 'invalid' | 'same';
  setCheckStatus: (status: 'idle' | 'checking' | 'available' | 'taken' | 'reserved' | 'invalid' | 'same') => void;
  validationError: string;
  setValidationError: (err: string) => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  user,
  links,
  theme,
  formData,
  onChange,
  checkStatus,
  setCheckStatus,
  validationError,
  setValidationError,
}) => {
  const activeLinks = links || StorageService.getLinks();
  const activeTheme = theme || StorageService.getTheme();
  const debounceTimer = useRef<any>(null);

  const handleUsernameChange = (val: string) => {
    const clean = val.toLowerCase().replace(/[^a-z0-9_-]/g, '').trim();
    onChange({ username: clean });

    if (clean === user.username) {
      setCheckStatus('same');
      setValidationError('');
      return;
    }

    if (!clean) {
      setCheckStatus('invalid');
      setValidationError('Username is required.');
      return;
    }

    const validation = validateUsername(clean);
    if (!validation.valid) {
      if (isReservedUsername(clean)) {
        setCheckStatus('reserved');
        setValidationError('This username is reserved.');
      } else {
        setCheckStatus('invalid');
        setValidationError(validation.error || 'Invalid username format.');
      }
      return;
    }

    setCheckStatus('checking');
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      const isAvailable = StorageService.checkUsernameAvailability(clean, user.id);
      if (isAvailable) {
        setCheckStatus('available');
        setValidationError('');
      } else {
        setCheckStatus('taken');
        setValidationError('Already taken');
      }
    }, 400);
  };

  const handleSetDefaultPattern = (pattern: string) => {
    onChange({ sharePattern: pattern });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-start">
      {/* Left Column (60%): Media Manager & Main Profile Controls */}
      <div className="lg:col-span-7 space-y-6 w-full">
        {/* Real Media Upload System (Avatar only) */}
        <MediaManager
          avatarUrl={formData.avatarUrl}
          onAvatarChange={(url) => onChange({ avatarUrl: url })}
          user={user}
        />

        {/* Profile Details Form (No local save button) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-6 shadow-xs">
          <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Creator Identity &amp; Handle</h3>
              <p className="text-xs text-slate-500">Display name, unique username handle, bio, and avatar link</p>
            </div>
            <div className="text-xs font-mono font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl">
              linkvm.online/{formData.username || 'creator'}
            </div>
          </div>

          <div className="space-y-4">
            {/* Display Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Display Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => onChange({ name: e.target.value })}
                placeholder="e.g. Alex Rivera"
                maxLength={50}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-slate-900 transition"
              />
            </div>

            {/* Username Claim */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">LinkVM Username (Handle)</label>

                {checkStatus === 'checking' && (
                  <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin text-slate-400" /> Checking availability…
                  </span>
                )}
                {checkStatus === 'available' && (
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Available
                  </span>
                )}
                {checkStatus === 'taken' && (
                  <span className="text-[11px] font-bold text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Already taken
                  </span>
                )}
                {checkStatus === 'reserved' && (
                  <span className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Reserved username
                  </span>
                )}
                {checkStatus === 'invalid' && (
                  <span className="text-[11px] font-bold text-rose-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {validationError || 'Invalid username'}
                  </span>
                )}
              </div>

              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 font-bold select-none">
                  linkvm.online/
                </span>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  required
                  minLength={3}
                  maxLength={30}
                  placeholder="yourname"
                  className={`w-full pl-32 pr-3.5 py-2.5 rounded-xl border text-sm font-mono focus:outline-hidden transition ${
                    checkStatus === 'available'
                      ? 'border-emerald-300 focus:border-emerald-500 bg-emerald-50/20'
                      : checkStatus === 'taken' || checkStatus === 'invalid'
                      ? 'border-rose-300 focus:border-rose-500 bg-rose-50/20'
                      : checkStatus === 'reserved'
                      ? 'border-amber-300 focus:border-amber-500 bg-amber-50/20'
                      : 'border-slate-200 focus:border-slate-900'
                  }`}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                3-30 characters. Lowercase letters, numbers, dashes, and underscores allowed.
              </p>
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Bio Description</label>
                <span className="text-[11px] text-slate-400">{formData.bio.length}/160</span>
              </div>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => onChange({ bio: e.target.value })}
                maxLength={160}
                placeholder="Tell your audience who you are and what you create..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-slate-900 resize-none transition"
              />
            </div>

            {/* Avatar URL Override */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Avatar Image URL Override (Optional)</label>
              <input
                type="url"
                value={formData.avatarUrl}
                onChange={(e) => onChange({ avatarUrl: e.target.value })}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-hidden focus:border-slate-900 transition"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Column (40%, sticky): Alternative URLs Card + Phone Live Preview */}
      <div className="lg:col-span-5 space-y-6 sticky top-6">
        {/* Alternative URLs Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <LinkIcon size={16} className="text-indigo-600" />
              <span>Alternative URLs</span>
            </h3>
            <p className="text-xs text-slate-500">
              Same profile, different ways to share it. Every pattern is real and resolvable.
            </p>
          </div>

          <PatternList
            username={formData.username || user.username}
            currentPattern={formData.sharePattern}
            onSetDefault={handleSetDefaultPattern}
          />
        </div>

        {/* Live Phone Preview */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col items-center justify-center shadow-xs">
          <ProfilePreview
            user={{
              ...user,
              name: formData.name || user.name,
              username: formData.username || user.username,
              bio: formData.bio || user.bio,
              avatarUrl: formData.avatarUrl || user.avatarUrl,
              sharePattern: formData.sharePattern,
            }}
            links={activeLinks}
            theme={activeTheme}
          />
        </div>
      </div>
    </div>
  );
};
