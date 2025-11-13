// product/page.tsx (Telah diperbarui)
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Section from "@/components/sections";
import TabSwitcher from "@/components/kaming/TabSwitcher";
import AnimatedTabPanel from "@/components/kaming/AnimatedTabPanel";
import ProductForm, { ProductFormData } from "@/components/kaming/ProductForm";
import ProductList from "@/components/kaming/ProductList";

// DIUBAH: Impor modul spesifik yang dibutuhkan halaman ini
import listStyles from "@/styles/kaming/adminProductList.module.css";
import modalStyles from "@/styles/kaming/modal.module.css";

interface Video {
  idPelajaran: string;
  namaPelajaran: string;
  kodePelajaran: string;
}

interface Product {
  _id: string;
  name: string;
  shortDesc: string;
  desc: string;
  video: Video[];
}

export default function ProductsPage() {
  const [tab, setTab] = useState<"create" | "list">("create");
  const [products, setProducts] = useState<Product[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    shortDesc: "",
    desc: "",
  });
  const [videoFormData, setVideoFormData] = useState({
    namaPelajaran: "",
    kodePelajaran: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  }

  function addVideoTemp() {
    const { namaPelajaran, kodePelajaran } = videoFormData;
    if (!namaPelajaran || !kodePelajaran) return;
    const newVideo: Video = {
      idPelajaran: crypto.randomUUID(),
      namaPelajaran,
      kodePelajaran,
    };
    setVideos([...videos, newVideo]);
    setVideoFormData({ namaPelajaran: "", kodePelajaran: "" });
  }

  async function handleCreateProduct(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, video: videos }),
    });

    if (res.ok) {
      setFormData({ name: "", shortDesc: "", desc: "" });
      setVideos([]);
      fetchProducts();
      setTab("list");
    }
  }

  function handleDeleteClick(id: string) {
    const product = products.find((p) => p._id === id);
    if (product) {
      setProductToDelete(product);
      setIsModalOpen(true);
    }
  }

  async function handleConfirmDelete() {
    if (!productToDelete) return;

    setIsLoading(true);
    try {
      await fetch(`/api/products/${productToDelete._id}`, { method: "DELETE" });
      await fetchProducts();
    } catch (error) {
      console.error("Gagal menghapus:", error);
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
      setProductToDelete(null);
    }
  }

  const tabs = [
    { key: "create" as const, label: "Tambah Kursus" },
    { key: "list" as const, label: "Daftar Kursus" },
  ];

  return (
    // Menggunakan 'listStyles' untuk gaya halaman
    <div className={listStyles.listPage_container}>
      <Section id="hero" className={listStyles.listPage_heroSection}>
        <h1 className={listStyles.listPage_title}>Manajemen Kursus</h1>
        <p className={listStyles.listPage_subtitle}>
          Tambah, ubah, dan kelola kursus pembelajaran digital Trainity.
        </p>
      </Section>

      <TabSwitcher tabs={tabs} activeTab={tab} onTabClick={setTab} />

      <div className={listStyles.listPage_tabContentWrapper}>
        <AnimatePresence mode="wait">
          {tab === "create" && (
            <AnimatedTabPanel key="create">
              <ProductForm
                formData={formData}
                onFormChange={setFormData}
                onSubmit={handleCreateProduct}
                submitText="Simpan Kursus"
              >
                <div className={listStyles.listPage_videoFormContainer}>
                  <h3 className={listStyles.listPage_videoFormTitle}>Tambah Video</h3>
                  <div className={listStyles.listPage_inputGroup}>
                    <input
                      type="text"
                      placeholder="Nama Pelajaran"
                      value={videoFormData.namaPelajaran}
                      onChange={(e) => setVideoFormData({ ...videoFormData, namaPelajaran: e.target.value })}
                      className={listStyles.listPage_videoInput}
                    />
                    <input
                      type="text"
                      placeholder="Kode Pelajaran"
                      value={videoFormData.kodePelajaran}
                      onChange={(e) => setVideoFormData({ ...videoFormData, kodePelajaran: e.target.value })}
                      className={listStyles.listPage_videoInput}
                    />
                    <button
                      type="button"
                      onClick={addVideoTemp}
                      className={listStyles.listPage_addButton}
                    >
                      + Tambah
                    </button>
                  </div>
                  {videos.length > 0 && (
                    <ul className={listStyles.listPage_videoList}>
                      {videos.map((v) => (
                        <li key={v.idPelajaran} className={listStyles.listPage_videoListItem}>
                          <span>{v.namaPelajaran}</span>
                          <span className={listStyles.listPage_videoCode}>{v.kodePelajaran}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </ProductForm>
            </AnimatedTabPanel>
          )}

          {tab === "list" && (
            <AnimatedTabPanel key="list">
              <ProductList
                products={products}
                onDelete={handleDeleteClick}
              />
            </AnimatedTabPanel>
          )}
        </AnimatePresence>
      </div>

      {/* --- MODAL HAPUS (MENGGUNAKAN 'modalStyles') --- */}
      <AnimatePresence>
        {isModalOpen && productToDelete && (
          <motion.div
            className={modalStyles.modal_backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`${modalStyles.modal_content} ${modalStyles.modal_contentDelete}`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className={modalStyles.modal_titleDelete}>Hapus Kursus Ini?</h3>
              <p className={modalStyles.modal_text}>
                {`${productToDelete.name} akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.`}
              </p>
              <div className={modalStyles.modal_actionsCenter}>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className={modalStyles.modal_buttonSecondary}
                  disabled={isLoading}
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={isLoading}
                  className={modalStyles.modal_buttonDanger}
                >
                  {isLoading ? "Menghapus..." : "Hapus"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}