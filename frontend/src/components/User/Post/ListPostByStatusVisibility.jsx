import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { getUserPostsByStateAndVisibility } from '../../../redux/postAPI'; // Hàm API mới
import './RoomPost.css';
import RoomPostManage from './RoomPostManage';
const ListPostByStatusVisibility = ({ status, visibility, token, setSelectedMenu }) => {
    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();  // Initialize navigate function

    // Hàm điều hướng khi nhấn vào tiêu đề bài viết
    const handleTitleClick = (id) => {
        console.log("Navigating to post with ID:", id);
        if (id) {
            navigate(`/posts/${id}`);  // Điều hướng đến bài viết với ID tương ứng
        } else {
            console.error('ID bài đăng không hợp lệ');
        }
    };

    const handleCreatePost = () => {
        navigate('/AddPost'); // Khi nhấn vào, thay đổi nội dung sang đăng tin mới
    };

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const response = await getUserPostsByStateAndVisibility(status, visibility, token);
                const data = response.data;

                console.log("User posts:", data);
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
                    images: post.images ? post.images.slice(0, 2) : [], // Hiển thị 2 ảnh đầu tiên
                }));

                setUserPosts(formattedPosts);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu từ API:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserPosts();
    }, [status, visibility, token]); // Dependency array, fetch lại khi các giá trị thay đổi

    // Nếu đang tải dữ liệu thì hiển thị loading
    if (loading) return <div>Loading...</div>;

    return (
        <div className="user-posts-list">
            {/* Hiển thị bài đăng */}
            {userPosts.length > 0 ? (
                userPosts.map((post, index) => (
                    <RoomPostManage key={index} post={post} onTitleClick={handleTitleClick} />
                ))
            ) : (
                // Nếu không có bài đăng, hiển thị nút đăng tin mới
                <div className='container-nocontent'>
                    <Typography>Bạn chưa có tin đăng nào</Typography>
                    <button onClick={handleCreatePost} style={{ marginTop: '20px' }}>
                        Đăng tin ngay
                    </button>
                </div>
            )}
        </div>
    );
};

export default ListPostByStatusVisibility;
