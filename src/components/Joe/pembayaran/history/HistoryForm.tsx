"use client";

import React, { useState, useEffect } from 'react';
import LoadingScreen from './LoadingScreen';
import HistoryHeader from './HistoryHeader';
import NoHistory from './NoHistory';

declare global {
  interface Window {
    renderHistory?: () => void;
  }
}

const HistoryForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Panggil renderHistory dari history.js
      if (typeof window.renderHistory === 'function') {
        window.renderHistory();
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main>
      <section>
        {isLoading && <LoadingScreen />}

        <div className="history-container" style={{ display: isLoading ? 'none' : 'block' }}>
          <HistoryHeader />
          <div id="history-list"></div>
          <div id="no-history" style={{ display: 'none' }}>
            <NoHistory />
          </div>
        </div>
      </section>
    </main>
  );
};

export default HistoryForm;