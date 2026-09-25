import React, { useRef, useState } from 'react';
import { Upload, Trash2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { User } from '../../types';

interface MediaManagerProps {
  avatarUrl: string;
  onAvatarChange: (url: string) => void;
  user: User;
}

export const MediaManager: React.FC<MediaManagerProps> = ({ avatarUrl, onAvatarChange, user }) => {
  const [error, setError] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5MB

  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    if (!file.type.startsWith('image/')) {
      setError('Avatar must be an image file (JPG, PNG, or WEBP).');
      return;
    }
    if (file.size > MAX_AVATAR_SIZE) {
      setError('Avatar image must be smaller than 5 MB.');
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      onAvatarChange(dataUrl);
    } catch {
      setError('Failed to process image file.');
    }
  };

  const handleRemoveAvatar = () => {
    onAvatarChange('');
  };

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
          JPG, PNG, or WEBP. Max 5 MB. Appears as your main profile avatar.
        </p>

        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="font-bold text-lg text-slate-600">
                {user.name ? user.name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <input
              type="file"
              ref={avatarInputRef}
              accept="image/*"
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

            {avatarUrl && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-rose-600 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 size={14} />
                <span>Remove</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
