"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Section from '@/components/sections';
import styles from '@/styles/fabio/EditProfile.module.css';

interface UserProfile {
  username: string;
  email: string;
}

export default function EditProfilePage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    username: "",
    email: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsFetching(true);
      const response = await fetch("/api/user/profile");
      
      if (!response.ok) {
        throw new Error("Gagal mengambil data profil");
      }
      
      const userData: UserProfile = await response.json();
      setFormData({
        username: userData.username,
        email: userData.email
      });
    } catch (err) {
      setError("Gagal memuat data profil");
      console.error("Error fetching profile:", err);
    } finally {
      setIsFetching(false);
    }
  };

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
    setError("");

    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal memperbarui profil");
      }

      const updatedData = await response.json();
      setFormData(updatedData);
      alert("Profile berhasil diperbarui!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <Section>
        <div className={styles.loadingContainer}>
          Memuat profil...
        </div>
      </Section>
    );
  }

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

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

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
                required
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
                required
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