import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  GripVertical,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { User, LinkItem } from '../../types';
import { StorageService } from '../../lib/storage';
import { LinkFormModal } from './LinkFormModal';
import { getIconComponent } from './IconPicker';

interface LinksPageProps {
  user: User;
  links: LinkItem[];
  onLinksChange: () => void;
}

export const LinksPage: React.FC<LinksPageProps> = ({
  user,
  links,
  onLinksChange,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);

  const handleCreateOrUpdate = (linkData: {
    title: string;
    url: string;
    icon?: string | null;
    visible: boolean;
    openInNew: boolean;
    highlighted?: boolean;
    animation?: 'none' | 'pulse' | 'bounce' | 'glow';
  }) => {
    if (editingLink) {
      StorageService.updateLink(editingLink.id, linkData);
    } else {
      StorageService.addLink(linkData);
    }
    onLinksChange();
    setModalOpen(false);
    setEditingLink(null);
  };

  const handleDelete = (id: string) => {
    StorageService.deleteLink(id);
    onLinksChange();
  };

  const handleToggleVisible = (lnk: LinkItem) => {
    StorageService.updateLink(lnk.id, { visible: !lnk.visible });
    onLinksChange();
  };

  return (
    <div className="space-y-6 w-full font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Links &amp; Social Content
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Add unlimited social profiles, websites, video embeds, and portfolio items.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingLink(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl shadow-sm hover:shadow-indigo-600/20 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Link</span>
        </button>
      </div>

      {/* Links List */}
      {links.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-md mx-auto space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Plus className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Your page is empty</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Get started by adding your first link. You can add Instagram, YouTube, personal portfolio, or custom URLs!
          </p>
          <button
            onClick={() => {
              setEditingLink(null);
              setModalOpen(true);
            }}
            className="px-5 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            Create Your First Link
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {links.map((lnk, index) => {
            const IconComp = getIconComponent(lnk.icon);
            return (
              <div
                key={lnk.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs hover:border-slate-300 transition-all flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="text-slate-300 hover:text-slate-500 cursor-grab shrink-0 hidden sm:block">
                    <GripVertical className="w-4 h-4" />
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700 flex items-center justify-center shrink-0">
                    <IconComp className="w-5 h-5 text-slate-700" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-slate-900 truncate">{lnk.title}</p>
                      {lnk.highlighted && (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-extrabold">
                          <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                          <span>Featured</span>
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-mono text-slate-400 truncate mt-0.5">{lnk.url}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="hidden md:inline-block text-[11px] font-semibold text-slate-400 mr-2">
                    {lnk.clicks || 0} clicks
                  </span>

                  {/* Toggle Visibility */}
                  <button
                    onClick={() => handleToggleVisible(lnk)}
                    title={lnk.visible ? 'Hide from page' : 'Show on page'}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      lnk.visible
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                        : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}
                  >
                    {lnk.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => {
                      setEditingLink(lnk);
                      setModalOpen(true);
                    }}
                    title="Edit link"
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(lnk.id)}
                    title="Delete link"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <LinkFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleCreateOrUpdate}
        initialData={editingLink}
      />
    </div>
  );
};
