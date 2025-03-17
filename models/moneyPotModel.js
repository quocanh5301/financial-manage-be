const mongoose = require('mongoose');

const moneyPotSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  value: {
    type: Number,
    default: 0
  },
}, {
  timestamps: true
});

const MoneyPot = mongoose.model('MoneyPot', moneyPotSchema);

module.exports = MoneyPot;
