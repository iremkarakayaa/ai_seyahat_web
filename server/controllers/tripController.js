const Trip = require('../models/Trip');

// @desc    Seyahat planı oluştur
// @route   POST /api/trips
// @access  Private
const createTrip = async (req, res) => {
  try {
    const { plan, userprompt } = req.body;

    // Gerekli alanları kontrol et
    if (!plan || !userprompt) {
      return res.status(400).json({ message: 'Tüm alanlar zorunludur' });
    }

    // Seyahat planı oluştur
    const trip = await Trip.create({
      plan,
      userprompt,
      userId: req.user._id
    });

    if (trip) {
      res.status(201).json({
        _id: trip._id,
        plan: trip.plan,
        userprompt: trip.userprompt,
        createdAt: trip.createdAt
      });
    } else {
      res.status(400).json({ message: 'Geçersiz seyahat plan verileri' });
    }
  } catch (error) {
    console.error('Seyahat planı oluşturma hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// @desc    Kullanıcıya ait tüm seyahat planlarını getir
// @route   GET /api/trips
// @access  Private
const getUserTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    console.error('Seyahat planlarını getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// @desc    ID'ye göre seyahat planı getir
// @route   GET /api/trips/:id
// @access  Private
const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (trip) {
      // Kullanıcının kendi seyahat planını görmesi için kontrol
      if (trip.userId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Bu seyahat planına erişim yetkiniz yok' });
      }

      res.json(trip);
    } else {
      res.status(404).json({ message: 'Seyahat planı bulunamadı' });
    }
  } catch (error) {
    console.error('Seyahat planı getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// @desc    Seyahat planını güncelle
// @route   PUT /api/trips/:id
// @access  Private
const updateTrip = async (req, res) => {
  try {
    const { plan, userprompt } = req.body;
    const trip = await Trip.findById(req.params.id);

    if (trip) {
      // Kullanıcının kendi seyahat planını güncellemesi için kontrol
      if (trip.userId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Bu seyahat planını güncelleme yetkiniz yok' });
      }

      trip.plan = plan || trip.plan;
      trip.userprompt = userprompt || trip.userprompt;

      const updatedTrip = await trip.save();
      res.json(updatedTrip);
    } else {
      res.status(404).json({ message: 'Seyahat planı bulunamadı' });
    }
  } catch (error) {
    console.error('Seyahat planı güncelleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// @desc    Seyahat planını sil
// @route   DELETE /api/trips/:id
// @access  Private
const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (trip) {
      // Kullanıcının kendi seyahat planını silmesi için kontrol
      if (trip.userId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Bu seyahat planını silme yetkiniz yok' });
      }

      await Trip.deleteOne({ _id: req.params.id });
      res.json({ message: 'Seyahat planı silindi' });
    } else {
      res.status(404).json({ message: 'Seyahat planı bulunamadı' });
    }
  } catch (error) {
    console.error('Seyahat planı silme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

module.exports = {
  createTrip,
  getUserTrips,
  getTripById,
  updateTrip,
  deleteTrip
}; 