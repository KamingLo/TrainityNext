// page.tsx
import PaymentForm from '@/components/Joe/pembayaran/payment/PaymentForm';
import Script from 'next/script';
import './payment.css';

export default function PaymentPaymentPage() {
  return (
    <>
      <Script src="/js/joe/payment.js" strategy="afterInteractive" />
      <PaymentForm />
    </>
  );
}