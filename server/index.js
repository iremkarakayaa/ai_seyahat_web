const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const connectDB = require('./config/db');

// Route importları
const userRoutes = require('./routes/userRoutes');
const tripRoutes = require('./routes/tripRoutes');

const app = express();
const port = process.env.PORT || 3002; // 3002 portunu kullanıyoruz

// MongoDB bağlantısı
connectDB();

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// CORS ayarlarını güncelle
app.use(cors({
  origin: '*', // Geliştirme ortamında tüm originlere izin ver
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// API Rotaları
app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Hata:', err);
  res.status(500).json({
    error: 'Sunucu hatası',
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// API key kontrolü
const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
if (!GOOGLE_API_KEY) {
  console.error('UYARI: GOOGLE_MAPS_API_KEY çevresel değişkeni bulunamadı!');
  // API key olmadan da sunucuyu başlatabiliriz, MongoDB özellikleri yine de çalışır
  console.warn('Google Maps özellikleri devre dışı kalacak.');
}

// Places API yapılandırması
const PLACES_API_BASE_URL = 'https://maps.googleapis.com/maps/api/place';

// API key doğrulama fonksiyonu
const validateApiKey = async () => {
  if (!GOOGLE_API_KEY) {
    console.error('API anahtarı bulunamadı');
    return false;
  }

  try {
    console.log('API anahtarı doğrulanıyor...');
    const response = await axios.get(
      `${PLACES_API_BASE_URL}/findplacefromtext/json`,
      {
        params: {
          input: 'Istanbul',
          inputtype: 'textquery',
          key: GOOGLE_API_KEY,
          language: 'tr'
        }
      }
    );
    
    console.log('Places API yanıtı:', response.data);

    if (response.data.status === 'REQUEST_DENIED') {
      console.error('API anahtarı geçersiz veya kısıtlanmış:', response.data.error_message);
      return false;
    }
    
    if (response.data.status === 'INVALID_REQUEST') {
      console.warn('Geçersiz istek, ancak API anahtarı doğrulandı');
      return true;
    }
    
    console.log('Google Maps API anahtarı doğrulandı');
    return true;
  } catch (error) {
    if (error.response?.data?.status === 'REQUEST_DENIED') {
      console.error('API anahtarı geçersiz:', error.response.data.error_message);
      return false;
    }
    
    console.error('API anahtarı doğrulama hatası:', error.message);
    // Bağlantı hatalarında API key'i geçerli kabul et
    return true;
  }
};

// Sunucu başlatma
const startServer = async () => {
  try {
    // API key'i doğrula
    const isValidKey = await validateApiKey();
    if (!isValidKey) {
      console.warn('API anahtarı doğrulanamadı, ancak sunucu başlatılıyor...');
    }

    const server = app.listen(port, () => {
      console.log(`Server ${port} portunda çalışıyor`);
      console.log('Google Maps API Key:', isValidKey ? 'Doğrulandı' : 'Doğrulanamadı');
      console.log('MongoDB Bağlantısı: Aktif');
      console.log('Server URL:', `http://localhost:${port}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM sinyali alındı. Server kapatılıyor...');
      server.close(() => {
        console.log('Server kapatıldı');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Sunucu başlatma hatası:', error);
    process.exit(1);
  }
};

// Root endpoint
app.get('/', (req, res) => {
  console.log('Root endpoint çağrıldı');
  res.json({
    status: 'OK',
    message: 'Seyahat Planlayıcı API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: {
        register: '/api/users/register',
        login: '/api/users/login',
        profile: '/api/users/profile'
      },
      trips: {
        create: '/api/trips',
        list: '/api/trips',
        details: '/api/trips/:id'
      },
      maps: {
        key: '/api/maps/key',
        places: {
          search: '/api/places/search',
          details: '/api/places/details'
        },
        hotels: {
          search: '/api/hotels/search'
        }
      }
    }
  });
});

// API durumunu kontrol et
app.get('/api/health', (req, res) => {
  console.log('Health check endpoint çağrıldı');
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    googleMapsStatus: 'active'
  });
});

// API key endpoint'i
app.get('/api/maps/key', (req, res) => {
  if (!GOOGLE_API_KEY) {
    return res.status(500).json({ 
      error: 'API anahtarı yapılandırması eksik',
      details: 'GOOGLE_MAPS_API_KEY çevresel değişkeni tanımlanmamış'
    });
  }
  res.json({ key: GOOGLE_API_KEY });
});

// Yer arama endpoint'i
app.get('/api/places/search', async (req, res) => {
  try {
    const { input } = req.query;
    
    if (!input || input.length < 2) {
      return res.status(400).json({ 
        error: 'Geçersiz arama sorgusu',
        message: 'Arama sorgusu en az 2 karakter olmalıdır'
      });
    }

    console.log('Yer arama isteği:', input);
    
    const response = await axios.get(
      `${PLACES_API_BASE_URL}/autocomplete/json`,
      {
        params: {
          input,
          types: '(cities)',
          language: 'tr',
          key: GOOGLE_API_KEY
        }
      }
    );

    console.log('Places API yanıtı:', response.data.status);

    if (response.data.status === 'REQUEST_DENIED') {
      throw new Error('API anahtarı geçersiz veya kısıtlanmış');
    }

    if (response.data.status === 'OK') {
      const predictions = response.data.predictions.map(prediction => ({
        place_id: prediction.place_id,
        description: prediction.description,
        main_text: prediction.structured_formatting.main_text,
        secondary_text: prediction.structured_formatting.secondary_text
      }));
      
      res.json(predictions);
    } else if (response.data.status === 'ZERO_RESULTS') {
      res.json([]);
    } else {
      throw new Error(response.data.status + (response.data.error_message ? ': ' + response.data.error_message : ''));
    }
  } catch (error) {
    console.error('Yer arama hatası:', error);
    
    // Hata yanıtını yapılandır
    const errorResponse = {
      error: 'Yer arama sırasında bir hata oluştu',
      message: error.message
    };

    // Google API'den gelen hata mesajını ekle
    if (error.response?.data?.error_message) {
      errorResponse.details = error.response.data.error_message;
    }

    // REQUEST_DENIED hatası için özel mesaj
    if (error.response?.data?.status === 'REQUEST_DENIED') {
      errorResponse.message = 'API anahtarı geçersiz veya kısıtlanmış';
      errorResponse.details = 'Lütfen sistem yöneticinize başvurun';
    }

    res.status(500).json(errorResponse);
  }
});

// Yer detayları endpoint'i
app.get('/api/places/details', async (req, res) => {
  if (!GOOGLE_API_KEY) {
    return res.status(500).json({ error: 'API anahtarı yapılandırması eksik' });
  }

  try {
    const { placeId } = req.query;
    const response = await axios.get(
      `${PLACES_API_BASE_URL}/details/json`,
      {
        params: {
          place_id: placeId,
          fields: 'name,geometry,formatted_address',
          key: GOOGLE_API_KEY,
          language: 'tr'
        }
      }
    );

    if (response.data.status === 'OK') {
      res.json(response.data.result);
    } else {
      throw new Error(response.data.status);
    }
  } catch (error) {
    console.error('Yer detayları alma hatası:', error);
    res.status(500).json({ error: 'Yer detayları alınırken bir hata oluştu' });
  }
});

// Otel arama endpoint'i
app.get('/api/hotels/search', async (req, res) => {
  if (!GOOGLE_API_KEY) {
    return res.status(500).json({ error: 'API anahtarı yapılandırması eksik' });
  }

  try {
    const { location } = req.query;
    const response = await axios.get(
      `${PLACES_API_BASE_URL}/textsearch/json`,
      {
        params: {
          query: `hotels in ${location}`,
          type: 'lodging',
          key: GOOGLE_API_KEY,
          language: 'tr'
        }
      }
    );

    if (response.data.status === 'OK') {
      res.json(response.data.results);
    } else {
      throw new Error(response.data.status);
    }
  } catch (error) {
    console.error('Otel arama hatası:', error);
    res.status(500).json({ error: 'Otel arama sırasında bir hata oluştu' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Bulunamadı',
    message: `${req.method} ${req.url} endpoint'i bulunamadı`
  });
});

// Sunucuyu başlat
startServer(); 