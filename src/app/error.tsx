'use client';

import { useEffect } from 'react';

export default function RootError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // Bisa log ke console atau service eksternal seperti Sentry
    console.error('Global error caught:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-5xl font-bold text-red-600 mb-4">Oops!</h1>
      <p className="text-lg mb-4">Terjadi kesalahan: {error.message}</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Coba Lagi
      </button>
    </div>
  );
}
