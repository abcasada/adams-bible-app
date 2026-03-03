import type { BibleTranslation } from '../types';
import { setApiKey } from '../lib/api';
import { clearAllCache } from '../lib/cache';
import { useState } from 'react';

interface Props {
  translations: BibleTranslation[];
  favoriteIds: string[];
  onToggleFavorite: (id: string) => void;
  isDark: boolean;
  onToggleDark: () => void;
  onClose: () => void;
}

export default function SettingsPanel({
  translations,
  favoriteIds,
  onToggleFavorite,
  isDark,
  onToggleDark,
  onClose,
}: Props) {
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmApiKey, setConfirmApiKey] = useState(false);
  const [newApiKey, setNewApiKey] = useState('');
  const [cacheCleared, setCacheCleared] = useState(false);

  const handleClearCache = async () => {
    await clearAllCache();
    localStorage.removeItem('bible-app-translations');
    setCacheCleared(true);
    setConfirmClear(false);
    setTimeout(() => setCacheCleared(false), 2000);
  };

  const handleChangeApiKey = () => {
    if (newApiKey.trim()) {
      setApiKey(newApiKey.trim());
      setConfirmApiKey(false);
      setNewApiKey('');
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Panel */}
      <div className="relative ml-auto w-full max-w-md bg-white dark:bg-slate-800 shadow-xl flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold text-slate-900 dark:text-white text-lg">
            Settings
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Appearance */}
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
              Appearance
            </h4>
            <button
              onClick={onToggleDark}
              className="w-full flex items-center justify-between py-2"
            >
              <span className="text-sm text-slate-700 dark:text-slate-300">Dark Mode</span>
              <div
                className={`w-10 h-6 rounded-full transition-colors relative ${
                  isDark ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    isDark ? 'translate-x-4.5' : 'translate-x-0.5'
                  }`}
                />
              </div>
            </button>
          </div>

          {/* Favorite Translations */}
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
              Favorite Translations
            </h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">
              Only favorites will show in the quick-switch dropdown. If none are selected, all are shown.
            </p>

            {translations.length === 0 && (
              <p className="text-slate-400 text-sm text-center py-4">
                No translations loaded yet.
              </p>
            )}

            <div className="space-y-1 max-h-80 overflow-y-auto">
              {translations.map((t) => {
                const isFav = favoriteIds.includes(t.id);
                return (
                  <button
                    key={t.id}
                    onClick={() => onToggleFavorite(t.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition ${
                      isFav
                        ? 'bg-blue-50 dark:bg-blue-900/30'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    {/* Star icon */}
                    <svg
                      className={`w-4 h-4 flex-shrink-0 transition ${
                        isFav
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-slate-300 dark:text-slate-600'
                      }`}
                      viewBox="0 0 20 20"
                      fill={isFav ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span
                      className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                        isFav
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {t.abbreviation}
                    </span>
                    <span className="text-sm text-slate-700 dark:text-slate-300 truncate">
                      {t.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Data */}
          <div className="px-5 py-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
              Data
            </h4>

            {/* Clear cache */}
            <div className="space-y-2">
              {confirmClear ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Clear all cached chapters?</span>
                  <button
                    onClick={handleClearCache}
                    className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setConfirmClear(false)}
                    className="px-3 py-1.5 text-slate-500 text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmClear(true)}
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition"
                >
                  {cacheCleared ? '✓ Cache cleared!' : 'Clear cached chapters'}
                </button>
              )}
            </div>

            {/* Change API key */}
            <div className="mt-4 space-y-2">
              {confirmApiKey ? (
                <div className="space-y-2">
                  <input
                    value={newApiKey}
                    onChange={(e) => setNewApiKey(e.target.value)}
                    placeholder="New API key..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleChangeApiKey}
                      disabled={!newApiKey.trim()}
                      className="px-3 py-1.5 bg-blue-600 disabled:bg-blue-400 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition"
                    >
                      Save & Reload
                    </button>
                    <button
                      onClick={() => {
                        setConfirmApiKey(false);
                        setNewApiKey('');
                      }}
                      className="px-3 py-1.5 text-slate-500 text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmApiKey(true)}
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                  Change API key
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
