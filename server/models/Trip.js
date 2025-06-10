const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  plan: {
    type: String,
    required: [true, 'Seyahat planı zorunludur']
  },
  userprompt: {
    type: String,
    required: [true, 'Kullanıcı sorgusu zorunludur']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Kullanıcı ID zorunludur']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Trip = mongoose.model('trips', tripSchema, 'trips');

module.exports = Trip; 