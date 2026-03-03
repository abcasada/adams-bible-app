import { useState } from 'react';
import { setApiKey, validateApiKey } from '../lib/api';

interface Props {
  onComplete: () => void;
}

export default function ApiKeySetup({ onComplete }: Props) {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) {
      setError('Please enter an API key.');
      return;
    }

    setLoading(true);
    setError('');

    const valid = await validateApiKey(key);
    if (valid) {
      setApiKey(key);
      onComplete();
    } else {
      setError('Invalid API key. Please double-check and try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">📖</div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Bible Reader
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            One-time setup: enter your free API.Bible key
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 mb-6 text-sm">
          <p className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
            How to get your free API key:
          </p>
          <ol className="list-decimal list-inside text-blue-700 dark:text-blue-400 space-y-1">
            <li>
              Go to{' '}
              <a
                href="https://scripture.api.bible/signup"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-medium"
              >
                scripture.api.bible/signup
              </a>
            </li>
            <li>Create a free account</li>
            <li>Create an app (any name) to get your key</li>
            <li>Copy and paste the key below</li>
          </ol>
        </div>

        <form onSubmit={handleSubmit}>
          <label
            htmlFor="api-key"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            API Key
          </label>
          <input
            id="api-key"
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Paste your API key here..."
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            autoFocus
          />

          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 px-4 rounded-lg transition"
          >
            {loading ? 'Verifying...' : 'Get Started'}
          </button>
        </form>
      </div>
    </div>
  );
}
