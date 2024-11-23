// Component cha (Ví dụ: UserPostList)
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApprovedPosts } from '../../../redux/postAPI';
import RoomPost from './RoomPost';
const ListPostHome = () => {
  const [approvedPosts, setApprovedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleTitleClick = (id) => {
    console.log("Navigating to post with ID:", id);
    if (id) {
      navigate(`/posts/${id}`); 
    } else {
      console.error('ID bài đăng không hợp lệ');
    }
  };

  useEffect(() => {
    const fetchApprovedPosts = async () => {
      try {
        const response = await getApprovedPosts();
        const data = response.data;

        const formattedPosts = data.map(post => ({
          id: post._id,
          address: {
            province: post.address?.province || '',
            district: post.address?.district || '',
          },
          title: post.title || '',
          content: post.content || '',
          contactInfo: {
            username: post.contactInfo?.username || '',
            phoneNumber: post.contactInfo?.phoneNumber || '',
          },
          rentalPrice: post.rentalPrice,
          area: post.area,
          images: post.images ? post.images.slice(0, 2) : [],
        }));

        setApprovedPosts(formattedPosts);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu từ API:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedPosts();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="approved-posts-list">
      {approvedPosts.map((post, index) => (
        <RoomPost key={index} post={post} onTitleClick={handleTitleClick} />
      ))}
    </div>
  );
};

export default ListPostHome;
