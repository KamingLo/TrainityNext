"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSession, signOut } from "next-auth/react";
import Section from "@/components/sections";

import authStyles from "@/styles/kaming/auth.module.css";

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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

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
    } catch (err: AppError) {
        if (err instanceof Error){
            setError(err.message);
        } 
    } finally {
      setLoading(false);
    }
  };

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
    } catch (err: AppError) {
        if(err instanceof Error){
            setError(err.message);
        }
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword.length < 8) {
      setError("Password minimal 8 karakter");
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

      const session = await getSession();

    if (session) {
      setSuccess("Kamu harus login ulang");
      await signOut({ redirect: false });
    }

    setTimeout(() => router.push("/auth/login"), 2000);
    } catch (err: AppError) {
        if(err instanceof Error){ 
            setError(err.message);
            setLoading(false);
        } 
    }
  };

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
                <p className={authStyles.loginRedirectText}>
                  Masukkan email Anda yang terdaftar.
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
                      disabled={loading}
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
                <p className={authStyles.loginRedirectText}>
                  Kode OTP telah dikirim ke <strong>{email}</strong>
                </p>

                <div className={authStyles.formInputsContainer}>
                  <div>
                    <label htmlFor="code" className={authStyles.formLabel}>
                      Kode Verifikasi
                    </label>
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

                <button
                  type="submit"
                  disabled={loading}
                  className={authStyles.loginSubmitButton}
                >
                  {loading ? "Memverifikasi..." : "Verifikasi"}
                </button>

                <div className={authStyles.textRight}>
                  <button
                    type="button"
                    onClick={() => setStep("forgot")}
                    className={authStyles.loginRedirectLink}
                  >
                    Salah email? Kembali
                  </button>
                </div>
              </motion.form>
            )}

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
                    <p className={authStyles.loginRedirectText}>
                    Silakan buat password baru yang aman.
                    </p>

                    <div className={authStyles.formInputsContainer}>
                    <div className={authStyles.passwordWrapper}>
                        <label htmlFor="newPassword" className={authStyles.formLabel}>
                        Password Baru
                        </label>

                        <input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Minimal 8 karakter"
                        className={authStyles.loginInput}
                        disabled={loading}
                        required
                        />

                        <i
                        className={`bx ${showPassword ? "bx-hide" : "bx-show"} ${authStyles.passwordIcon}`}
                        onClick={() => setShowPassword((prev) => !prev)}
                        ></i>
                    </div>

                    <div className={authStyles.passwordWrapper}>
                        <label htmlFor="confirmPassword" className={authStyles.formLabel}>
                        Konfirmasi Password
                        </label>

                        <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Ulangi password baru"
                        className={authStyles.loginInput}
                        disabled={loading}
                        required
                        />

                        <i
                        className={`bx ${showConfirmPassword ? "bx-hide" : "bx-show"} ${authStyles.passwordIcon}`}
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        ></i>
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

          {error && <p className={authStyles.errorMessage}>{error}</p>}
          {success && <p className={authStyles.successMessage}>{success}</p>}

          <div className={authStyles.loginRedirectText}>
            <Link href="/auth/login" className={authStyles.loginRedirectLink}>
              <ArrowLeft size={16} />
              Kembali ke Login
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
