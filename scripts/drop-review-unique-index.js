/**
 * Script untuk menghapus unique index lama di collection Review
 * Jalankan script ini sekali untuk menghapus unique constraint yang lama
 * 
 * Cara menjalankan:
 * node scripts/drop-review-unique-index.js
 */

const mongoose = require('mongoose');

// Ganti dengan connection string MongoDB Anda
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/trainity';

async function dropUniqueIndex() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('reviews');

    // Cek index yang ada
    const indexes = await collection.indexes();
    console.log('\nCurrent indexes:', indexes);

    // Drop unique index jika ada
    try {
      await collection.dropIndex('userId_1_productId_1');
      console.log('\n✅ Successfully dropped unique index: userId_1_productId_1');
    } catch (error) {
      if (error.code === 27) {
        console.log('\n⚠️  Index userId_1_productId_1 does not exist (already dropped)');
      } else {
        throw error;
      }
    }

    // Buat index non-unique baru untuk performa
    try {
      await collection.createIndex({ userId: 1, productId: 1 });
      console.log('✅ Successfully created non-unique index: userId_1_productId_1');
    } catch (error) {
      console.log('⚠️  Index already exists or error:', error.message);
    }

    // Verifikasi index baru
    const newIndexes = await collection.indexes();
    console.log('\nNew indexes:', newIndexes);

    console.log('\n✅ Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

dropUniqueIndex();

