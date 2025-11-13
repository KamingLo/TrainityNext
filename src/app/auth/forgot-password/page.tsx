"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Section from "@/components/sections";

// Impor modul CSS yang Anda butuhkan
import authStyles from "@/styles/kaming/auth.module.css";
import commonStyles from "@/styles/kaming/common.module.css";

// Tipe untuk melacak langkah (step)
type Step = "forgot" | "verify" | "change";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("forgot");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter();

  // --- 1. Handler untuk Kirim Kode ---
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // =============================================
    // === ⬇️ PANGGIL API 'FORGOT-PASSWORD' ANDA DI SINI ⬇️ ===
    //
    // try {
    //   const res = await fetch("/api/auth/forgot-password", { ... });
    //   if (!res.ok) throw new Error("Email tidak terdaftar");
    //
    //   setLoading(false);
    //   setStep("verify"); // Pindah ke langkah berikutnya
    //
    // } catch (err: any) {
    //   setLoading(false);
    //   setError(err.message);
    // }
    //
    // =============================================

    // Hapus simulasi di bawah ini saat API Anda sudah siap
    console.log("Mengirim kode ke:", email);
    await new Promise((res) => setTimeout(res, 1000));
    setLoading(false);
    setStep("verify");
  };

  // --- 2. Handler untuk Verifikasi Kode ---
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // =============================================
    // === ⬇️ PANGGIL API 'VERIFY-CODE' ANDA DI SINI ⬇️ ===
    //
    // try {
    //   const res = await fetch("/api/auth/verify-code", { ... });
    //   if (!res.ok) throw new Error("Kode verifikasi salah");
    //
    //   setLoading(false);
    //   setStep("change"); // Pindah ke langkah ganti password
    //
    // } catch (err: any) {
    //   setLoading(false);
    //   setError(err.message);
    // }
    //
    // =============================================
    
    // Hapus simulasi di bawah ini saat API Anda sudah siap
    console.log("Memverifikasi kode:", code);
    await new Promise((res) => setTimeout(res, 1000));
    if (code !== "123456") { // Ganti dengan logika API Anda
      setLoading(false);
      setError("Kode verifikasi salah.");
    } else {
      setLoading(false);
      setStep("change");
    }
  };

  // --- 3. Handler untuk Ganti Password ---
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError("Password tidak cocok.");
      return;
    }
    setLoading(true);

    // =============================================
    // === ⬇️ PANGGIL API 'CHANGE-PASSWORD' ANDA DI SINI ⬇️ ===
    //
    // try {
    //   const res = await fetch("/api/auth/change-password", { ... });
    //   if (!res.ok) throw new Error("Gagal mengubah password");
    //
    //   setLoading(false);
    //   setSuccess("Password berhasil diubah! Mengarahkan ke login...");
    //   setTimeout(() => router.push("/auth/login"), 2000);
    //
    // } catch (err: any) {
    //   setLoading(false);
    //   setError(err.message);
    // }
    //
    // =============================================
    
    // Hapus simulasi di bawah ini saat API Anda sudah siap
    console.log("Mengubah password...");
    await new Promise((res) => setTimeout(res, 1000));
    setLoading(false);
    setSuccess("Password berhasil diubah! Mengarahkan ke login...");
    setTimeout(() => {
      router.push("/auth/login");
    }, 2000);
  };

  // Varian animasi untuk transisi form
  const formVariants = {
    hidden: { opacity: 0, x: 50, transition: { duration: 0.3 } },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
  };

  return (
    <Section>
      {/* Menggunakan style dari auth.module.css */}
      <div className={authStyles.loginContainer}>
        <div className={authStyles.loginForm}>
          
          <AnimatePresence mode="wait">
            
            {/* =======================
                STEP 1: FORGOT PASSWORD
                ======================= */}
            {step === "forgot" && (
              <motion.form
                key="forgot"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleSendCode}
              >
                <h1 className={authStyles.loginTitle}>Lupa Password</h1>
                <p className={authStyles.loginRedirectText} style={{ marginTop: 0, marginBottom: '1.5rem', lineHeight: 1.5 }}>
                  Masukkan email Anda yang terdaftar. Kami akan mengirimkan kode verifikasi.
                </p>
                
                <div className={authStyles.formInputsContainer}>
                  <div>
                    <label htmlFor="email" className={authStyles.formLabel}>
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={authStyles.loginInput}
                      placeholder="email@anda.com"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={authStyles.loginSubmitButton}
                >
                  {loading ? "Mengirim..." : "Kirim Kode"}
                </button>
              </motion.form>
            )}

            {/* =======================
                STEP 2: VERIFY CODE
                ======================= */}
            {step === "verify" && (
              <motion.form
                key="verify"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleVerifyCode}
              >
                <h1 className={authStyles.loginTitle}>Verifikasi Kode</h1>
                <p className={authStyles.loginRedirectText} style={{ marginTop: 0, marginBottom: '1.5rem', lineHeight: 1.5 }}>
                  Kode 6 digit telah dikirim ke <strong>{email}</strong>. Cek inbox Anda.
                </p>
                
                <div className={authStyles.formInputsContainer}>
                  <div>
                    <label htmlFor="code" className={authStyles.formLabel}>
                      Kode Verifikasi
                    </label>
                    <input
                      id="code"
                      type="text" // Ganti ke "number" jika Anda mau
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className={authStyles.loginInput}
                      placeholder="123456"
                      maxLength={6}
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={authStyles.loginSubmitButton}
                >
                  {loading ? "Memverifikasi..." : "Verifikasi"}
                </button>
              </motion.form>
            )}

            {/* =======================
                STEP 3: CHANGE PASSWORD
                ======================= */}
            {step === "change" && (
              <motion.form
                key="change"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onSubmit={handleChangePassword}
              >
                <h1 className={authStyles.loginTitle}>Atur Password Baru</h1>
                <p className={authStyles.loginRedirectText} style={{ marginTop: 0, marginBottom: '1.5rem', lineHeight: 1.5 }}>
                  Verifikasi berhasil. Silakan masukkan password baru Anda.
                </p>
                
                <div className={authStyles.formInputsContainer}>
                  <div>
                    <label htmlFor="newPassword" className={authStyles.formLabel}>
                      Password Baru
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={authStyles.loginInput}
                      placeholder="Minimal 6 karakter"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className={authStyles.formLabel}>
                      Konfirmasi Password Baru
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={authStyles.loginInput}
                      placeholder="Ulangi password baru"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={authStyles.loginSubmitButton}
                >
                  {loading ? "Menyimpan..." : "Ubah Password"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Menampilkan pesan Error atau Sukses */}
          {error && <div className={authStyles.errorMessage} style={{marginTop: '1rem'}}>{error}</div>}
          {success && <div className={authStyles.successMessage} style={{marginTop: '1rem'}}>{success}</div>}

          {/* Link Kembali ke Login */}
          <div className={authStyles.loginRedirectText} style={{ marginTop: '1.5rem' }}>
            <Link href="/auth/login" className={authStyles.loginRedirectLink}>
              <ArrowLeft size={16} style={{ display: 'inline-block', marginRight: '4px' }} />
              Kembali ke Login
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}