import React from 'react';

interface PaymentMethodCardProps {
  logo: string;
  name: string;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({ logo, name }) => {
  return (
    <label className="payment-method">
      <div className="payment-header">
        <div className="header-left">
          <img src={logo} alt={name} />
          <span>{name}</span>
        </div>
        <div className="header-right">
          <input type="checkbox" className="payment-check" />
        </div>
      </div>
    </label>
  );
};

export default PaymentMethodCard;