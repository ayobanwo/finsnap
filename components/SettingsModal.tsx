'use client';
import { useState } from 'react';
import { X, Plus, Trash2, Check } from 'lucide-react';
import { Category, TransactionType } from '@/types';
import { ICON_OPTIONS, COLOR_OPTIONS } from '@/lib/data';
import { cn } from '@/lib/utils';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  onAddCategory: (c: Omit<Category, 'id'>) => void;
  onDeleteCategory: (id: string) => void;
  onClearData: () => void;
}

export default function SettingsModal({ open, onClose, categories, onAddCategory, onDeleteCategory, onClearData }: SettingsModalProps) {
  const [tab, setTab] = useState<'categories' | 'data'>('categories');
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('🎯');
  const [newColor, setNewColor] = useState('#6366f1');
  const [newType, setNewType] = useState<TransactionType>('expense');
  const [confirmClear, setConfirmClear] = useState(false);

  const handleAddCategory = () => {
    if (!newName.trim()) return;
    onAddCategory({ name: newName.trim(), icon: newIcon, color: newColor, type: newType, isCustom: true });
    setNewName(''); setAdding(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="modal-overlay absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[var(--surface-overlay)] rounded-2xl border border-[var(--border)] shadow-2xl animate-scale-in max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-[var(--border)] flex-shrink-0">
          <h2 className="font-semibold text-[var(--text-primary)]">Settings</h2>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--accent-light)] transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-1 p-4 pb-0 flex-shrink-0">
          {(['categories', 'data'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-lg transition-all capitalize',
                tab === t ? 'bg-[var(--text-primary)] text-[var(--surface)]' : 'text-[var(--text-muted)] hover:bg-[var(--accent-light)]'
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto flex-1 p-4">
          {tab === 'categories' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-[var(--text-muted)]">Manage your categories</p>
                {!adding && (
                  <button onClick={() => setAdding(true)} className="flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                    <Plus className="w-3.5 h-3.5" /> New category
                  </button>
                )}
              </div>

              {adding && (
                <div className="border border-[var(--border)] rounded-xl p-3 space-y-3 animate-slide-up">
                  <input
                    type="text"
                    placeholder="Category name"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] outline-none focus:border-[var(--text-muted)]"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    {(['expense', 'income'] as const).map(t => (
                      <button
                        key={t}
                        onClick={() => setNewType(t)}
                        className={cn('flex-1 py-1.5 text-xs rounded-lg transition-all capitalize',
                          newType === t ? 'bg-[var(--text-primary)] text-[var(--surface)]' : 'border border-[var(--border)] text-[var(--text-muted)]'
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--text-muted)] mb-1.5">Icon</p>
                    <div className="flex flex-wrap gap-1.5">
                      {ICON_OPTIONS.map(icon => (
                        <button
                          key={icon}
                          onClick={() => setNewIcon(icon)}
                          className={cn('w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-all',
                            newIcon === icon ? 'bg-[var(--text-primary)]' : 'hover:bg-[var(--accent-light)]'
                          )}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--text-muted)] mb-1.5">Color</p>
                    <div className="flex flex-wrap gap-1.5">
                      {COLOR_OPTIONS.map(color => (
                        <button
                          key={color}
                          onClick={() => setNewColor(color)}
                          className={cn('w-6 h-6 rounded-full transition-all', newColor === color ? 'ring-2 ring-offset-2 ring-[var(--text-primary)] ring-offset-[var(--surface-overlay)]' : '')}
                          style={{ background: color }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button onClick={handleAddCategory} className="flex-1 py-2 text-xs font-medium rounded-lg bg-[var(--text-primary)] text-[var(--surface)]">
                      Add Category
                    </button>
                    <button onClick={() => setAdding(false)} className="px-3 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                {categories.map(cat => (
                  <div key={cat.id} className="group flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[var(--accent-light)] transition-colors">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${cat.color}20` }}>
                      <span className="text-sm">{cat.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-[var(--text-primary)]">{cat.name}</p>
                      <p className="text-[10px] text-[var(--text-muted)] capitalize">{cat.type}</p>
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                    {cat.isCustom && (
                      <button
                        onClick={() => onDeleteCategory(cat.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-[var(--text-muted)] hover:text-red-500 transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'data' && (
            <div className="space-y-4">
              <div className="border border-red-200 dark:border-red-900 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">Clear all data</h3>
                <p className="text-xs text-[var(--text-muted)] mb-3">This will permanently delete all your transactions, budgets, and custom categories.</p>
                {confirmClear ? (
                  <div className="flex gap-2">
                    <button onClick={() => { onClearData(); setConfirmClear(false); onClose(); }} className="flex-1 py-2 text-xs font-medium rounded-lg bg-red-500 text-white">
                      Yes, delete everything
                    </button>
                    <button onClick={() => setConfirmClear(false)} className="px-3 text-xs text-[var(--text-muted)]">Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmClear(true)} className="py-2 px-4 text-xs font-medium rounded-lg border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                    Clear all data
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
