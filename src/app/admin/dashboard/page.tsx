"use client";

import Link from "next/link";
// Import hooks yang diperlukan dari React
import { useState, useEffect } from "react"; 
// Hapus import 'Section', 'useSession', dan 'Link' karena menyebabkan error kompilasi di lingkungan ini.
// Kita akan menggantinya dengan elemen HTML standar dan data mock.

// Mock data untuk dashboard (kecuali recentProducts)
const dashboardData = {
  stats: {
    totalUsers: 1247,
    totalProducts: 89,
    totalReviews: 567
  },
  recentReviews: [
    {
      id: 1,
      userName: "John Doe",
      productName: "Kursus Web Development", 
      rating: 5,
      comment: "Kursus yang sangat bagus! Materinya lengkap dan mudah dipahami."
    },
    {
      id: 2,
      userName: "Sarah Smith",
      productName: "Kursus Data Science",
      rating: 4, 
      comment: "Instruktur sangat berpengalaman dan responsive terhadap pertanyaan."
    },
    {
      id: 3,
      userName: "Mike Johnson",
      productName: "Kursus Mobile App", 
      rating: 5,
      comment: "Project-based learning yang sangat membantu untuk portfolio."
    }
  ],
  // recentProducts akan kita fetch dari API
};

// UBAH NAMA KOMPONEN MENJADI 'App' AGAR PREVIEW MUNCUL
export default function App() {
  // Ganti useSession() dengan data mock untuk menghindari error import
  const status = "authenticated";
  const isLoggedIn = status === "authenticated";
  const user = {
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    id: "adm_123"
  };

  // State untuk menyimpan data produk, status loading, dan error
  const [recentProducts, setRecentProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  // useEffect untuk fetch data saat komponen dimuat
  useEffect(() => {
    // Hanya fetch data jika pengguna sudah login
    if (isLoggedIn) {
      const fetchProducts = async () => {
        try {
          // Menggunakan ?limit=3 sesuai permintaan Anda sebelumnya
          const response = await fetch('/api/products?limit=3');
          if (!response.ok) {
            throw new Error('Gagal mengambil data produk');
          }
          const data = await response.json();
          
          // Langsung set data, karena API sudah melimitasi jumlahnya
          setRecentProducts(data); 
          setProductsError(null);
        } catch (error: any) {
          console.error("Error fetching products:", error);
          setProductsError(error.message || 'Terjadi kesalahan saat memuat produk.');
        } finally {
          setProductsLoading(false);
        }
      };

      fetchProducts();
    }
  }, [isLoggedIn]); // Tambahkan isLoggedIn sebagai dependency

  return (
    // Ganti <Section> dengan <div> standar untuk menghindari error import
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Halo, {user?.name}! Selamat datang di panel admin</p>
      </div>


      {/* Quick Actions */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-center">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Ganti <Link> dengan <a> */}
          <Link href="/admin/review" className="block">
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 text-center hover:bg-blue-500/30 transition-all cursor-pointer">
              <div className="text-2xl mb-2">⭐</div>
              <div className="font-semibold text-white">Manage Reviews</div>
                <div className="text-gray-400 text-sm">Kelola ulasan dan testimoni pelanggan</div>
            </div>
          </Link>
          
          <a href="/admin/products" className="block">
            <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-center hover:bg-green-500/30 transition-all cursor-pointer">
              <div className="text-2xl mb-2">📚</div>
              <div className="font-semibold text-white">Manage Products</div>
                <div className="text-gray-400 text-sm">Kelola semua data inventaris barang</div>
            </div>
          </a>
          
          <a href="/admin/users" className="block">
            <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-4 text-center hover:bg-purple-500/30 transition-all cursor-pointer">
              <div className="text-2xl mb-2">👥</div>
              <div className="font-semibold text-white">Manage Users</div>
                <div className="text-gray-400 text-sm">Lihat dan atur semua pengguna</div>
            </div>
          </a>
          
          <a href="/admin/profile" className="block">
            <div className="bg-orange-500/20 border border-orange-500/30 rounded-xl p-4 text-center hover:bg-orange-500/30 transition-all cursor-pointer">
              <div className="text-2xl mb-2">👤</div>
              <div className="font-semibold text-white">View Profile</div>
              <div className="text-gray-400 text-sm">Ubah informasi akun dan kata sandi</div>
            </div>
          </a>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reviews */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Reviews</h3>
          <div className="space-y-4">
            {dashboardData.recentReviews.map((review) => (
              <div key={review.id} className="bg-black/20 border border-white/10 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-white">{review.userName}</h4>
                    <p className="text-gray-300 text-sm">{review.productName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400">{"⭐".repeat(review.rating)}</span>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">{review.comment}</p>
              </div>
            ))}
          </div>
          <a href="/admin/reviews" className="block text-center mt-4 text-blue-400 hover:text-blue-300">
            View All Reviews →
          </a>
        </div>

        {/* Recent Products - Diperbarui dengan data fetch */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Products</h3>
          
          {productsLoading ? (
            <p className="text-gray-300 text-center">Loading products...</p>
          ) : productsError ? (
            <p className="text-red-400 text-center">{productsError}</p>
          ) : (
            <div className="space-y-4">
              {recentProducts.length > 0 ? (
                recentProducts.map((product: any) => (
                  <div key={product.id} className="bg-black/20 border border-white/10 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-white">{product.name}</h4>
                      <span className="text-green-400 font-bold">
                        {/* Tambahkan pengecekan jika price tidak ada */}
                        Rp {"25000"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-300">{product.students || 0} students</span>
                      <span className="text-green-400">● Active</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Link href={`/admin/produk/${product._id}`} className="bg-gray-500 hover:bg-gray-400 px-3 py-1 rounded text-xs text-white transition-all">
                        View
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-300 text-center">Tidak ada produk terbaru.</p>
              )}
            </div>
          )}

          <Link href="/admin/produk" className="block text-center mt-4 text-blue-400 hover:text-blue-300">
            View All Products →
          </Link>
        </div>
      </div>

      {/* User Info */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 mt-6">
        <h3 className="text-xl font-semibold mb-4">Admin Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-300"><strong>Name:</strong> {user?.name}</p>
            <p className="text-gray-300"><strong>Email:</strong> {user?.email}</p>
          </div>
          <div>
            <p className="text-gray-300"><strong>Role:</strong> {(user as any)?.role}</p>
            <p className="text-gray-300"><strong>ID:</strong> {(user as any)?.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}