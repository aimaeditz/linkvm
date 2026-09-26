import React, { useState } from 'react';
import { StorageService } from '../../lib/storage';
import { Download, Trash2, AlertTriangle, X, Loader2, Check } from 'lucide-react';

interface DangerZoneProps {
  onLogout: () => void;
}

export const DangerZone: React.FC<DangerZoneProps> = ({ onLogout }) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmInput, setConfirmInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const blob = await StorageService.exportData();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `linkvm-account-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch {
      setError('Failed to export data.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmInput.trim() !== 'DELETE') {
      setError('You must type "DELETE" exactly to confirm.');
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await StorageService.deleteAccount();
      setDeleteModalOpen(false);
      onLogout();
    } catch (err: unknown) {
      console.error('Delete account error:', err);
      const errMsg =
        err instanceof Error
          ? err.message
          : 'Failed to delete account. If you signed in a long time ago, please log out and log back in before deleting.';
      setError(errMsg);
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Export Your Data</h3>
            <p className="text-xs text-slate-500">Download a complete JSON backup of your links, themes, profile settings, and analytics</p>
          </div>
          <button
            type="button"
            disabled={isExporting}
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50 shrink-0"
          >
            {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : exportSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
            <span>{isExporting ? 'Exporting…' : exportSuccess ? 'Exported!' : 'Export JSON Archive'}</span>
          </button>
        </div>
      </div>

      {/* Danger Zone Card */}
      <div className="bg-rose-50/40 rounded-3xl border border-rose-200 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-rose-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-950">Danger Zone</h3>
              <p className="text-xs text-rose-700">Permanent &amp; irreversible actions regarding your account and public profile</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setConfirmInput('');
              setError(null);
              setDeleteModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Account</span>
          </button>
        </div>
        <p className="text-xs text-rose-800/80 leading-relaxed">
          Deleting your account permanently removes your handle, bio links, theme customizations, socials, and analytics history from Firestore. This action is permanent and cannot be undone.
        </p>
      </div>

      {/* Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                <AlertTriangle className="w-5 h-5" />
                <span>Confirm Permanent Account Deletion</span>
              </div>
              <button
                onClick={() => {
                  if (!isDeleting) setDeleteModalOpen(false);
                }}
                disabled={isDeleting}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer disabled:opacity-40"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you completely sure you want to permanently delete your LinkVM account and all associated data (links, themes, profile, analytics)? This action is <strong className="text-rose-600 font-bold">strictly irreversible</strong>.
            </p>

            <p className="text-xs text-slate-600 leading-relaxed">
              To confirm, type <strong className="font-mono text-rose-600">DELETE</strong> in the box below:
            </p>

            {error && (
              <p className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-xl">
                {error}
              </p>
            )}

            <input
              type="text"
              disabled={isDeleting}
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              placeholder='Type "DELETE"'
              className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 text-xs font-mono uppercase focus:outline-hidden focus:border-rose-500 bg-rose-50/20"
            />

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting || confirmInput.trim() !== 'DELETE'}
                onClick={handleDeleteAccount}
                className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>{isDeleting ? 'Deleting Account…' : 'Delete Everything Permanently'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
