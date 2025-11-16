"use client";

import Image from "next/image";

interface OrderSummaryProps {
  courseTitle: string;
  thumbnailUrl: string;
  price: number;
  isAgree: boolean;
  onAgreeChange: (checked: boolean) => void;
  onPlaceOrder: () => void;
  isDisabled: boolean;
}

export default function OrderSummary({
  courseTitle,
  thumbnailUrl,
  price,
  isAgree,
  onAgreeChange,
  onPlaceOrder,
  isDisabled,
}: OrderSummaryProps) {
  return (
    <div className="checkout-right">
      <h3>ORDER SUMMARY</h3>

      <div className="order-item">
        <Image
          src={thumbnailUrl}
          alt="Preview Video"
          className="order-img"
          width={300}
          height={200}
        />
        <h2 className="order-title">{courseTitle}</h2>
      </div>

      <div className="order-details">
        <div style={{ display: "flex" }}>
          <p>Price:</p>
          <p style={{ marginLeft: "auto" }}>Rp {price.toLocaleString()}</p>
        </div>
        <div
          style={{
            display: "flex",
            borderBottom: "2px solid #333333",
            paddingBottom: "10px",
            marginBottom: "10px",
          }}
        >
          <p>Diskon:</p>
          <p style={{ marginLeft: "auto" }}>100%</p>
        </div>
        <div style={{ display: "flex" }}>
          <h4>Total:</h4>
          <h4 style={{ marginLeft: "auto" }}>Gratis</h4>
        </div>
      </div>

      <div className="order-agree">
        <input
          type="checkbox"
          id="agree-checkbox"
          checked={isAgree}
          onChange={(e) => onAgreeChange(e.target.checked)}
          style={{
            transform: "scale(1.5)",
            accentColor: "#1369ff",
            cursor: "pointer",
          }}
        />
        <label htmlFor="agree-checkbox" style={{ cursor: "pointer" }}>
          Saya setuju dengan Kebijakan Privasi dan Ketentuan
        </label>
      </div>

      <button
        className="button_checkout"
        disabled={isDisabled}
        onClick={onPlaceOrder}
      >
        Place Order
      </button>
    </div>
  );
}
