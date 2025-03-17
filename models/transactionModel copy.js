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
  amount: {
    type: Number,
    default: 0
  },
  type: {
    type: String,
    enum: ['Deposit', 'Withdraw'], 
    default: 'Deposit' 
  },
  note: {
    type: String,
    default: ""
  },
}, {
  timestamps: true
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
