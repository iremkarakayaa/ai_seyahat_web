const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Token oluşturma
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'gizli_anahtar', {
    expiresIn: '30d'
  });
};

// @desc    Kullanıcı kaydı
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, displayName } = req.body;

    console.log('Kayıt isteği:', { email, hasDisplayName: !!displayName });

    // Kullanıcı zaten var mı kontrol et
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Bu e-posta adresi zaten kullanımda' });
    }

    // Yeni kullanıcı oluştur
    const userData = {
      email,
      password,
      platform: req.body.platform || 'web'
    };

    // displayName veya fullName varsa ekle
    if (displayName) userData.displayName = displayName;
    if (fullName) userData.fullName = fullName;

    const user = await User.create(userData);

    if (user) {
      // Döndürülecek isim
      const userName = user.fullName || user.displayName || '';
      
      res.status(201).json({
        _id: user._id,
        fullName: userName,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Geçersiz kullanıcı verileri' });
    }
  } catch (error) {
    console.error('Kayıt hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// @desc    Kullanıcı girişi
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(`Giriş denemesi: ${email}`);

    // Kullanıcıyı e-postaya göre bul
    const user = await User.findOne({ email }).select('+password');
    
    console.log(`Kullanıcı bulundu mu: ${!!user}`);
    
    // Kullanıcı ve şifre kontrolü
    if (user && (await user.matchPassword(password))) {
      // displayName veya fullName kullan - MongoDB uyumluluk için
      const userName = user.fullName || user.displayName || '';
      
      res.json({
        _id: user._id,
        fullName: userName,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      console.log(`Giriş başarısız: ${email}`);
      res.status(401).json({ message: 'E-posta veya şifre hatalı' });
    }
  } catch (error) {
    console.error('Giriş hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// @desc    Kullanıcı profili
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        createdAt: user.createdAt
      });
    } else {
      res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
  } catch (error) {
    console.error('Profil hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// @desc    Kullanıcı profili güncelleme
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.fullName = req.body.fullName || user.fullName;
      user.email = req.body.email || user.email;
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        token: generateToken(updatedUser._id)
      });
    } else {
      res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
  } catch (error) {
    console.error('Profil güncelleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
}; 