const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Doğrudan seyahatapp veritabanına bağlan
    const conn = await mongoose.connect('mongodb://localhost:27017/seyahatapp');
    console.log(`MongoDB bağlantısı başarılı: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB bağlantı hatası: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB; 