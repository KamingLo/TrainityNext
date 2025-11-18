"use client";

import React from "react";

import styles from "@/styles/kaming/common.module.css";

export interface ProductFormData {
  name: string;
  shortDesc: string;
  desc: string;
}

interface ProductFormProps {
  formData: ProductFormData;
  onFormChange: (data: ProductFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitText: string;
  isLoading?: boolean;
  children?: React.ReactNode;
}

export default function ProductForm({
  formData,
  onFormChange,
  onSubmit,
  submitText,
  isLoading = false,
  children,
}: ProductFormProps) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onFormChange({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={onSubmit} className={styles.productForm}>
      <h2 className={styles.formTitle}>
        {submitText.includes("Simpan")
          ? "Tambah Kursus Baru"
          : "Informasi Kursus"}
      </h2>
      <input
        type="text"
        name="name"
        placeholder="Nama Kursus"
        value={formData.name}
        onChange={handleChange}
        className={styles.formInput}
        required
      />
      <input
        type="text"
        name="shortDesc"
        placeholder="Deskripsi Singkat"
        value={formData.shortDesc}
        onChange={handleChange}
        className={styles.formInput}
        required
      />
      <textarea
        name="desc"
        placeholder="Deskripsi Lengkap"
        value={formData.desc}
        onChange={handleChange}
        className={styles.formText}
        rows={5}
        required
      />

      {children}

      <button
        type="submit"
        disabled={isLoading}
        className={styles.buttonSubmit}
      >
        {isLoading ? "Memproses..." : submitText}
      </button>
    </form>
  );
}