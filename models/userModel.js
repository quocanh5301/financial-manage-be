const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    default: 0
  },
  firebaseToken: {
    type: String,
    default: ""
  },
  sessionToken: {
    type: String,
    default: ""
  },
  refreshSessionToken: {
    type: String,
    default: ""
  },
  verified: {
    type: Boolean,
    default: false
  },
  monthlyIncome: {
    type: Number,
    default: 0
  },
  monthlyOutcome: {
    type: Number,
    default: 0
  },
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
