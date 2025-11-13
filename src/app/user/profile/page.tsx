"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Section from '@/components/sections';
import styles from '@/styles/fabio/EditProfile.module.css';

export default function EditProfilePage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    username: "fabio123",
    email: "fabio@trainity.com"
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      alert("Profile berhasil diperbarui!");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Section>
      <div className={styles.profileHeader}>
        <h1 className={styles.title}>Edit Profil</h1>
        <p className={styles.subtitle}>Kelola informasi profil Anda</p>
      </div>

      <div className={styles.profileContainer}>
        <div className={styles.formSection}>
          <button 
            className={styles.backButton}
            onClick={() => router.push("/user/dashboard")}
          >
            <span className={styles.backIcon}>←</span>
            Kembali ke Dashboard
          </button>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={styles.input}
                placeholder="Masukkan username"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
                placeholder="Masukkan email"
              />
              <p className={styles.forgotPassword}>
                Kamu lupa password? <span onClick={() => router.push("/auth/forgot-password")} className={styles.forgotLink}>klik disini!</span>
              </p>
            </div>

            <div className={styles.buttonGroup}>
              <button
                type="button"
                onClick={() => router.push("/user/dashboard")}
                className={styles.cancelButton}
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={styles.saveButton}
              >
                {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Section>
  );
}