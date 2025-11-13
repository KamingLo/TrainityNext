import React from 'react';

interface PaymentNotificationProps {
  message: string;
}

const PaymentNotification: React.FC<PaymentNotificationProps> = ({
  message,
}) => {
  return (
    <div className="pemberitahuan">
      <i className="bx bx-info-circle info-icon"></i>
      <p>{message}</p>
    </div>
  );
};

export default PaymentNotification;