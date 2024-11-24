const router = require("express").Router();
const { createReview, getReviewsByPost, deleteReview } = require('../controllers/reviewController');
// Thêm review
router.post('/reviews', createReview);
// Lấy tất cả review của một bài đăng
router.get('/reviews/:postId', getReviewsByPost);

// Xóa review
router.delete('/reviews/:reviewId', deleteReview);

module.exports = router;