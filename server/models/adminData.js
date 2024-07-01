const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  loginID: { type: String, required: true },
  password: { type: String, required: true },
  userRole: { type: String, default: 'admin' }
});

module.exports = mongoose.model('Admin', adminSchema);
