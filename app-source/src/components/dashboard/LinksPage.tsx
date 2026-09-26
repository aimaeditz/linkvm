import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, Search, Link2, AlertTriangle, X, Trash2 } from 'lucide-react';
import { User, LinkItem } from '../../types';
import { StorageService } from '../../lib/storage';
import { LinkCard } from './LinkCard';
import { LinkFormModal } from './LinkFormModal';
import { ProfilePreview } from './ProfilePreview';
import { MobilePreviewToggle } from './MobilePreviewToggle';
import { EmptyState } from '../shared/EmptyState';

interface SortableItemProps {
  link: LinkItem;
  onEdit: (link: LinkItem) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string, visible: boolean) => void;
}

const SortableLinkItem: React.FC<SortableItemProps> = ({
  link,
  onEdit,
  onDelete,
  onToggleVisibility,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <LinkCard
        link={link}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleVisibility={onToggleVisibility}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
};

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
  const [deletingLinkId, setDeletingLinkId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'hidden'>('all');

  const theme = StorageService.getTheme();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = links.findIndex((item) => item.id === active.id);
      const newIndex = links.findIndex((item) => item.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(links, oldIndex, newIndex);
        StorageService.reorderLinks(reordered.map((l) => l.id));
        onLinksChange();
      }
    }
  };

  const handleCreateOrUpdate = (data: {
    title: string;
    url: string;
    icon?: string | null;
    visible: boolean;
    openInNew: boolean;
    highlighted?: boolean;
    animation?: 'none' | 'pulse' | 'bounce' | 'glow';
  }) => {
    if (editingLink) {
      StorageService.updateLink(editingLink.id, data);
    } else {
      StorageService.addLink(data);
    }
    onLinksChange();
  };

  const confirmDelete = () => {
    if (deletingLinkId) {
      StorageService.deleteLink(deletingLinkId);
      setDeletingLinkId(null);
      onLinksChange();
    }
  };

  const handleToggleVisibility = (id: string, visible: boolean) => {
    StorageService.updateLink(id, { visible });
    onLinksChange();
  };

  const filteredLinks = links.filter((l) => {
    if (filter === 'active' && !l.visible) return false;
    if (filter === 'hidden' && l.visible) return false;

    return (
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.url.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const deletingLink = links.find((l) => l.id === deletingLinkId);

  return (
    <div className="space-y-6 animate-in fade-in duration-150 w-full min-w-0">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/60 w-full">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Links &amp; Content
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
              {links.length} Unlimited
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Add, edit, reorder, and style all the links displayed on your public page.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setEditingLink(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Link</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Left Column = Links Controls, Right Column = Sticky Narrow Phone Preview */}
      <div className="flex flex-col lg:flex-row gap-8 items-start w-full min-w-0">
        {/* Left Column: Link Controls */}
        <div className="flex-1 min-w-0 w-full space-y-4">
          {/* Search & Filter Bar */}
          {links.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
              {/* Filter Tabs */}
              <div className="flex items-center p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    filter === 'all'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  All ({links.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('active')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    filter === 'active'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Active ({links.filter((l) => l.visible).length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('hidden')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    filter === 'hidden'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Hidden ({links.filter((l) => !l.visible).length})
                </button>
              </div>

              <div className="relative w-full sm:w-48">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search links..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-slate-900 transition"
                />
              </div>
            </div>
          )}

          {/* Links List */}
          <div className="space-y-3">
            {links.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-8 text-center shadow-xs">
                <EmptyState
                  icon={<Link2 size={36} className="text-slate-400" />}
                  title="No links created yet"
                  description="Start building your link list with your top social profiles, portfolio projects, stores, or videos."
                  actionLabel="Add Your First Link"
                  onAction={() => {
                    setEditingLink(null);
                    setModalOpen(true);
                  }}
                />
              </div>
            ) : filteredLinks.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500">
                No links matched your filter or search query.
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={filteredLinks.map((l) => l.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {filteredLinks.map((link) => (
                      <SortableLinkItem
                        key={link.id}
                        link={link}
                        onEdit={(item) => {
                          setEditingLink(item);
                          setModalOpen(true);
                        }}
                        onDelete={(id) => setDeletingLinkId(id)}
                        onToggleVisibility={handleToggleVisibility}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>

        {/* Right Column: Desktop Sticky Phone Preview */}
        <div className="hidden lg:block w-[320px] xl:w-[340px] shrink-0 sticky top-24">
          <ProfilePreview user={user} links={links} theme={theme} />
        </div>
      </div>

      {/* Floating Mobile Preview Toggle (< lg) */}
      <MobilePreviewToggle user={user} links={links} theme={theme} />

      {/* Modal Form */}
      <LinkFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingLink(null);
        }}
        onSave={handleCreateOrUpdate}
        initialData={editingLink}
      />

      {/* Delete Confirmation Modal */}
      {deletingLinkId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                <AlertTriangle className="w-5 h-5" />
                <span>Delete Link</span>
              </div>
              <button
                onClick={() => setDeletingLinkId(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete{' '}
              <strong className="text-slate-900 font-bold">
                &ldquo;{deletingLink?.title || 'this link'}&rdquo;
              </strong>
              ? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingLinkId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
