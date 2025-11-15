"use client";

import { useState } from "react";
import Image from "next/image";

const faqData = [
  {
    question: "Apakah kursus di Trainity benar-benar gratis?",
    answer:
      "Ya! Semua kursus di Trainity dapat diakses secara <b>100% gratis</b>. Kami menyediakan voucher diskon 100% yang berlaku hingga 31 Desember 2030 untuk semua pengguna.",
  },
  {
    question:
      "Apakah saya akan mendapat sertifikat setelah menyelesaikan kursus?",
    answer:
      "Ya, setelah menyelesaikan 100% materi kursus, Anda akan mendapatkan <b>sertifikat kelulusan digital</b> yang bisa diunduh dalam format PDF dan dibagikan di profil profesional Anda.",
  },
  {
    question: "Berapa lama akses kursus saya berlaku?",
    answer:
      "Setelah mendaftar kursus, Anda mendapat akses <b>selamanya</b>. Anda bisa belajar dengan kecepatan sendiri tanpa batasan waktu.",
  },
  {
    question: "Apakah saya perlu pengalaman coding sebelumnya?",
    answer:
      "Tidak perlu! Kursus kami dirancang untuk <b>pemula hingga tingkat mahir</b>. Materi disusun secara sistematis dari dasar, jadi siapa saja bisa memulai.",
  },
  {
    question: "Bagaimana cara melacak progress belajar saya?",
    answer:
      "Anda bisa melihat progress belajar di halaman <b>Dashboard</b>. Di sana tersedia tab <b>Kursus Aktif</b> dan <b>Kursus Selesai</b> yang menampilkan semua kursus yang sedang atau sudah Anda selesaikan.",
  },
  {
    question: "Bagaimana cara menghapus akun?",
    answer:
      "Untuk menghapus akun Trainity, masuk ke menu <b>Pengaturan Akun</b> → pilih <b>Hapus Akun</b>. Setelah konfirmasi, semua data Anda akan dihapus permanen.",
  },
  {
    question: "Bagaimana cara membeli langganan?",
    answer:
      "Untuk membeli langganan, buka halaman <b>Langganan</b>, pilih paket yang diinginkan, lalu ikuti instruksi pembayaran sampai selesai.",
  },
  {
    question: "Bagaimana cara berhenti berlangganan?",
    answer:
      "Masuk ke menu <b>Langganan Saya</b> → pilih <b>Batalkan Langganan</b>. Sisa waktu langganan masih bisa dipakai hingga periode berakhir.",
  },
  {
    question: "Apakah saya bisa refund langganan?",
    answer:
      "Refund bisa diajukan jika pembatalan dilakukan dalam <b>7 hari</b> sejak pembelian dan belum ada kursus yang diakses. Hubungi <b>support@trainity.com</b> untuk proses refund.",
  },
  {
    question: "Bagaimana jika saya lupa password?",
    answer:
      "Klik <b>Lupa Password</b> di halaman login, masukkan email Anda, dan kami akan mengirimkan link reset password. Anda juga bisa mengubah password di menu <b>Pengaturan Akun</b>.",
  },
  {
    question: "Apakah materi kursus akan diupdate?",
    answer:
      "Ya, kami terus memperbarui materi kursus agar tetap relevan dengan <b>perkembangan teknologi terbaru</b>. Semua update dapat diakses otomatis oleh pengguna yang sudah terdaftar.",
  },
  {
    question: "Apakah saya bisa mengakses kursus dari smartphone?",
    answer:
      "Tentu! Website Trainity <b>responsif</b> dan bisa diakses dari berbagai perangkat termasuk smartphone, tablet, dan desktop dengan pengalaman belajar yang optimal.",
  },
  {
    question: "Bagaimana cara menghubungi tim support?",
    answer:
      "Hubungi kami melalui email <b>support@trainity.com</b> atau WhatsApp <b>+62 812-1234-5678</b>.",
  },
];

export default function FAQSection() {
  const [activeItem, setActiveItem] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleFAQ = (index: number) => {
    setActiveItem(activeItem === index ? null : index);
  };

  const filteredFAQs = faqData.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <section>
      <div className="faq-container">
        <div className="faq-box">
          <div className="faq-left">
            <input
              type="text"
              id="faqSearch"
              className="faq-search"
              placeholder="Cari pertanyaan kamu"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <Image src="/FAQ.svg" alt="FAQ" width={500} height={500} />
          </div>

          <div className="faq-right">
            <h1>Pertanyaan yang Sering Ditanyai di Trainity!</h1>

            <div className="faq-items-container">
              {filteredFAQs.length > 0 ? (
                filteredFAQs.map((item, index) => (
                  <div
                    key={index}
                    className={`faq-item ${activeItem === index ? "active" : ""}`}
                  >
                    <div
                      className="faq-question"
                      onClick={() => toggleFAQ(index)}
                    >
                      <span>▼</span> &nbsp; {item.question}
                    </div>
                    <div
                      className="faq-answer"
                      dangerouslySetInnerHTML={{ __html: item.answer }}
                    />
                  </div>
                ))
              ) : (
                <div
                  id="faq-not-found"
                  style={{
                    padding: "2rem",
                    textAlign: "center",
                    color: "#888888",
                  }}
                >
                  <i
                    className="bx bx-search-alt"
                    style={{
                      fontSize: "3rem",
                      display: "block",
                      marginBottom: "1rem",
                    }}
                  ></i>
                  <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                    Pertanyaan tidak ditemukan
                  </p>
                  <p style={{ fontSize: "0.9rem" }}>
                    Coba gunakan kata kunci yang berbeda atau hubungi tim
                    support kami
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
