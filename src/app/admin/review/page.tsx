"use client";

import Section from "@/components/sections";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

// Mock data untuk reviews
const reviewsData = [
  {
    id: 1,
    userName: "John Doe",
    userEmail: "john@email.com",
    productName: "Kursus Web Development",
    rating: 5,
    comment: "Kursus yang sangat bagus! Materinya lengkap dan instruktur sangat berpengalaman.",
    createdAt: "2024-01-15",
    status: "approved"
  },
  {
    id: 2,
    userName: "Sarah Smith",
    userEmail: "sarah@email.com", 
    productName: "Kursus Data Science",
    rating: 4,
    comment: "Materi lengkap dan mudah dipahami. Penjelasan step-by-step sangat membantu.",
    createdAt: "2024-01-14",
    status: "approved"
  }
];

export default function AdminReview() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const [reviews, setReviews] = useState(reviewsData);
  const [editingReview, setEditingReview] = useState(null);
  const [editForm, setEditForm] = useState({
    rating: 0,
    comment: ""
  });

  if (status === "loading") return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="spinner border-4 border-blue-500 border-t-transparent rounded-full w-12 h-12 animate-spin mx-auto mb-4"></div>
        <p>Loading...</p>
      </div>
    </div>
  );
  
  if (!isLoggedIn) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-xl">Anda belum login.</p>
      </div>
    </div>
  );

  const user = session.user;

  const handleDeleteReview = (reviewId) => {
    if (confirm("Apakah Anda yakin ingin menghapus review ini?")) {
      setReviews(reviews.filter(review => review.id !== reviewId));
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setEditForm({
      rating: review.rating,
      comment: review.comment
    });
  };

  const handleSaveEdit = () => {
    setReviews(reviews.map(review => 
      review.id === editingReview.id 
        ? { ...review, ...editForm }
        : review
    ));
    setEditingReview(null);
    setEditForm({ rating: 0, comment: "" });
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setEditForm({ rating: 0, comment: "" });
  };

  return (
    <Section>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Manage Review</h1>
        <p className="text-gray-400">Kelola review dan rating dari pengguna</p>
      </div>

      {/* Action Bar */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">All Review ({reviews.length})</h2>
            <p className="text-gray-300 text-sm">Ratings and feedback from users</p>
          </div>
          <div className="flex gap-3">
            <Link 
              href="/admin/dashboard"
              className="bg-gray-500 hover:bg-gray-400 px-4 py-2 rounded-lg text-white transition-all"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
            
            {/* Review Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {review.userName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{review.userName}</h3>
                    <p className="text-gray-300 text-sm">{review.userEmail}</p>
                  </div>
                </div>
                <p className="text-blue-300 text-sm">{review.productName}</p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Rating Stars */}
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400 text-lg">
                    {"⭐".repeat(review.rating)}
                  </span>
                  <span className="text-gray-300 text-sm">({review.rating}/5)</span>
                </div>
                
                {/* Status Badge */}
                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-semibold">
                  {review.status}
                </span>
              </div>
            </div>

            {/* Review Comment */}
            <div className="mb-4">
              <p className="text-gray-300 leading-relaxed">{review.comment}</p>
            </div>

            {/* Review Meta & Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4 border-t border-white/10">
              <div className="text-gray-400 text-sm">
                Posted on {review.createdAt}
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEditReview(review)}
                  className="bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded-lg text-white text-sm transition-all"
                >
                  Edit Review
                </button>
                <button 
                  onClick={() => handleDeleteReview(review.id)}
                  className="bg-red-500 hover:bg-red-400 px-4 py-2 rounded-lg text-white text-sm transition-all"
                >
                  Delete Review
                </button>
              </div>
            </div>

            {/* Edit Form */}
            {editingReview?.id === review.id && (
              <div className="mt-4 p-4 bg-black/20 border border-blue-500/30 rounded-lg">
                <h4 className="text-lg font-semibold mb-3 text-blue-400">Edit Review</h4>
                
                {/* Rating Edit */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setEditForm({...editForm, rating: star})}
                        className={`text-2xl transition-all ${
                          star <= editForm.rating
                            ? "text-yellow-400 scale-110"
                            : "text-gray-500"
                        }`}
                      >
                        ⭐
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment Edit */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Comment
                  </label>
                  <textarea
                    value={editForm.comment}
                    onChange={(e) => setEditForm({...editForm, comment: e.target.value})}
                    className="w-full px-3 py-2 bg-black/40 text-gray-100 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all min-h-[100px]"
                    placeholder="Edit review comment..."
                  />
                </div>

                {/* Edit Actions */}
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-500 hover:bg-gray-400 px-4 py-2 rounded-lg text-white transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="bg-green-500 hover:bg-green-400 px-4 py-2 rounded-lg text-white transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}