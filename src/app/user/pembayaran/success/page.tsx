import Script from 'next/script';
import SuccessForm from '@/components/Joe/pembayaran/success/SuccessForm';
import './success.css';

export default function SuccessPage() {
  return (
    <>
      <Script src="/js/testing/success.js" strategy="afterInteractive" />
      <SuccessForm />
    </>
  );
}