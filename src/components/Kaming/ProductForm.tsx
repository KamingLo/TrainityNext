// src/components/product/ProductForm.tsx
"use client";

import React from "react";

// Definisikan tipe untuk data form
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
  children?: React.ReactNode; // Untuk menyisipkan form video
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
    <form onSubmit={onSubmit} className="space-y-4 text-white">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        {submitText.includes("Simpan") ? "Tambah Kursus Baru" : "Informasi Kursus"}
      </h2>
      <input
        type="text"
        name="name"
        placeholder="Nama Kursus"
        value={formData.name}
        onChange={handleChange}
        className="w-full p-3 rounded-xl bg-black/30 border border-gray-700 placeholder-gray-500"
        required
      />
      <input
        type="text"
        name="shortDesc"
        placeholder="Deskripsi Singkat"
        value={formData.shortDesc}
        onChange={handleChange}
        className="w-full p-3 rounded-xl bg-black/30 border border-gray-700 placeholder-gray-500"
        required
      />
      <textarea
        name="desc"
        placeholder="Deskripsi Lengkap"
        value={formData.desc}
        onChange={handleChange}
        className="w-full p-3 rounded-xl bg-black/30 border border-gray-700 placeholder-gray-500"
        required
      />

      {/* Slot untuk komponen lain, seperti form video */}
      {children}

      <button
        type="submit"
        disabled={isLoading}
        className="bg-green-600 w-full py-3 rounded-xl text-white font-semibold hover:bg-green-700 mt-3 disabled:opacity-50"
      >
        {isLoading ? "Memproses..." : submitText}
      </button>
    </form>
  );
}