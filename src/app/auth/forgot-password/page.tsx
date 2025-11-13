"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react"; // Lucide masih dipakai untuk panah back
import Section from "@/components/sections";

// Impor modul CSS
import authStyles from "@/styles/kaming/auth.module.css";

type Step = "forgot" | "verify" | "change";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("forgot");
  
  // State Data
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // State Visibility Password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  // --- 1. Handler Kirim Kode ---
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Gagal mengirim kode");

      setSuccess(data.message);
      setTimeout(() => {
        setSuccess(null);
        setStep("verify");
      }, 1500);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. Handler Verifikasi Kode ---
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Kode verifikasi salah");

      setSuccess("Kode valid!");
      setTimeout(() => {
        setSuccess(null);
        setStep("change");
      }, 1000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- 3. Handler Ganti Password ---
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }
    
    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Gagal mengubah password");

      setSuccess("Password berhasil diubah! Mengarahkan ke login...");
      setTimeout(() => router.push("/auth/login"), 2000);

    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Style wrapper untuk posisi relative (agar icon bisa absolute)
  const passwordWrapperStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
  };

  // Style untuk icon mata (Boxicons)
  const toggleIconStyle: React.CSSProperties = {
    position: "absolute",
    right: "15px",        // Jarak dari kanan
    top: "50%",           // Posisi vertikal tengah
    transform: "translateY(-50%)", // Center vertikal presisi
    cursor: "pointer",
    color: "#888",        // Warna icon abu-abu
    fontSize: "22px",     // Ukuran icon boxicons
    zIndex: 10,
    display: "flex",      // Pastikan icon centered dalam containernya
    alignItems: "center",
  };

  // Varian animasi
  const formVariants = {
    hidden: { opacity: 0, x: 50, transition: { duration: 0.3 } },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
  };

  return (
    <Section>
      <div className={authStyles.loginContainer}>
        <div className={authStyles.loginForm}>
          
          <AnimatePresence mode="wait">
            
            {/* === STEP 1: FORGOT === */}
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
                  Masukkan email Anda yang terdaftar.
                </p>
                
                <div className={authStyles.formInputsContainer}>
                  <div>
                    <label htmlFor="email" className={authStyles.formLabel}>Email</label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={authStyles.loginInput}
                      placeholder="email@anda.com"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
                <button type="submit" disabled={loading} className={authStyles.loginSubmitButton}>
                  {loading ? "Mengirim..." : "Kirim Kode"}
                </button>
              </motion.form>
            )}

            {/* === STEP 2: VERIFY === */}
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
                  Kode OTP telah dikirim ke <strong>{email}</strong>
                </p>
                
                <div className={authStyles.formInputsContainer}>
                  <div>
                    <label htmlFor="code" className={authStyles.formLabel}>Kode Verifikasi</label>
                    <input
                      id="code"
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className={authStyles.loginInput}
                      placeholder="123456"
                      maxLength={6}
                      required
                      disabled={loading}
                      style={{ letterSpacing: "4px", textAlign: "center" }}
                    />
                  </div>
                </div>
                <button type="submit" disabled={loading} className={authStyles.loginSubmitButton}>
                  {loading ? "Memverifikasi..." : "Verifikasi"}
                </button>
                <div style={{ marginTop: '10px', textAlign: 'center' }}>
                  <button 
                    type="button" 
                    onClick={() => setStep("forgot")}
                    style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '0.8rem' }}
                  >
                    Salah email? Kembali
                  </button>
                </div>
              </motion.form>
            )}

            {/* === STEP 3: CHANGE PASSWORD (Updated with Boxicons) === */}
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
                  Silakan buat password baru yang aman.
                </p>
                
                <div className={authStyles.formInputsContainer}>
                  
                  {/* Password Baru */}
                  <div>
                    <label htmlFor="newPassword" className={authStyles.formLabel}>Password Baru</label>
                    <div style={passwordWrapperStyle}>
                      <input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={authStyles.loginInput}
                        placeholder="Minimal 6 karakter"
                        required
                        disabled={loading}
                        style={{ paddingRight: "45px" }} // Extra padding agar teks tidak tertutup icon
                      />
                      <span 
                        onClick={() => setShowPassword(!showPassword)} 
                        style={toggleIconStyle}
                      >
                        {/* Menggunakan Boxicons Class */}
                        <i className={`bx ${showPassword ? 'bx-show' : 'bx-hide'}`}></i>
                      </span>
                    </div>
                  </div>

                  {/* Konfirmasi Password */}
                  <div>
                    <label htmlFor="confirmPassword" className={authStyles.formLabel}>Konfirmasi Password</label>
                    <div style={passwordWrapperStyle}>
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={authStyles.loginInput}
                        placeholder="Ulangi password baru"
                        required
                        disabled={loading}
                        style={{ paddingRight: "45px" }}
                      />
                      <span 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                        style={toggleIconStyle}
                      >
                        {/* Menggunakan Boxicons Class */}
                        <i className={`bx ${showConfirmPassword ? 'bx-show' : 'bx-hide'}`}></i>
                      </span>
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={loading} className={authStyles.loginSubmitButton}>
                  {loading ? "Menyimpan..." : "Ubah Password"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Pesan Error / Sukses */}
          {error && <div className={authStyles.errorMessage} style={{marginTop: '1rem', color: 'red', textAlign:'center'}}>{error}</div>}
          {success && <div className={authStyles.successMessage} style={{marginTop: '1rem', color: 'green', textAlign:'center'}}>{success}</div>}

          {/* Back to Login */}
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