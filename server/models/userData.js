const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userID: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userRole: { type: String, default: 'user' },
  bankAccount: { type: String, required: true },
  agreedToUserAgreement: { type: Boolean, required: true }
});

module.exports = mongoose.model('User', userSchema);
