import './lainnya.css';
import FAQSection from '@/components/Joe/lainnya/FAQSection';
import FAQAuthor from '@/components/Joe/lainnya/FAQAuthor';

export default function Lainnya() {
  return (
    <main style={{ minHeight: '100vh', padding: '2rem 1rem' }}>
      <FAQSection />
      <FAQAuthor />
    </main>
  );
}