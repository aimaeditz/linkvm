import React, { useState, useEffect } from 'react';
import { User, SocialLinks, LinkItem, ThemeConfig } from '../../types';
import { ProfileForm } from './ProfileForm';
import { SocialLinksForm } from './SocialLinksForm';
import { PasswordForm } from './PasswordForm';
import { SessionsPanel } from './SessionsPanel';
import { NotificationsForm } from './NotificationsForm';
import { PrivacyForm } from './PrivacyForm';
import { DangerZone } from './DangerZone';
import { StorageService } from '../../lib/storage';
import { profileSchema, usernameSchema } from '../../lib/validators';
import {
  User as UserIcon,
  Share2,
  KeyRound,
  Bell,
  Shield,
  AlertTriangle,
  Save,
  Check,
  Loader2,
  XCircle,
} from 'lucide-react';

interface SettingsPageProps {
  user: User;
  socials: SocialLinks;
  onUserUpdate: () => void;
  onLogout: () => void;
  links?: LinkItem[];
  theme?: ThemeConfig;
  setSaveStatus?: (status: 'idle' | 'saving' | 'saved' | 'error') => void;
  setSaveError?: (err: string | null) => void;
  onRetryRef?: React.MutableRefObject<(() => void) | null>;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  user,
  socials,
  onUserUpdate,
  onLogout,
  links,
  theme,
  setSaveStatus,
  setSaveError,
  onRetryRef,
}) => {
  const [activeTab, setActiveTab] = useState<
    'profile' | 'socials' | 'account' | 'notifications' | 'privacy' | 'danger'
  >('profile');

  const activeLinks = links || StorageService.getLinks();
  const activeTheme = theme || StorageService.getTheme();

  // Draft states
  const [profileDraft, setProfileDraft] = useState({
    name: user.name || '',
    username: user.username || '',
    bio: user.bio || '',
    avatarUrl: user.avatarUrl || '',
    sharePattern: user.sharePattern || '{username}',
  });

  const [socialsDraft, setSocialsDraft] = useState<SocialLinks>({ ...socials });

  const [notificationsDraft, setNotificationsDraft] = useState({
    weeklySummary: user.notifications?.weeklySummary ?? true,
  });

  const [privacyDraft, setPrivacyDraft] = useState({
    searchIndexing: user.privacy?.searchIndexing ?? true,
    anonymousAnalytics: user.privacy?.anonymousAnalytics ?? false,
  });

  // Username status tracking (passes up from ProfileForm)
  const [usernameCheckStatus, setUsernameCheckStatus] = useState<
    'idle' | 'checking' | 'available' | 'taken' | 'reserved' | 'invalid' | 'same'
  >('same');
  const [validationError, setValidationError] = useState<string>('');
  const [isSocialsValid, setIsSocialsValid] = useState(true);

  // Local feedback states
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Sync draft with fresh user/social data when loaded
  useEffect(() => {
    setProfileDraft({
      name: user.name || '',
      username: user.username || '',
      bio: user.bio || '',
      avatarUrl: user.avatarUrl || '',
      sharePattern: user.sharePattern || '{username}',
    });
    setNotificationsDraft({
      weeklySummary: user.notifications?.weeklySummary ?? true,
    });
    setPrivacyDraft({
      searchIndexing: user.privacy?.searchIndexing ?? true,
      anonymousAnalytics: user.privacy?.anonymousAnalytics ?? false,
    });
  }, [user]);

  useEffect(() => {
    setSocialsDraft({ ...socials });
  }, [socials]);

  // Dirty flags computation
  const isProfileDirty =
    profileDraft.name !== (user.name || '') ||
    profileDraft.username !== (user.username || '') ||
    profileDraft.bio !== (user.bio || '') ||
    profileDraft.avatarUrl !== (user.avatarUrl || '') ||
    profileDraft.sharePattern !== (user.sharePattern || '{username}');

  const isSocialsDirty = Object.keys(socialsDraft).some((key) => {
    if (key === 'id' || key === 'userId') return false;
    const val1 = (socialsDraft as any)[key] || '';
    const val2 = (socials as any)[key] || '';
    return val1 !== val2;
  });

  const isNotificationsDirty =
    notificationsDraft.weeklySummary !== (user.notifications?.weeklySummary ?? true);

  const isPrivacyDirty =
    privacyDraft.searchIndexing !== (user.privacy?.searchIndexing ?? true) ||
    privacyDraft.anonymousAnalytics !== (user.privacy?.anonymousAnalytics ?? false);

  const isDirty = isProfileDirty || isSocialsDirty || isNotificationsDirty || isPrivacyDirty;

  const isSaveDisabled =
    !isDirty ||
    isSaving ||
    !isSocialsValid ||
    ['checking', 'taken', 'reserved', 'invalid'].includes(usernameCheckStatus);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'socials', label: 'Social', icon: Share2 },
    { id: 'account', label: 'Account', icon: KeyRound },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
  ];

  const handleGlobalSave = () => {
    if (isSaveDisabled) return;

    setIsSaving(true);
    if (setSaveStatus) setSaveStatus('saving');
    setLocalError(null);
    if (setSaveError) setSaveError(null);

    // Zod validations
    if (isProfileDirty) {
      const profileVal = profileSchema.safeParse({
        name: profileDraft.name,
        bio: profileDraft.bio,
        avatarUrl: profileDraft.avatarUrl,
      });
      if (!profileVal.success) {
        const errMsg = profileVal.error.issues[0].message;
        setLocalError(errMsg);
        if (setSaveError) setSaveError(errMsg);
        if (setSaveStatus) setSaveStatus('error');
        setIsSaving(false);
        return;
      }

      const usernameVal = usernameSchema.safeParse({
        username: profileDraft.username,
      });
      if (!usernameVal.success) {
        const errMsg = usernameVal.error.issues[0].message;
        setLocalError(errMsg);
        if (setSaveError) setSaveError(errMsg);
        if (setSaveStatus) setSaveStatus('error');
        setIsSaving(false);
        return;
      }
    }

    // Perform real update
    try {
      if (isProfileDirty || isNotificationsDirty || isPrivacyDirty) {
        StorageService.updateUser({
          name: profileDraft.name.trim() || null,
          username: profileDraft.username.trim().toLowerCase(),
          bio: profileDraft.bio.trim() || null,
          avatarUrl: profileDraft.avatarUrl.trim() || null,
          sharePattern: profileDraft.sharePattern,
          notifications: {
            ...user.notifications,
            weeklySummary: notificationsDraft.weeklySummary,
            securityAlerts: true,
          },
          privacy: {
            ...user.privacy,
            searchIndexing: privacyDraft.searchIndexing,
            anonymousAnalytics: privacyDraft.anonymousAnalytics,
          },
        });
      }

      if (isSocialsDirty) {
        StorageService.updateSocials(socialsDraft);
      }

      // Success feedback
      setIsSaving(false);
      setSaveSuccess(true);
      if (setSaveStatus) setSaveStatus('saved');
      setUsernameCheckStatus('same');
      onUserUpdate();

      setTimeout(() => {
        setSaveSuccess(false);
        if (setSaveStatus) setSaveStatus('idle');
      }, 2500);
    } catch (err: any) {
      const errMsg = err?.message || 'Failed to save changes. Please try again.';
      setLocalError(errMsg);
      if (setSaveError) setSaveError(errMsg);
      if (setSaveStatus) setSaveStatus('error');
      setIsSaving(false);
    }
  };

  const handleGlobalCancel = () => {
    // Reset drafts back to last-saved database state
    setProfileDraft({
      name: user.name || '',
      username: user.username || '',
      bio: user.bio || '',
      avatarUrl: user.avatarUrl || '',
      sharePattern: user.sharePattern || '{username}',
    });
    setSocialsDraft({ ...socials });
    setNotificationsDraft({
      weeklySummary: user.notifications?.weeklySummary ?? true,
    });
    setPrivacyDraft({
      searchIndexing: user.privacy?.searchIndexing ?? true,
      anonymousAnalytics: user.privacy?.anonymousAnalytics ?? false,
    });
    setUsernameCheckStatus('same');
    setValidationError('');
    setLocalError(null);
    if (setSaveError) setSaveError(null);
    if (setSaveStatus) setSaveStatus('idle');
  };

  // Provide save retry trigger
  if (onRetryRef) {
    onRetryRef.current = handleGlobalSave;
  }

  return (
    <div className="space-y-6 w-full min-w-0 font-sans pb-12 relative">
      {/* Toast alert banner for error feedback */}
      {localError && (
        <div className="fixed bottom-6 left-6 z-50 p-4 rounded-2xl bg-rose-50 border border-rose-200 shadow-xl max-w-sm flex items-start gap-3 animate-in slide-in-from-bottom duration-350">
          <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-slate-900">Validation / Save Error</p>
            <p className="text-[11px] text-rose-700 font-medium leading-relaxed mt-0.5">{localError}</p>
          </div>
        </div>
      )}

      {/* Toast banner for success feedback */}
      {saveSuccess && (
        <div className="fixed bottom-6 left-6 z-50 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-xl max-w-sm flex items-start gap-3 animate-in slide-in-from-bottom duration-350">
          <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-slate-900">Success</p>
            <p className="text-[11px] text-emerald-700 font-medium leading-relaxed mt-0.5">Settings saved successfully!</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Settings &amp; Account
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage your credentials, alternative URLs, social channels, and data privacy.
          </p>
        </div>

        {/* Global Save / Cancel Action Row */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            disabled={!isDirty || isSaving}
            onClick={handleGlobalCancel}
            className={`px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer ${
              (!isDirty || isSaving) && 'opacity-50 cursor-not-allowed'
            }`}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSaveDisabled}
            onClick={handleGlobalSave}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-b from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 transition-all shadow-medium cursor-pointer ${
              isSaveDisabled ? 'bg-slate-300 opacity-60 cursor-not-allowed from-slate-300 to-slate-300' : ''
            }`}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saveSuccess ? (
              <Check className="w-4 h-4 text-emerald-300" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Tabs list (6 tabs, Header removed) */}
      <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-2xl overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                isActive
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Component */}
      <div className="pt-2">
        {activeTab === 'profile' && (
          <ProfileForm
            user={user}
            links={activeLinks}
            theme={activeTheme}
            formData={profileDraft}
            onChange={(updated) => setProfileDraft((prev) => ({ ...prev, ...updated }))}
            checkStatus={usernameCheckStatus}
            setCheckStatus={setUsernameCheckStatus}
            validationError={validationError}
            setValidationError={setValidationError}
          />
        )}
        {activeTab === 'socials' && (
          <SocialLinksForm
            formData={socialsDraft}
            onChange={(updated) => setSocialsDraft((prev) => ({ ...prev, ...updated }))}
            onValidityChange={setIsSocialsValid}
            user={{
              ...user,
              name: profileDraft.name,
              username: profileDraft.username,
              bio: profileDraft.bio,
              avatarUrl: profileDraft.avatarUrl,
            }}
            theme={activeTheme}
            links={activeLinks}
          />
        )}
        {activeTab === 'account' && (
          <div className="space-y-6">
            <PasswordForm />
            <SessionsPanel />
          </div>
        )}
        {activeTab === 'notifications' && (
          <NotificationsForm
            user={user}
            formData={notificationsDraft}
            onChange={(updated) => setNotificationsDraft((prev) => ({ ...prev, ...updated }))}
          />
        )}
        {activeTab === 'privacy' && (
          <PrivacyForm
            formData={privacyDraft}
            onChange={(updated) => setPrivacyDraft((prev) => ({ ...prev, ...updated }))}
          />
        )}
        {activeTab === 'danger' && <DangerZone onLogout={onLogout} />}
      </div>

      {/* Single Global Save Row at Bottom of Settings Area */}
      {activeTab !== 'account' && activeTab !== 'danger' && (
        <div className="mt-8 pt-6 border-t border-slate-200/80 flex items-center justify-end gap-3 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-xs">
          <button
            type="button"
            disabled={!isDirty || isSaving}
            onClick={handleGlobalCancel}
            className={`px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer ${
              (!isDirty || isSaving) && 'opacity-50 cursor-not-allowed'
            }`}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSaveDisabled}
            onClick={handleGlobalSave}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-b from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 transition-all shadow-medium cursor-pointer ${
              isSaveDisabled ? 'bg-slate-300 opacity-60 cursor-not-allowed from-slate-300 to-slate-300' : ''
            }`}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saveSuccess ? (
              <Check className="w-4 h-4 text-emerald-300" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Changes'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
