const mongoose = require('mongoose');

const postsSchema = new mongoose.Schema({
  address: {
    exactaddress: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    ward: {
      type: String,
      required: true,
    },
  },
  category: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  contactInfo: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
  },
  rentalPrice: {
    type: String,
    required: true,
  },
  area: {
    type: String,
    required: true,
  },
  rentalTarget: {
    type: String,
    required: true,
  },
  maxOccupants: {
    type: Number,
    required: true,
  },
  images:[String],
  youtubeLink: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  visibility:{
    type: String,
    enum: ["visible","hiden"],
    default: "hiden",
  },
}, { timestamps: true });

const Post = mongoose.model('Post', postsSchema);

module.exports = Post;