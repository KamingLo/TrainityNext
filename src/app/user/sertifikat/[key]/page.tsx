"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Download, Loader2, Terminal, CheckCircle2, AlertCircle } from 'lucide-react';
import styles from "@/styles/charless/certificate.module.css";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface ICertificateData {
  _id: string;
  userName: string;
  courseName: string;
  completedAt: string;
  progressPercentage: number;
}

export default function ModernCertificate() {
  const { status } = useSession();
  const router = useRouter();
  const certificateRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [certificates, setCertificates] = useState<ICertificateData[]>([]);
  const [selectedCertIndex, setSelectedCertIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const namaInstruktur = "Fabio";
  const sertifikatId = "TRN-WEBV-4729";
  const tandaTanganUrl = "/assets/Signature.png";

  useEffect(() => {
    const fetchCertificates = async () => {
      if (status === "unauthenticated") {
        router.push("/login");
        return;
      }

      if (status !== "authenticated") {
        return;
      }

      try {
        setIsFetching(true);
        console.log("Fetching certificates...");
        const response = await fetch("/api/user/sertifikat/all");

        console.log("Response status:", response.status);
        console.log("Response headers:", response.headers.get("content-type"));
        
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const textResponse = await response.text();
          console.error("Non-JSON response:", textResponse.substring(0, 200));
          throw new Error("API endpoint tidak ditemukan atau mengembalikan HTML. Pastikan file route.ts sudah dibuat di /api/user/sertifikat/[key]/");
        }
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error("API Error:", errorData);
          throw new Error(errorData.error || "Gagal mengambil data sertifikat");
        }

        const result = await response.json();
        console.log("Certificates data:", result);
        
        setCertificates(result.data || []);

        if (result.data?.length === 0) {
          setError("Kamu belum menyelesaikan kursus apapun. Selesaikan kursus untuk mendapatkan sertifikat!");
        }
      } catch (err: AppError) {
        if(err instanceof Error){
            console.error("Error fetching certificates:", err);
            setError(err.message || "Terjadi kesalahan saat mengambil data sertifikat");
        }
      } finally {
        setIsFetching(false);
      }
    };

    fetchCertificates();
  }, [status, router]);

  const currentCert = certificates[selectedCertIndex];
  const namaPeserta = currentCert?.userName || "User";
  const judulKursus = currentCert?.courseName || "Course";
  const tanggalLulus = currentCert?.completedAt 
    ? new Date(currentCert.completedAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : "-";

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

  if (error || certificates.length === 0) {
    return (
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.errorWrapper}>
            <AlertCircle className={styles.iconError} />
            <h2>Belum Ada Sertifikat</h2>
            <p>{error || "Kamu belum menyelesaikan kursus apapun."}</p>
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
        {certificates.length > 1 && (
          <div className={styles.certificateSelector}>
            <label htmlFor="cert-select">Pilih Sertifikat:</label>
            <select 
              id="cert-select"
              value={selectedCertIndex}
              onChange={(e) => setSelectedCertIndex(Number(e.target.value))}
              className={styles.certSelect}
            >
              {certificates.map((cert, index) => (
                <option key={cert._id} value={index}>
                  {cert.courseName}
                </option>
              ))}
            </select>
          </div>
        )}

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
                  <Image
                    width = {400}
                    height = {400}
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