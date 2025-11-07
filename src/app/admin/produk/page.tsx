"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Section from "@/components/sections";

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
  const [name, setName] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [desc, setDesc] = useState("");
  const [namaPelajaran, setNamaPelajaran] = useState("");
  const [kodePelajaran, setKodePelajaran] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  }

  function addVideoTemp() {
    if (!namaPelajaran || !kodePelajaran) return;
    const newVideo: Video = {
      idPelajaran: crypto.randomUUID(),
      namaPelajaran,
      kodePelajaran,
    };
    setVideos([...videos, newVideo]);
    setNamaPelajaran("");
    setKodePelajaran("");
  }

  async function handleCreateProduct(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, shortDesc, desc, video: videos }),
    });

    if (res.ok) {
      setName("");
      setShortDesc("");
      setDesc("");
      setVideos([]);
      fetchProducts();
      setTab("list");
    }
  }

  async function deleteProduct(id: string) {
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  }

  return (
    <div className="text-white px-6 py-10">
      <Section id="hero" className="text-center">
        <h1 className="text-4xl font-bold mb-2">Manajemen Kursus</h1>
        <p className="text-gray-400 text-lg">
          Tambah, ubah, dan kelola kursus pembelajaran digital Trainity.
        </p>
      </Section>

      <div className="flex justify-center my-10">
        <div className="flex gap-4 bg-black/40 backdrop-blur-md rounded-full border border-gray-700 p-1">
          {["create", "list"].map((key) => (
            <button
              key={key}
              onClick={() => setTab(key as "create" | "list")}
              className={`px-5 py-2 rounded-full transition-all ${
                tab === key
                  ? "bg-white text-black font-semibold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {key === "create" ? "Tambah Kursus" : "Daftar Kursus"}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="w-[90%] lg:w-[80%] mx-auto max-w-4xl">
        <AnimatePresence mode="wait">
          {tab === "create" && (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-black/60 backdrop-blur-md border border-gray-700 rounded-2xl p-8 shadow-lg"
            >
              <h2 className="text-2xl font-semibold mb-6 text-center">
                Tambah Kursus Baru
              </h2>
              <form
                onSubmit={handleCreateProduct}
                className="space-y-4 text-white"
              >
                <input
                  type="text"
                  placeholder="Nama Kursus"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 rounded-xl bg-black/30 border border-gray-700 placeholder-gray-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Deskripsi Singkat"
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  className="w-full p-3 rounded-xl bg-black/30 border border-gray-700 placeholder-gray-500"
                  required
                />
                <textarea
                  placeholder="Deskripsi Lengkap"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full p-3 rounded-xl bg-black/30 border border-gray-700 placeholder-gray-500"
                  required
                />

                <div className="bg-black/40 p-4 rounded-xl border border-gray-700">
                  <h3 className="text-lg font-semibold mb-3">Tambah Video</h3>
                  <div className="flex flex-col md:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="Nama Pelajaran"
                      value={namaPelajaran}
                      onChange={(e) => setNamaPelajaran(e.target.value)}
                      className="flex-1 p-2 rounded-lg bg-black/30 border border-gray-700"
                    />
                    <input
                      type="text"
                      placeholder="Kode Pelajaran"
                      value={kodePelajaran}
                      onChange={(e) => setKodePelajaran(e.target.value)}
                      className="flex-1 p-2 rounded-lg bg-black/30 border border-gray-700"
                    />
                    <button
                      type="button"
                      onClick={addVideoTemp}
                      className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      + Tambah
                    </button>
                  </div>

                  {videos.length > 0 && (
                    <ul className="mt-3 space-y-2 text-sm">
                      {videos.map((v) => (
                        <li
                          key={v.idPelajaran}
                          className="flex justify-between border-b border-gray-700 pb-1"
                        >
                          <span>{v.namaPelajaran}</span>
                          <span className="text-gray-400">{v.kodePelajaran}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <button
                  type="submit"
                  className="bg-green-600 w-full py-3 rounded-xl text-white font-semibold hover:bg-green-700 mt-3"
                >
                  Simpan Kursus
                </button>
              </form>
            </motion.div>
          )}

          {tab === "list" && (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-black/60 backdrop-blur-md border border-gray-700 rounded-2xl p-8 shadow-lg"
            >
              <h2 className="text-2xl font-semibold mb-6 text-center">
                Daftar Kursus
              </h2>
              {products.length === 0 ? (
                <p className="text-center text-gray-400">
                  Belum ada kursus yang ditambahkan.
                </p>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((p) => (
                    <motion.div
                      key={p._id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-black/40 border border-gray-700 rounded-2xl p-5 space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold">{p.name}</h3>
                        <div className="flex gap-3">
                          <button
                            onClick={() => router.push(`/admin/produk/${p._id}`)}
                            className="text-blue-500 hover:text-blue-400"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteProduct(p._id)}
                            className="text-red-500 hover:text-red-400"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm">{p.shortDesc}</p>
                      <p className="text-gray-500 text-xs">{p.desc}</p>
                      <div>
                        <h4 className="font-semibold mt-2 mb-1 text-sm">Video:</h4>
                        <ul className="text-xs space-y-1">
                          {p.video.map((v) => (
                            <li key={v.idPelajaran}>
                              {v.namaPelajaran}{" "}
                              <span className="text-gray-500">
                                ({v.kodePelajaran})
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
