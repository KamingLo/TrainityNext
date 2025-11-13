import Script from 'next/script';
import CheckoutForm from '@/components/Joe/pembayaran/checkout/CheckoutForm';
import './checkout.css';

export default function CheckoutPage() {
  return (
    <>
      <Script src="/js/joe/checkout.js" strategy="afterInteractive" />
      <CheckoutForm />
    </>
  );
}