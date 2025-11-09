import React from 'react';

interface SuccessMessageProps {
  title?: string;
  description?: string;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  title = 'Pembayaran Berhasil',
  description = 'Detail pembelian telah dikirim ke email Anda',
}) => {
  return (
    <div className="success-message">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
};

export default SuccessMessage;