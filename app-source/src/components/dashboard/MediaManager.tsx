import React, { useRef, useState } from 'react';
import { Upload, Trash2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { User } from '../../types';
import { StorageService } from '../../lib/storage';

interface MediaManagerProps {
  avatarUrl: string;
  onAvatarChange: (url: string) => void;
  user: User;
}

export const MediaManager: React.FC<MediaManagerProps> = ({ avatarUrl, onAvatarChange, user }) => {
  const [error, setError] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_MIME_TYPES.includes(file.type) || file.size > MAX_AVATAR_SIZE) {
      setError('Please choose a JPG, PNG, or WEBP under 5 MB.');
      if (avatarInputRef.current) {
        avatarInputRef.current.value = '';
      }
      return;
    }

    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return;

      onAvatarChange(dataUrl);
      const updatedUser = { ...user, avatarUrl: dataUrl };
      StorageService.setUser(updatedUser);
      StorageService.updateUser({ avatarUrl: dataUrl });
    };
    reader.onerror = () => {
      setError('Please choose a JPG, PNG, or WEBP under 5 MB.');
    };
    reader.readAsDataURL(file);

    if (avatarInputRef.current) {
      avatarInputRef.current.value = '';
    }
  };

  const handleRemoveAvatar = () => {
    setError(null);
    onAvatarChange('');
    const updatedUser = { ...user, avatarUrl: '' };
    StorageService.setUser(updatedUser);
    StorageService.updateUser({ avatarUrl: null });
    if (avatarInputRef.current) {
      avatarInputRef.current.value = '';
    }
  };

  const initials = user.name
    ? user.name.charAt(0).toUpperCase()
    : (user.username || 'C').charAt(0).toUpperCase();

  return (
    <div className="space-y-4 w-full">
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
          <ImageIcon size={16} className="text-indigo-600" />
          <span>Profile Picture</span>
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          JPG, PNG, or WEBP. Max 5 MB. Stored securely and linked to your profile.
        </p>

        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 shadow-xs relative">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="font-bold text-lg text-slate-600">{initials}</span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <input
              type="file"
              ref={avatarInputRef}
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Upload size={14} />
              <span>Upload photo</span>
            </button>

            {avatarUrl ? (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-rose-600 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 size={14} />
                <span>Remove</span>
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
