import "@/styles/joe/panduan.css";
import FAQSection from "@/components/joe/lainnya/FAQSection";
import FAQAuthor from "@/components/joe/lainnya/FAQAuthor";

export default function Panduan() {
  return (
    <main style={{ minHeight: "100vh", padding: "2rem 1rem" }}>
      <FAQSection />
      <FAQAuthor />
    </main>
  );
}
