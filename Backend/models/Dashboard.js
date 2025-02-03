// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// User Schema
const Dashboard = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
},
{ timestamps: true }
);


module.exports = mongoose.model('Dashboard', Dashboard);





