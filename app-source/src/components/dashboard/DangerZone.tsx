import React, { useState } from 'react';
import { StorageService } from '../../lib/storage';
import { Download, Trash2, AlertTriangle, X } from 'lucide-react';

interface DangerZoneProps {
  onLogout: () => void;
}

export const DangerZone: React.FC<DangerZoneProps> = ({ onLogout }) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmInput, setConfirmInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    const blob = await StorageService.exportData();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `linkvm-account-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteAccount = async () => {
    if (confirmInput.trim() !== 'DELETE') {
      setError('You must type "DELETE" exactly to confirm.');
      return;
    }

    await StorageService.deleteAccount();
    onLogout();
  };

  return (
    <div className="space-y-6">
      {/* Export Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Export Your Data</h3>
            <p className="text-xs text-slate-500">Download a complete JSON backup of your links, themes, profile settings, and analytics</p>
          </div>
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON Archive</span>
          </button>
        </div>
      </div>

      {/* Danger Zone Card */}
      <div className="bg-rose-50/40 rounded-3xl border border-rose-200 p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-rose-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-950">Danger Zone</h3>
              <p className="text-xs text-rose-700">Irreversible actions regarding your account and public profile</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDeleteModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Account</span>
          </button>
        </div>
        <p className="text-xs text-rose-800/80 leading-relaxed">
          Deleting your account permanently removes your handle, bio links, theme customizations, and analytics history. This action cannot be undone.
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
                <span>Confirm Account Deletion</span>
              </div>
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you completely sure you want to permanently delete your LinkVM account? To proceed, please type <strong className="font-mono text-rose-600">DELETE</strong> in the input below.
            </p>

            {error && (
              <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2 rounded-lg">
                {error}
              </p>
            )}

            <input
              type="text"
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              placeholder='Type "DELETE"'
              className="w-full px-3.5 py-2 rounded-xl border border-rose-200 text-xs font-mono uppercase focus:outline-hidden focus:border-rose-500"
            />

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all shadow-xs"
              >
                Delete Everything Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
