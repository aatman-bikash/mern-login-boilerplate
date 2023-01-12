const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  //Schema
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, 'Email must be valid'],
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Password is not strong enough']
  }
});

userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = new mongoose.model('User', userSchema);

module.exports = User;