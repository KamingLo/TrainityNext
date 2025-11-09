"use client";

import React, { useState, useEffect } from 'react';
import LoadingScreen from './LoadingScreen';
import OrderDetail from './OrderDetails';
import QRCodeSection from './QRCodeSection';
import PaymentNotification from './PaymentNotification';

const PaymentForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulasi loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 detik loading

    return () => clearTimeout(timer);
  }, []);

  // Handler untuk download QR Code
  const handleDownloadQR = () => {
    const qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=TRAINITY-PAYMENT-12000';
    
    // Buat link download
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'qr-code-payment.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handler untuk cancel transaksi
  const handleCancelTransaction = () => {
    if (confirm('Apakah Anda yakin ingin membatalkan transaksi ini?')) {
      // Logic untuk cancel transaksi
      console.log('Transaksi dibatalkan');
      // Redirect atau action lainnya
    }
  };

  return (
    <main>
      <section>
        {/* Loading Screen */}
        {isLoading && <LoadingScreen />}

        {/* Payment Container */}
        <div
          className="payment-container"
          style={{
            visibility: isLoading ? 'hidden' : 'visible',
            opacity: isLoading ? 0 : 1,
            transition: 'opacity 0.3s ease-in-out',
          }}
        >
          {/* Detail Order Box */}
          <OrderDetail
            accountInfo="testing@gmail.com"
            merchantName="Javascript"
            paymentLogo="/public/assets/Payment/BCA.png"
            totalAmount="Rp 12.000"
          />

          {/* Instruction Text */}
          <p className="instruction-text">
            Buka m-banking atau e-wallet dan pindai kode QR untuk menyelesaikan
            pembayaran
          </p>

          {/* QR Code Box */}
          <QRCodeSection
            qrCodeUrl="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=TRAINITY-PAYMENT-12000"
            onDownload={handleDownloadQR}
          />

          {/* Pemberitahuan Box */}
          <PaymentNotification
            message="Halaman ini akan diperbarui secara otomatis ketika pembayaran selesai"
          />

          <div className="divider"></div>

          {/* Cancel Button */}
          <button
            className="cancel-transaction"
            id="cancel-btn"
            onClick={handleCancelTransaction}
          >
            Batalkan Transaksi Ini
          </button>
        </div>
      </section>
    </main>
  );
};

export default PaymentForm;