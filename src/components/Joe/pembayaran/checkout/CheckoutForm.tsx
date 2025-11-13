import React from 'react';
import LoadingScreen from './LoadingScreen';
import OrderPopup from './OrderPopup';
import PaymentMethods from './PaymentMethods';
import PurchaseDetails from './PurchaseDetails';
import OrderSummary from './OrderSummary';

const CheckoutForm = () => {
  return (
    <main>
      <section>
        <LoadingScreen />
        <OrderPopup />

        <div className="checkout-container">
          <div className="checkout-box">
            <div className="checkout-left">
              <PaymentMethods />
              <PurchaseDetails />
            </div>

            <div className="checkout-right">
              <OrderSummary />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CheckoutForm;