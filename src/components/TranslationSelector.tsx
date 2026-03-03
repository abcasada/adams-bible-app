import type { BibleTranslation } from '../types';

interface Props {
  translations: BibleTranslation[];
  favoriteIds: string[];
  current: BibleTranslation | null;
  onSelect: (translation: BibleTranslation) => void;
  onOpenSettings: () => void;
  onClose: () => void;
}

export default function TranslationSelector({
  translations,
  favoriteIds,
  current,
  onSelect,
  onOpenSettings,
  onClose,
}: Props) {
  // Show only favorites if any are set, otherwise show all
  const displayed =
    favoriteIds.length > 0
      ? translations.filter((t) => favoriteIds.includes(t.id))
      : translations;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative bg-white dark:bg-slate-800 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-sm shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold text-slate-900 dark:text-white">
            Translation
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

        <div className="p-2">
          {displayed.length === 0 && (
            <p className="text-slate-400 text-sm text-center py-6">
              No translations available. Check your API key.
            </p>
          )}
          {displayed.map((t) => (
            <button
              key={t.id}
              onClick={() => onSelect(t)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition ${
                current?.id === t.id
                  ? 'bg-blue-50 dark:bg-blue-900/30'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}
            >
              <span
                className={`text-sm font-bold px-2 py-0.5 rounded ${
                  current?.id === t.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
                }`}
              >
                {t.abbreviation}
              </span>
              <span className="text-sm text-slate-700 dark:text-slate-300 truncate">
                {t.name}
              </span>
              {current?.id === t.id && (
                <svg
                  className="w-5 h-5 text-blue-600 dark:text-blue-400 ml-auto flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>

        {/* Manage link */}
        <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={() => {
              onClose();
              onOpenSettings();
            }}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Manage translations in Settings
          </button>
        </div>

        <div className="h-safe-bottom" />
      </div>
    </div>
  );
}
