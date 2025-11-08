// product/page.tsx (Setelah Refactor)
"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Section from "@/components/sections";
import TabSwitcher from "@/components/kaming/TabSwitcher";
import AnimatedTabPanel from "@/components/kaming/AnimatedTabPanel";
import ProductForm, { ProductFormData } from "@/components/kaming/ProductForm";
import ProductList from "@/components/kaming/ProductList";

// Definisikan tipe di satu tempat, misal `types/index.ts`
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
// -----------------------------------------------------------

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

  async function deleteProduct(id: string) {
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  }

  const tabs = [
    { key: "create" as const, label: "Tambah Kursus" },
    { key: "list" as const, label: "Daftar Kursus" },
  ];

  return (
    <div className="text-white px-6 py-10">
      <Section id="hero" className="text-center">
        <h1 className="text-4xl font-bold mb-2">Manajemen Kursus</h1>
        <p className="text-gray-400 text-lg">
          Tambah, ubah, dan kelola kursus pembelajaran digital Trainity.
        </p>
      </Section>

      <TabSwitcher tabs={tabs} activeTab={tab} onTabClick={setTab} />

      <div className="w-[90%] lg:w-[80%] mx-auto max-w-4xl">
        <AnimatePresence mode="wait">
          {tab === "create" && (
            <AnimatedTabPanel key="create">
              <ProductForm
                formData={formData}
                onFormChange={setFormData}
                onSubmit={handleCreateProduct}
                submitText="Simpan Kursus"
              >
                {/* Bagian form video disisipkan di sini */}
                <div className="bg-black/40 p-4 rounded-xl border border-gray-700">
                  <h3 className="text-lg font-semibold mb-3">Tambah Video</h3>
                  <div className="flex flex-col md:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="Nama Pelajaran"
                      value={videoFormData.namaPelajaran}
                      onChange={(e) => setVideoFormData({ ...videoFormData, namaPelajaran: e.target.value })}
                      className="flex-1 p-2 rounded-lg bg-black/30 border border-gray-700"
                    />
                    <input
                      type="text"
                      placeholder="Kode Pelajaran"
                      value={videoFormData.kodePelajaran}
                      onChange={(e) => setVideoFormData({ ...videoFormData, kodePelajaran: e.target.value })}
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
                        <li key={v.idPelajaran} className="flex justify-between border-b border-gray-700 pb-1">
                          <span>{v.namaPelajaran}</span>
                          <span className="text-gray-400">{v.kodePelajaran}</span>
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
              <ProductList products={products} onDelete={deleteProduct} />
            </AnimatedTabPanel>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}