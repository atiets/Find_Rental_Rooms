import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ReviewsList.css';

const ReviewsList = ({ postId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/v1/review/reviews/${postId}`);
        setReviews(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchReviews();
  }, [postId]);

  const renderStars = (rating) => {
    return (
      <div className="stars">
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={index < rating ? '#FFD700' : '#E4E5E9'}
            width="20px"
            height="20px"
            className="star"
          >
            <path d="M12 .587l3.668 7.431 8.2 1.184-5.93 5.766 1.398 8.151L12 18.897l-7.336 3.872 1.398-8.151-5.93-5.766 8.2-1.184z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="reviewlist-reviews-list">
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review._id} className="reviewlist-review-item">
            <p className="reviewlist-username"><strong>{review.user.username}</strong></p>
            <div>{renderStars(review.rating)}</div>
            <p className="reviewlist-comment">{review.comment}</p>
          </div>
        ))
      ) : (
        <p>Chưa có đánh giá nào.</p>
      )}
    </div>
  );
  
}
export default ReviewsList;
