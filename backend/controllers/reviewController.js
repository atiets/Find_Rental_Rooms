const Review = require('../models/Review');
const Post = require('../models/Post');

const mongoose = require('mongoose'); // Đảm bảo mongoose được import


// Thêm đánh giá mới
exports.createReview = async (req, res) => {
  try {
    const { post, user, rating, comment } = req.body;

    // Kiểm tra xem 'post' và 'user' có phải là ObjectId hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(post)) {
      return res.status(400).json({ error: 'Invalid post ID format' });
    }
    if (!mongoose.Types.ObjectId.isValid(user)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    // Chuyển đổi thành ObjectId
    const postObjectId = new mongoose.Types.ObjectId(post);
    const userObjectId = new mongoose.Types.ObjectId(user);

    // Tạo đối tượng đánh giá mới
    const review = new Review({
      post: postObjectId,
      user: userObjectId,
      rating,
      comment
    });

    // Lưu vào cơ sở dữ liệu
    await review.save();
    res.status(201).json(review);  // Trả lại đánh giá mới đã được lưu

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy danh sách đánh giá của một bài post
exports.getReviewsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const reviews = await Review.find({ post: postId }).populate('user', 'username'); // Populate để lấy tên người dùng
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Xóa đánh giá
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};