'use client';

import { useEffect, useRef } from 'react';
import FAQItem from './FAQItem';

const faqData = [
    {
        question: 'Apakah kursus di Trainity benar-benar gratis?',
        answer: 'Ya! Semua kursus di Trainity dapat diakses secara <b>100% gratis</b>. Kami menyediakan voucher diskon 100% yang berlaku hingga 31 Desember 2030 untuk semua pengguna.',
    },
    {
        question: 'Apakah saya akan mendapat sertifikat setelah menyelesaikan kursus?',
        answer: 'Ya, setelah menyelesaikan 100% materi kursus, Anda akan mendapatkan <b>sertifikat kelulusan digital</b> yang bisa diunduh dalam format PDF dan dibagikan di profil profesional Anda.',
    },
    {
        question: 'Berapa lama akses kursus saya berlaku?',
        answer: 'Setelah mendaftar kursus, Anda mendapat akses <b>selamanya</b>. Anda bisa belajar dengan kecepatan sendiri tanpa batasan waktu.',
    },
    {
        question: 'Apakah saya perlu pengalaman coding sebelumnya?',
        answer: 'Tidak perlu! Kursus kami dirancang untuk <b>pemula hingga tingkat mahir</b>. Materi disusun secara sistematis dari dasar, jadi siapa saja bisa memulai.',
    },
    {
        question: 'Bagaimana cara melacak progress belajar saya?',
        answer: 'Anda bisa melihat progress belajar di halaman <b>Dashboard</b>. Di sana tersedia tab <b>Kursus Aktif</b> dan <b>Kursus Selesai</b> yang menampilkan semua kursus yang sedang atau sudah Anda selesaikan.',
    },
    {
        question: 'Bagaimana cara menghapus akun?',
        answer: 'Untuk menghapus akun Trainity, masuk ke menu <b>Pengaturan Akun</b> → pilih <b>Hapus Akun</b>. Setelah konfirmasi, semua data Anda akan dihapus permanen.',
    },
    {
        question: 'Bagaimana cara membeli langganan?',
        answer: 'Untuk membeli langganan, buka halaman <b>Langganan</b>, pilih paket yang diinginkan, lalu ikuti instruksi pembayaran sampai selesai.',
    },
    {
        question: 'Bagaimana cara berhenti berlangganan?',
        answer: 'Masuk ke menu <b>Langganan Saya</b> → pilih <b>Batalkan Langganan</b>. Sisa waktu langganan masih bisa dipakai hingga periode berakhir.',
    },
    {
        question: 'Apakah saya bisa refund langganan?',
        answer: 'Refund bisa diajukan jika pembatalan dilakukan dalam <b>7 hari</b> sejak pembelian dan belum ada kursus yang diakses. Hubungi <b>support@trainity.com</b> untuk proses refund.',
    },
    {
        question: 'Bagaimana jika saya lupa password?',
        answer: 'Klik <b>Lupa Password</b> di halaman login, masukkan email Anda, dan kami akan mengirimkan link reset password. Anda juga bisa mengubah password di menu <b>Pengaturan Akun</b>.',
    },
    {
        question: 'Apakah materi kursus akan diupdate?',
        answer: 'Ya, kami terus memperbarui materi kursus agar tetap relevan dengan <b>perkembangan teknologi terbaru</b>. Semua update dapat diakses otomatis oleh pengguna yang sudah terdaftar.',
    },
    {
        question: 'Apakah saya bisa mengakses kursus dari smartphone?',
        answer: 'Tentu! Website Trainity <b>responsif</b> dan bisa diakses dari berbagai perangkat termasuk smartphone, tablet, dan desktop dengan pengalaman belajar yang optimal.',
    },
    {
        question: 'Bagaimana cara menghubungi tim support?',
        answer: 'Hubungi kami melalui email <b>support@trainity.com</b> atau WhatsApp <b>+62 812-1234-5678</b>.',
    },
];

export default function FAQSection() {
    const scriptLoaded = useRef(false);

    useEffect(() => {
        if (!scriptLoaded.current) {
            const script = document.createElement('script');
            script.src = '/js/joe/guidance.js';
            script.async = true;
            document.body.appendChild(script);
            scriptLoaded.current = true;

            return () => {
                if (document.body.contains(script)) {
                    document.body.removeChild(script);
                }
            };
        }
    }, []);

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
                        />
                        <img src="/FAQ.svg" alt="FAQ" />
                    </div>

                    <div className="faq-right">
                        <h1>Pertanyaan yang Sering Ditanyai di Trainity!</h1>

                        <div className="faq-items-container">
                            {faqData.map((item, index) => (
                                <FAQItem key={index} question={item.question} answer={item.answer} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}