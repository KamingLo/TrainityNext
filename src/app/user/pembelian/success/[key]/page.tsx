"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import "@/styles/joe/success.css";

export default function SuccessPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const [countdown, setCountdown] = useState(30);

  const productKey = params.key as string;
  const [orderId] = useState(() => `TRN-${Date.now()}`);
  const [transactionId] = useState(() => `PAY-${Date.now()}`);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    if (countdown === 0) {
      router.push("/admin/dashboard");
    }

    return () => clearInterval(timer);
  }, [countdown, router]);

  return (
    <div className="success-container">
      <div className="success-animation animate">
        <div className="checkmark-circle">
          <div className="checkmark-background"></div>
          <svg className="checkmark-svg" viewBox="0 0 52 52">
            <circle
              className="checkmark-circle-svg"
              cx="26"
              cy="26"
              r="25"
              fill="none"
            />
            <path
              className="checkmark-check"
              fill="none"
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
            />
          </svg>
        </div>
      </div>
      <div className="success-message">
        <h2>Pembelian Berhasil!</h2>
        <p>Terima kasih telah menyelesaikan pembelian Anda.</p>
      </div>
      <div className="purchase-details">
        <h2>Detail Pembelian</h2>
        <div className="detail-item">
          <span className="detail-label">Nama</span>
          <span className="detail-value">{session?.user?.name || "User"}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Email</span>
          <span className="detail-value">
            {session?.user?.email || "user@example.com"}
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Order ID</span>
          <span className="detail-value">{orderId}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">ID Transaksi</span>
          <span className="detail-value">{transactionId}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Merchant</span>
          <span className="detail-value">{productKey}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Payment Method</span>
          <span className="detail-value">Voucher</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Total Amount</span>
          <span className="detail-value status-badge success">Gratis</span>
        </div>
      </div>
      <Link href="/admin/dashboard" passHref>
        <button className="dashboard-button">
          <i className="fas fa-arrow-left"></i>
          Kembali ke Dashboard
        </button>
      </Link>
      <p>Redirect otomatis dalam {countdown} detik...</p>
    </div>
  );
}
