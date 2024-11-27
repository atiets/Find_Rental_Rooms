import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { useSelector } from 'react-redux';
import './AddReviewForm.css'; // Import CSS

const AddReviewForm = () => {
  const { id } = useParams();
  const [postId, setPostId] = useState(id);

  const [rating, setRating] = useState(0); // Giá trị mặc định 0 (chưa chọn)
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const currentUser = useSelector((state) => state.auth.login.currentUser);
  const token = currentUser?.accessToken;
  const decoded = jwtDecode(token);
  const userID = decoded.id;
  const [userId, setUserId] = useState(userID);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset trạng thái lỗi
    setError(null);

    if (!postId || !userId) {
      setError('Post ID and User ID are required.');
      return;
    }

    setLoading(true);
    try {
      // Gửi yêu cầu đến API để tạo review
      await axios.post('http://localhost:8000/v1/review/reviews', {
        post: postId,
        user: userId,
        rating,
        comment,
      });

      // Reset form và ẩn form sau khi gửi thành công
      setRating(0); // Đặt lại rating
      setComment('');
      alert('Review added successfully!');
      setShowForm(false); // Ẩn form
    // Reload lại trang
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to add review.');
    } finally {
      setLoading(false);
    }
  };

  const handleStarClick = (index) => {
    setRating(index + 1); // Cập nhật rating (index từ 0, nên cộng 1)
  };

  return (
    <div className="addreview-review-header">
      <h3>Đánh giá & bình luận</h3>
      {/* Nút hiển thị form */}
      <button onClick={() => setShowForm(true)} className="addreview-button">
        Đánh giá ngay
      </button>
  
      {/* Form hiển thị giữa màn hình */}
      {showForm && (
        <div className="addreview-overlay">
          <div className="addreview-form-container">
            <h3>Thêm Đánh Giá</h3>
            <form onSubmit={handleSubmit}>
              {/* Star Rating Input */}
              <div className="addreview-form-group">
                <label>Đánh giá:</label>
                <div className="addreview-stars">
                  {[...Array(5)].map((_, index) => (
                    <svg
                      key={index}
                      onClick={() => handleStarClick(index)}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill={index < rating ? '#FFD700' : '#E4E5E9'}
                      width="36px"
                      height="36px"
                      className="addreview-star"
                      style={{ cursor: 'pointer' }}
                    >
                      <path d="M12 .587l3.668 7.431 8.2 1.184-5.93 5.766 1.398 8.151L12 18.897l-7.336 3.872 1.398-8.151-5.93-5.766 8.2-1.184z" />
                    </svg>
                  ))}
                </div>
              </div>
  
              {/* Comment Input */}
              <div className="addreview-form-group">
                <label htmlFor="comment">Bình luận:</label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Viết bình luận tại đây..."
                  className="addreview-textarea"
                ></textarea>
              </div>
  
              {/* Error Message */}
              {error && <p style={{ color: 'red' }}>{error}</p>}
  
              {/* Submit Button */}
              <button type="submit" disabled={loading} className="addreview-submit-button">
                {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
              </button>
  
              {/* Close Button */}
              <button type="button" onClick={() => setShowForm(false)} className="addreview-close-button">
                Đóng
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddReviewForm;
