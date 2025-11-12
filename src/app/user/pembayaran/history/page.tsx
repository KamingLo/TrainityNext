"use client";

import Script from 'next/script';
import HistoryForm from '@/components/Joe/pembayaran/history/HistoryForm';
import './history.css';

export default function HistoryPage() {
  return (
    <>
      <Script
        src="/js/joe/history.js"
        strategy="afterInteractive"
      />
      <HistoryForm />
    </>
  );
}