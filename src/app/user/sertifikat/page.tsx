"use client"

import React, { useState, useRef } from 'react';
import { Download, Loader2, Terminal, CheckCircle2 } from 'lucide-react';
import styles from "@/styles/charless/certificate.module.css";
import { useSession } from 'next-auth/react'; 

export default function ModernCertificate() {
    const { status } = useSession();
  const certificateRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const namaPeserta = "Charless";
  const judulKursus = "Advanced Web Development with React & Next.js";
  const namaInstruktur = "Fabio";
  const tanggalLulus = "15 November 2025";
  const sertifikatId = "TRN-WEBV-4729";
  const tandaTanganUrl = "/assets/Signature.png";
  
  const handleDownload = async () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      alert('Fungsi unduh PDF akan diimplementasikan di sini');
    }, 2000);
  };

  const handleSignatureError = (e: React.SyntheticEvent<HTMLImageElement>) => {

    e.currentTarget.style.display = 'none';
    

    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
    if (fallback) {
      fallback.style.display = 'flex';
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div 
          ref={certificateRef}
          className={styles.card}
        >
          <div className={styles.bgAnimation}>
            <div 
              className={`${styles.bgCircle} ${styles.circle1}`}
              style={{ animationDuration: '4s' }} 
            />
            <div 
              className={`${styles.bgCircle} ${styles.circle2}`}
              style={{ animationDuration: '6s', animationDelay: '1s' }} 
            />
          </div>
          <div className={`${styles.cornerDecorator} ${styles.topLeft}`}>
            <div className={styles.cornerBorder} />
          </div>
          <div className={`${styles.cornerDecorator} ${styles.bottomRight}`}>
            <div className={styles.cornerBorder} />
          </div>

          <div className={styles.content}>
            
            <div className={styles.header}>

              <div className={styles.logoWrapper}>
                <div className={styles.logoIcon}>
    
                  <Terminal className={styles.iconWhite} />
                </div>
                <div className={styles.logoText}>
                  <h3>TRAINITY</h3>
                  <p>Platform Belajar</p>
                </div>
              </div>
              

              <div className={styles.certIdBadge}>
                <span className={styles.label}>CERTIFICATE ID</span>
                <span className={styles.value}>{sertifikatId}</span>
              </div>
            </div>

            <div className={styles.completionBadgeWrapper}>
              <div className={styles.completionBadge}>
                <CheckCircle2 className={styles.iconBlue} />
                <span>SERTIFIKAT KELULUSAN</span>
              </div>
            </div>

            <div className={styles.recipientMain}>

              <p className={styles.recipientLabel}>
                Sertifikat ini diberikan kepada
              </p>
              

              <div className={styles.recipientNameWrapper}>
                <h1 className={styles.recipientName}>
                  {namaPeserta}
                </h1>
                <div className={styles.nameUnderline} />
              </div>


              <div className={styles.achievementDetails}>
                <p className={styles.text}>
                  telah berhasil menyelesaikan kursus
                </p>
                <h2 className={styles.courseTitle}>
                  {judulKursus}
                </h2>
                

                <div className={styles.courseStats}>
                  <div className={styles.statItem}>
                    <div className={styles.statDot} />
                    <span className={styles.statText}>
                      Selesai: <span className={styles.value}>{tanggalLulus}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.footer}>
              <div className={styles.signatureSection}>
                <div className={styles.signatureImageWrapper}>
                  <img 
                    src={tandaTanganUrl}
                    alt="Signature"
                    onError={handleSignatureError}
                  />
                  <div className={styles.signatureFallback}>
                    <div>{namaInstruktur}</div>
                  </div>
                </div>
                <div className={styles.signatureUnderline} />
                <div className={styles.signatureInfo}>
                  <p className={styles.name}>{namaInstruktur}</p>
                  <p className={styles.title}>Instruktur Utama</p>
                </div>
              </div>
            </div>

            <div className={styles.mobileCertId}>
              <span>ID: </span>
              <span>{sertifikatId}</span>
            </div>
          </div>
        </div>
        <div className={styles.downloadButtonContainer}>
          <button
            onClick={handleDownload}
            disabled={isLoading}
            className={styles.downloadButton}
          >
            <div className={styles.buttonContent}>
              {isLoading ? (
                <>
                  <Loader2 className={styles.iconLoading} />
                  <span>Membuat PDF...</span>
                </>
              ) : (
                <>
                  <Download className={styles.iconButton} />
                  <span>Unduh Sertifikat</span>
                </>
              )}
            </div>
          </button>
        </div>
      </div>
    </main>
  );
}