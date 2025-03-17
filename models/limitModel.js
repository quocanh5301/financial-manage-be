const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
  },
  moneyPotID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MoneyPot"
  },
  limit: {
    type: Number,
    default: 0
  },
  periodType: {
    type: String,
    enum: ['Weekly', 'Monthly', 'yearly'], 
    default: 'Weekly' 
  },
}, {
  timestamps: true
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
