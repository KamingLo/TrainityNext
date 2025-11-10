// product/[id]/page.tsx (Telah diperbarui)
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import BackButton from "@/components/kaming/backbutton";
import Section from "@/components/sections";
import TabSwitcher from "@/components/kaming/TabSwitcher";
import ProductForm, { ProductFormData } from "@/components/kaming/ProductForm";
import styles from "@/styles/kaming.module.css"; // <-- IMPORT FILE CSS UTAMA

interface Video {
  _id: string;
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

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [tab, setTab] = useState<"kursus" | "video">("kursus");
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    shortDesc: "",
    desc: "",
  });

  const [namaPelajaran, setNamaPelajaran] = useState("");
  const [kodePelajaran, setKodePelajaran] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [editNama, setEditNama] = useState("");
  const [editKode, setEditKode] = useState("");

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Gagal memuat produk");
        const data = await res.json();
        setProduct(data);

        setFormData({
          name: data.name || "",
          shortDesc: data.shortDesc || "",
          desc: data.desc || "",
        });
      } catch (err: any) {
        setMessage(err.message);
      }
    })();
  }, [id]);

  async function updateProduct(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Gagal update produk");
      setProduct(body.product);
      setMessage("✅ Perubahan kursus tersimpan");
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function addVideo() {
    if (!namaPelajaran || !kodePelajaran)
      return setMessage("Isi nama & kode pelajaran!");
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${id}/video`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ namaPelajaran, kodePelajaran }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error);
      setProduct(body.product);
      setNamaPelajaran("");
      setKodePelajaran("");
      setMessage("✅ Video ditambahkan");
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateVideo() {
    if (!selectedVideo) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/products/${id}/video/${selectedVideo._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            namaPelajaran: editNama,
            kodePelajaran: editKode,
          }),
        }
      );
      const body = await res.json();
      if (!res.ok) throw new Error(body.error);
      setProduct(body.product);
      setMessage("✅ Video diperbarui");
      setShowEditModal(false);
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteVideo() {
    if (!selectedVideo) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/products/${id}/video/${selectedVideo._id}`,
        { method: "DELETE" }
      );
      const body = await res.json();
      if (!res.ok) throw new Error(body.error);
      setProduct(body.product);
      setMessage("🗑️ Video dihapus");
      setShowDeleteModal(false);
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  const tabs = [
    { key: "kursus" as const, label: "Informasi Kursus" },
    { key: "video" as const, label: "Video Kursus" },
  ];

  return (
    <Section>
      <div className={styles.editPage_container}>
        <div className={styles.editPage_contentWrapper}>
          <div className={styles.editPage_card}>
            <BackButton />
            <h1 className={styles.editPage_title}>Edit Kursus</h1>
            <p className={styles.editPage_subtitle}>{product?.name || "..."}</p>

            <TabSwitcher tabs={tabs} activeTab={tab} onTabClick={setTab} />

            <AnimatePresence mode="wait">
              {tab === "kursus" && (
                <motion.div key="kursus">
                  <ProductForm
                    formData={formData}
                    onFormChange={setFormData}
                    onSubmit={updateProduct}
                    submitText="Simpan Perubahan"
                    isLoading={loading}
                  />
                </motion.div>
              )}

              {tab === "video" && (
                <motion.div
                  key="video"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className={styles.editVideo_tabContent}
                >
                  <div className={styles.editVideo_formContainer}>
                    <h3 className={styles.editVideo_sectionTitle}>Tambah Video</h3>
                    <div className={styles.editVideo_inputGroup}>
                      <input
                        type="text"
                        placeholder="Nama Pelajaran"
                        value={namaPelajaran}
                        onChange={(e) => setNamaPelajaran(e.target.value)}
                        className={styles.editVideo_input}
                      />
                      <input
                        type="text"
                        placeholder="Kode Pelajaran"
                        value={kodePelajaran}
                        onChange={(e) => setKodePelajaran(e.target.value)}
                        className={styles.editVideo_input}
                      />
                      <button
                        onClick={addVideo}
                        disabled={loading}
                        className={styles.editVideo_addButton}
                      >
                        {loading ? "Menambahkan..." : "Tambah"}
                      </button>
                    </div>
                  </div>

                  <div className={styles.editVideo_listContainer}>
                    <h3 className={styles.editVideo_listTitle}>Daftar Video</h3>
                    {!product?.video?.length ? (
                      <p className={styles.editVideo_emptyListText}>Belum ada video.</p>
                    ) : (
                      <ul className={styles.editVideo_list}>
                        {product.video.map((v) => (
                          <li key={v._id} className={styles.editVideo_listItem}>
                            <div>
                              <div className={styles.editVideo_name}>
                                {v.namaPelajaran}
                              </div>
                              <div className={styles.editVideo_code}>
                                {v.kodePelajaran}
                              </div>
                            </div>
                            <div className={styles.editVideo_actions}>
                              <button
                                onClick={() => {
                                  setSelectedVideo(v);
                                  setEditNama(v.namaPelajaran);
                                  setEditKode(v.kodePelajaran);
                                  setShowEditModal(true);
                                }}
                                className={styles.editVideo_editButton}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedVideo(v);
                                  setShowDeleteModal(true);
                                }}
                                className={styles.editVideo_deleteButton}
                              >
                                Hapus
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {message && <p className={styles.editPage_message}>{message}</p>}
          </div>
        </div>
      </div>

      {/* --- MODAL EDIT VIDEO (MENGGUNAKAN STYLE REUSABLE) --- */}
      <AnimatePresence>
        {showEditModal && selectedVideo && (
          <motion.div
            className={styles.modal_backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={styles.modal_content}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className={styles.modal_title}>Edit Video</h3>
              <input
                value={editNama}
                onChange={(e) => setEditNama(e.target.value)}
                placeholder="Nama Pelajaran"
                className={styles.modal_inputNama}
              />
              <input
                value={editKode}
                onChange={(e) => setEditKode(e.target.value)}
                placeholder="Kode Pelajaran"
                className={styles.modal_inputKode}
              />
              <div className={styles.modal_actionsEnd}>
                <button
                  onClick={() => setShowEditModal(false)}
                  className={styles.modal_buttonSecondary}
                >
                  Batal
                </button>
                <button
                  onClick={handleUpdateVideo}
                  disabled={loading}
                  className={styles.modal_buttonPrimary}
                >
                  {loading ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MODAL HAPUS VIDEO (MENGGUNAKAN STYLE REUSABLE) --- */}
      <AnimatePresence>
        {showDeleteModal && selectedVideo && (
          <motion.div
            className={styles.modal_backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`${styles.modal_content} ${styles.modal_contentDelete}`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className={styles.modal_titleDelete}>Hapus Video Ini?</h3>
              <p className={styles.modal_text}>
                "{selectedVideo.namaPelajaran}" akan dihapus permanen.
              </p>
              <div className={styles.modal_actionsCenter}>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className={styles.modal_buttonSecondary}
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteVideo}
                  disabled={loading}
                  className={styles.modal_buttonDanger}
                >
                  {loading ? "Menghapus..." : "Hapus"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}