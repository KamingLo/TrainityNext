import { Suspense } from "react";
import CheckoutContainer from "@/components/joe/pembelian/checkout/CheckoutContainer";
import "@/styles/joe/checkout.css";

export default function CheckoutPage() {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <CheckoutContainer />
      </Suspense>
    </main>
  );
}
