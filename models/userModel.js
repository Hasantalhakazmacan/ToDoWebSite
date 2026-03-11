// models/userModel.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
        type: String,
        required: true,
        unique: true, // Kullanıcı adları da benzersiz olmalı
        trim: true    // Baş ve sondaki boşlukları kaldırır
    },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 🚀 Şifreyi Kayıt Öncesi Hashleme (Async & next kullanmadan)
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return; // Şifre değişmediyse tekrar hashleme

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 🛡 Şifre Doğrulama Metodu
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
