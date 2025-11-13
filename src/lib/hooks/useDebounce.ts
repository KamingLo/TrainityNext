// src/lib/hooks/useDebounce.ts
"use client";

import { useState, useEffect } from 'react';

// T adalah tipe generik (bisa string, number, dll.)
export function useDebounce<T>(value: T, delay: number): T {
  // State untuk menyimpan nilai yang di-debounce
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set timeout untuk update nilai setelah 'delay'
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Ini adalah bagian penting:
    // Hapus timeout sebelumnya setiap kali 'value' berubah
    // (misalnya, saat pengguna mengetik huruf baru)
    return () => {
      clearTimeout(handler);
    };
  },
  [value, delay] // Hanya jalankan ulang jika value or delay berubah
  );

  return debouncedValue;
}