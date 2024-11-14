const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    maxlength: 20,
    unique: true,
  },
  password: {
    type: String,
    required: false,
    minlength: 6,
  },
  email: {
    type: String,
    required: true,
    maxlength: 50,
    unique: true,
  },
  admin: {
    type: Boolean,
    default: false,
  },
  profile: {
    name: {
      type: String,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    avatar: {
      type: String,
    },
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;