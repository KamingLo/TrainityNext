import { Suspense } from "react";
import CheckoutContainer from "@/components/joe/pembelian/checkout/CheckoutContainer";
import Section from "@/components/sections";
import "@/styles/joe/checkout.css";

export default function CheckoutPage() {
  return (
    <main>
      <Section>
        <Suspense fallback={<div>Loading...</div>}>
          <CheckoutContainer />
        </Suspense>
      </Section>
    </main>
  );
}
