"use client";

import React, { useState, useEffect } from 'react';
import LoadingScreen from './LoadingScreen';
import SuccessAnimation from './SuccessAnimation';
import SuccessMessage from './SuccessMessage';
import PurchaseDetails from './PurchaseDetails';

const SuccessForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulasi loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5 detik loading

    return () => clearTimeout(timer);
  }, []);

  // Handler untuk kembali ke dashboard
  const handleBackToDashboard = () => {
    // Logic untuk redirect ke dashboard
    console.log('Kembali ke dashboard');
    // window.location.href = '/dashboard';
    // atau menggunakan Next.js router
    // router.push('/dashboard');
  };

  return (
    <main>
      <section>
        {/* Loading Screen */}
        {isLoading && <LoadingScreen />}

        {/* Success Container */}
        {!isLoading && (
          <div className="success-container">
            {/* Success Animation */}
            <SuccessAnimation />

            {/* Success Message */}
            <SuccessMessage
              title="Pembayaran Berhasil"
              description="Detail pembelian telah dikirim ke email Anda"
            />

            {/* Purchase Details */}
            <PurchaseDetails
              orderId="-"
              transactionId="-"
              accountInfo="testing@gmail.com"
              merchantName="Javascript"
              paymentLogo="/public/assets/Payment/BCA.png"
              totalAmount="Rp 12.000"
              paymentStatus="Berhasil"
            />

            {/* Back to Dashboard Button */}
            <button
              className="dashboard-button"
              id="back-to-dashboard"
              onClick={handleBackToDashboard}
            >
              Kembali ke Dashboard
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default SuccessForm;