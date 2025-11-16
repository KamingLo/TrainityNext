"use client";

import { useRouter } from "next/navigation";

interface OrderPopupProps {
  content: PopupContent | null;
  isProcessing: boolean;
}

export default function OrderPopup({ content, isProcessing }: OrderPopupProps) {
  const router = useRouter();

  if (!content && !isProcessing) return null;

  const handleRedirect = () => {
    if (content?.redirectTo) {
      router.push(content.redirectTo);
    }
  };

  return (
    <div className="order-popup" style={{ display: "flex" }}>
      <div className="popout">
        {isProcessing ? (
          <>
            <div className="anim"></div>
            <p>Pembelian anda sedang diproses</p>
          </>
        ) : content ? (
          <>
            <div
              style={{
                fontSize: "64px",
                color: content.color,
                marginBottom: "20px",
              }}
            >
              {content.icon}
            </div>
            <h2>{content.title}</h2>
            <p>{content.message}</p>
            {content.buttonText && (
              <button
                onClick={handleRedirect}
                style={{
                  marginTop: "20px",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "6px",
                  background: "#1369ff",
                  color: "white",
                  cursor: "pointer",
                  zIndex: 99999,
                }}
              >
                {content.buttonText}
              </button>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
