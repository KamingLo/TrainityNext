import Link from 'next/link';

const NoHistory = () => (
  <>
    <i className='bx bx-cart-alt'></i>
    <h3>Belum Ada Riwayat Pembelian</h3>
    <p>Anda belum melakukan pembelian kursus apapun</p>
    <Link href="/kursus" className="btn-browse">Jelajahi Kursus</Link>
  </>
);

export default NoHistory;