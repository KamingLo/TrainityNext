"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Section from "@/components/sections";

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

  // form kursus
  const [name, setName] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [desc, setDesc] = useState("");

  // form video
  const [namaPelajaran, setNamaPelajaran] = useState("");
  const [kodePelajaran, setKodePelajaran] = useState("");

  // modal state
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
        setName(data.name || "");
        setShortDesc(data.shortDesc || "");
        setDesc(data.desc || "");
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
        body: JSON.stringify({ name, shortDesc, desc }),
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

  return (
    <Section>
      {/* Container utama dengan padding dan style teks */}
      <div className="text-white px-6 py-10">
        {/* Wrapper Konten dengan lebar maks & auto margin */}
        <div className="w-[90%] lg:w-[80%] mx-auto max-w-4xl">
          {/* Card Kaca Utama */}
          <div className="bg-black/60 backdrop-blur-md border border-gray-700 rounded-2xl p-8 shadow-lg">
            <h1 className="text-3xl font-bold mb-2 text-center">
              Edit Kursus
            </h1>
            <p className="text-lg text-gray-400 text-center mb-6">
              {product?.name || "..."}
            </p>

            {/* Tabs (Gaya Pill) */}
            <div className="flex justify-center mb-6">
              <div className="flex gap-4 bg-black/40 backdrop-blur-md rounded-full border border-gray-700 p-1">
                {["kursus", "video"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t as "kursus" | "video")}
                    className={`px-5 py-2 rounded-full transition-all ${
                      tab === t
                        ? "bg-white text-black font-semibold"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {t === "kursus" ? "Informasi Kursus" : "Video Kursus"}
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {tab === "kursus" && (
                <motion.div
                  key="kursus"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  // Card dalam dihapus, form langsung di dalam
                >
                  <form onSubmit={updateProduct} className="space-y-4">
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nama Kursus"
                      className="w-full p-3 rounded-xl bg-black/30 border border-gray-700 placeholder-gray-500"
                    />
                    <input
                      value={shortDesc}
                      onChange={(e) => setShortDesc(e.target.value)}
                      placeholder="Deskripsi Singkat"
                      className="w-full p-3 rounded-xl bg-black/30 border border-gray-700 placeholder-gray-500"
                    />
                    <textarea
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      placeholder="Deskripsi Lengkap"
                      rows={4}
                      className="w-full p-3 rounded-xl bg-black/30 border border-gray-700 placeholder-gray-500"
                    />
                    <div className="flex justify-end gap-3 pt-3">
                      <button
                        type="button"
                        onClick={() => router.push("/admin/produk")}
                        className="px-5 py-2 rounded-xl border border-gray-700 hover:bg-black/30 transition"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        // Ganti ke hijau agar konsisten dengan tombol 'Simpan' di ProductsPage
                        className="px-5 py-2 bg-green-600 hover:bg-green-700 rounded-xl disabled:opacity-50 transition"
                      >
                        {loading ? "Menyimpan..." : "Simpan"}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {tab === "video" && (
                <motion.div
                  key="video"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  {/* Form Tambah Video (Style Sub-card) */}
                  <div className="bg-black/40 p-5 rounded-xl border border-gray-700 space-y-3">
                    <h3 className="font-semibold text-lg">Tambah Video</h3>
                    <div className="flex flex-col gap-3">
                      <input
                        type="text"
                        placeholder="Nama Pelajaran"
                        value={namaPelajaran}
                        onChange={(e) => setNamaPelajaran(e.target.value)}
                        className="flex-1 p-3 rounded-lg bg-black/30 border border-gray-700 placeholder-gray-500"
                      />
                      <input
                        type="text"
                        placeholder="Kode Pelajaran"
                        value={kodePelajaran}
                        onChange={(e) => setKodePelajaran(e.target.value)}
                        className="flex-1 p-3 rounded-lg bg-black/30 border border-gray-700 placeholder-gray-500"
                      />
                      <button
                        onClick={addVideo}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 transition"
                      >
                        Tambah
                      </button>
                    </div>
                  </div>

                  {/* List Video (Style Sub-card) */}
                  <div className="bg-black/40 p-5 rounded-xl border border-gray-700">
                    <h3 className="font-semibold mb-3 text-lg">Daftar Video</h3>
                    {!product?.video?.length ? (
                      <p className="text-gray-500">Belum ada video.</p>
                    ) : (
                      // Menggunakan style list dari ProductsPage (border-b)
                      <ul className="space-y-2">
                        {product.video.map((v) => (
                          <li
                            key={v._id}
                            className="flex justify-between items-center border-b border-gray-700 py-2"
                          >
                            <div>
                              <div className="font-medium">
                                {v.namaPelajaran}
                              </div>
                              <div className="text-sm text-gray-400">
                                {v.kodePelajaran}
                              </div>
                            </div>
                            <div className="flex gap-4">
                              <button
                                onClick={() => {
                                  setSelectedVideo(v);
                                  setEditNama(v.namaPelajaran);
                                  setEditKode(v.kodePelajaran);
                                  setShowEditModal(true);
                                }}
                                className="text-blue-500 hover:text-blue-400 transition"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedVideo(v);
                                  setShowDeleteModal(true);
                                }}
                                className="text-red-500 hover:text-red-400 transition"
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

            {message && (
              <p className="mt-6 text-sm text-gray-400 text-center border-t border-gray-700 pt-4">
                {message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ===== Modal Edit Video ===== */}
      <AnimatePresence>
        {showEditModal && selectedVideo && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              // Style modal disamakan dengan card utama
              className="bg-black/60 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-lg max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-xl font-semibold mb-4">Edit Video</h3>
              <input
                value={editNama}
                onChange={(e) => setEditNama(e.target.value)}
                placeholder="Nama Pelajaran"
                className="w-full p-3 mb-3 rounded-xl bg-black/30 border border-gray-700 placeholder-gray-500"
              />
              <input
                value={editKode}
                onChange={(e) => setEditKode(e.target.value)}
                placeholder="Kode Pelajaran"
                className="w-full p-3 mb-4 rounded-xl bg-black/30 border border-gray-700 placeholder-gray-500"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-5 py-2 rounded-xl border border-gray-700 hover:bg-black/30 transition"
                >
                  Batal
                </button>
                <button
                  onClick={handleUpdateVideo}
                  disabled={loading}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl disabled:opacity-50 transition"
                >
                  {loading ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== Modal Delete Confirmation ===== */}
      <AnimatePresence>
        {showDeleteModal && selectedVideo && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              // Style modal disamakan dengan card utama
              className="bg-black/60 backdrop-blur-md border border-gray-700 rounded-2xl p-6 shadow-lg max-w-md w-full text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-xl font-semibold mb-3">Hapus Video Ini?</h3>
              <p className="text-gray-400 mb-6">
                "{selectedVideo.namaPelajaran}" akan dihapus permanen.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-5 py-2 rounded-xl border border-gray-700 hover:bg-black/30 transition"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteVideo}
                  disabled={loading}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 rounded-xl disabled:opacity-50 transition"
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