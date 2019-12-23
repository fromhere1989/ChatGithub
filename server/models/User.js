const mongoose =require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    uniqe: true,
    lowercase: true,
  },
  passwore: {
    type: String,
    required: true,
    minlength: 6,
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
