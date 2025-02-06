const mongoose = require('mongoose');
  // ✅ bcrypt -> bcryptjs

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  photo: { type: String, default: '' },
}, { timestamps: true });

// Hash password before saving
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next(); // Prevent re-hashing
//   this.password = await bcrypt.hash(this.password, 12); // Hash only once
//   next();
// });


// Compare password for login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
