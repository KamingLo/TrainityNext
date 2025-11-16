"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Download, Loader2, Terminal, CheckCircle2, AlertCircle } from 'lucide-react';
import styles from "@/styles/charless/certificate.module.css";
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas'; 

interface ICertificateData {
  _id: string;
  userName: string;
  courseName: string;
  completedAt: string;
  progressPercentage: number;
  certificateId: string;
}

interface UserProfile {
  username: string;
  email: string;
}

export default function ModernCertificate() {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();
  const courseKey = params.key as string; 

  const certificateRef = useRef<HTMLDivElement>(null);
  const certificatePdfRef = useRef<HTMLDivElement>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [certificate, setCertificate] = useState<ICertificateData | null>(null);
  const [profileUsername, setProfileUsername] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const namaInstruktur = "Fabio";
  const tandaTanganUrl = "/sertifikat/signature.png"; 

  useEffect(() => {
    if (!courseKey) return;

    const fetchPageData = async () => {
      if (status === "unauthenticated") {
        router.push("/login");
        return;
      }
      if (status !== "authenticated") {
        return;
      }

      try {
        setIsFetching(true);
        setError(null);

        const certResponsePromise = fetch(`/api/user/sertifikat/${decodeURIComponent(courseKey)}`);
        const profileResponsePromise = fetch("/api/user/profile");

        const [certResponse, profileResponse] = await Promise.all([
          certResponsePromise,
          profileResponsePromise
        ]);

        if (!profileResponse.ok) {
          throw new Error("Gagal mengambil data profil pengguna");
        }
        const profileData: UserProfile = await profileResponse.json();
        setProfileUsername(profileData.username);

        if (!certResponse.ok) {
          const errorData = await certResponse.json();
          throw new Error(errorData.error || "Gagal mengambil data sertifikat");
        }
        const certResult = await certResponse.json();
        setCertificate(certResult.data || null);

        if (!certResult.data) {
          setError("Sertifikat tidak ditemukan atau Anda belum menyelesaikan kursus ini.");
        }

      } catch (err: unknown) { 
        if (err instanceof Error) {
          setError(err.message); 
        } else {
          setError("Terjadi kesalahan yang tidak diketahui saat mengambil data");
        }
      } finally {
        setIsFetching(false);
      }
    };

    fetchPageData();
  }, [status, router, courseKey]);

  const namaPeserta = profileUsername || "User";
  const judulKursus = certificate?.courseName || "Course";
  const sertifikatId = certificate?.certificateId || "TRN-0000";
  const tanggalLulus = certificate?.completedAt 
    ? new Date(certificate.completedAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : "-";

  const handleDownload = async () => {
    if (!certificatePdfRef.current) {
      alert("Error: Elemen sertifikat tidak ditemukan.");
      return;
    }

    const elementToCapture = certificatePdfRef.current;
    setIsLoading(true);

    try {
      const canvas = await html2canvas(elementToCapture, {
        scale: 2, 
        useCORS: true, 
        allowTaint: true,
        backgroundColor: '#111827',
        width: 1152,
        windowWidth: 1152 
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const xPos = 0;
      const yPos = 0;
      const pdfImgWidth = pdfWidth;
      const pdfImgHeight = pdfHeight;
      
      pdf.addImage(imgData, 'PNG', xPos, yPos, pdfImgWidth, pdfImgHeight);
      
      const fileName = `Sertifikat-${judulKursus.replace(/ /g, '_')}.pdf`;
      pdf.save(fileName);

    } catch (err) {
      console.error('Oops, gagal membuat PDF.', err);
      let errorMessage = "Maaf, terjadi kesalahan saat mencoba membuat file PDF.";
      if (err instanceof Error) {
        errorMessage = `${errorMessage}\n${err.message}`;
      }
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignatureError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = 'none';
    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
    if (fallback) {
      fallback.style.display = 'flex';
    }
  };

  const CertificateContent = () => (
    <>
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
            <span>SERTIFKAT KELULUSAN</span>
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
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
    </>
  );

  if (isFetching) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.loadingWrapper}>
            <Loader2 className={styles.iconLoading} />
            <p>Memuat sertifikat...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !certificate) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.errorWrapper}>
            <AlertCircle className={styles.iconError} />
            <h2>Sertifikat Tidak Ditemukan</h2>
            <p>{error || "Anda belum menyelesaikan kursus ini."}</p>
            <button 
              onClick={() => router.push('/dashboard')}
              className={styles.backButton}
            >
              Kembali ke Dashboard
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div 
          ref={certificateRef}
          className={styles.card}
        >
          <CertificateContent />
        </div>
        <div 
          ref={certificatePdfRef}
          className={styles.card}
          style={{
            position: 'absolute',
            left: '-9999px',
            top: 0,
            width: '1152px',
            aspectRatio: '16/11'
          }}
        >
          <CertificateContent />
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