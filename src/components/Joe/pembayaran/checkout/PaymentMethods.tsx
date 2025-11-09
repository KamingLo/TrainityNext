import React from 'react';
import PaymentMethodCard from './PaymentMethodCard';

const PAYMENT_METHODS = [
  { logo: '/Payment/BCA.svg', name: 'BCA' },
  { logo: '/Payment/MANDIRI.svg', name: 'Mandiri' },
  { logo: '/Payment/BRI.svg', name: 'BRI' },
  { logo: '/Payment/CIMB.svg', name: 'CIMB Niaga' },
  { logo: '/Payment/OCBC.svg', name: 'OCBC NISP' },
  { logo: '/Payment/PayPal.svg', name: 'PayPal' },
  { logo: '/Payment/OVO.svg', name: 'OVO' },
  { logo: '/Payment/DANA.svg', name: 'DANA' },
  { logo: '/Payment/GoPay.svg', name: 'GoPay' },
  { logo: '/Payment/ShopeePay.svg', name: 'ShopeePay' },
];

const PaymentMethods = () => {
  return (
    <div className="payment-section">
      <h1>CHECKOUT</h1>
      <h2>PAYMENT METHODS</h2>

      <div className="payment-grid">
        {PAYMENT_METHODS.map((method) => (
          <PaymentMethodCard
            key={method.name}
            logo={method.logo}
            name={method.name}
          />
        ))}
      </div>
    </div>
  );
};

export default PaymentMethods;