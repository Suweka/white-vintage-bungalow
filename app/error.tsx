'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Caught by global error.tsx:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-red-50 text-red-900">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <div className="bg-white p-4 rounded shadow mb-4 max-w-2xl overflow-auto border border-red-200">
        <p className="font-mono text-sm">{error.message || 'Unknown error'}</p>
        {error.stack && (
          <pre className="mt-4 text-xs whitespace-pre-wrap text-left">
            {error.stack}
          </pre>
        )}
      </div>
      <button
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  );
}
