"use client";

import { PaymentMethodType } from "@/types";
import Image from "next/image";

interface PaymentMethodProps {
  method: PaymentMethodType;
  isActive: boolean;
  isDisabled: boolean;
  inputValue: string;
  onCheckboxChange: (id: string) => void;
  onInputChange: (id: string, value: string) => void;
}

export default function PaymentMethod({
  method,
  isActive,
  isDisabled,
  inputValue,
  onCheckboxChange,
  onInputChange,
}: PaymentMethodProps) {
  return (
    <label
      className={`payment-method ${isActive ? "active" : ""} ${isDisabled ? "payment-disabled" : ""}`}
    >
      <div className="payment-header">
        <div className="header-left">
          <Image src={method.image} alt={method.alt} width={60} height={40} />
          <span>{method.name}</span>
        </div>
        <div className="header-right">
          <input
            type="checkbox"
            className="payment-check"
            checked={isActive}
            onChange={() => onCheckboxChange(method.id)}
            disabled={isDisabled || method.disabled}
          />
        </div>
      </div>

      {method.hasQR ? (
        <div
          className="payment-body"
          style={{ display: isActive ? "block" : "none" }}
        >
          <p style={{ color: "#5f5f5f" }}>
            Silakan scan QR Code QRIS untuk melanjutkan pembayaran.
          </p>
          <Image
            src="/Payment/QRCODE.svg"
            alt="QRCODE"
            width={200}
            height={200}
            style={{ marginTop: "20px" }}
          />
        </div>
      ) : method.isVoucher ? (
        <div
          className="payment-body"
          style={{ display: isActive ? "block" : "none" }}
        >
          <label htmlFor={method.id}>
            Trainity sedang bagi-bagi vocher gratis! Ayo gunakan sekarang.
            <span style={{ fontSize: "small", color: "rgb(212, 212, 212)" }}>
              <br />
              berlaku hingga 31 Desember 2030
            </span>
          </label>
        </div>
      ) : (
        <div
          className="payment-body"
          style={{ display: isActive ? "block" : "none" }}
        >
          <label htmlFor={method.id}>{method.inputLabel}</label>
          <input
            type={method.inputType || "text"}
            id={method.id}
            className="payment-input"
            placeholder={method.inputPlaceholder}
            value={inputValue}
            onChange={(e) => onInputChange(method.id, e.target.value)}
            disabled={isDisabled}
          />
        </div>
      )}
    </label>
  );
}
