import React from 'react';

interface QRCodeSectionProps {
  qrCodeUrl: string;
  onDownload: () => void;
}

const QRCodeSection: React.FC<QRCodeSectionProps> = ({
  qrCodeUrl,
  onDownload,
}) => {
  return (
    <div className="qrcode-pay">
      <h1>PINDAI KODE QR</h1>
      <div className="qr-image">
        <img
          src={qrCodeUrl}
          alt="QR Code"
          id="qr-code-image"
        />
      </div>
      <button id="download-qr-btn" onClick={onDownload}>
        Simpan Kode QR
      </button>
    </div>
  );
};

export default QRCodeSection;