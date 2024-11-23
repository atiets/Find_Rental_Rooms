import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { setSelectedMenu } from '../../../redux/menuSlice';
import { deletePost, getUserPostsByStateAndVisibility, togglePostVisibility } from '../../../redux/postAPI'; // Hàm API mới
import { setPosts, setSelectedPost } from '../../../redux/postSlice';
import './RoomPost.css';
import RoomPostManage from './RoomPostManage';
const ListPostByStatusVisibility = ({ status, visibility, token }) => {
    const [userPosts, setUserPosts] = useState([]);
    const posts = useSelector((state) => state.posts.posts); 
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleTitleClick = (id) => {
        console.log("Navigating to post with ID:", id);
        if (id) {
            navigate(`/posts/${id}`);
        } else {
            console.error('ID bài đăng không hợp lệ');
        }
    };

    const handleCreatePost = () => {
        navigate('/AddPost');
    };

    const handleEditPost = (postId) => {
            dispatch(setSelectedPost(postId));
            dispatch(setSelectedMenu('updatePost')); 
    };

    const handleHidePost = async (postId) => {
        try {
            const response = await togglePostVisibility(postId, token);
            if (response.success) {
                const updatedPosts = posts.filter(post => post.id !== postId);
                dispatch(setPosts(updatedPosts));
            }
        } catch (error) {
            console.error('Lỗi khi ẩn bài viết:', error);
        }
    };

    const handleVisiblePost = async (postId) => {
        try {
            const response = await togglePostVisibility(postId, token);
            if (response.success) {
                const updatedPosts = posts.filter(post => post.id !== postId);
                dispatch(setPosts(updatedPosts));
            }
        } catch (error) {
            console.error('Lỗi khi ẩn bài viết:', error);
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            const result = await deletePost(postId, token);
            console.log('Post deleted:', result); 
        } catch (error) {
            console.error(error);
        }
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
                    images: post.images ? post.images.slice(0, 2) : [],
                    visibility: post.visibility || '',
                    status: post.status || '',
                }));
                dispatch(setPosts(formattedPosts));
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu từ API:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserPosts();
    }, [status, visibility, token]);
    if (loading) return <div>Loading...</div>;

    return (
        <div className="user-posts-list">
            {posts.length > 0 ? (
                posts.map((post, index) => (
                    <RoomPostManage
                        key={index}
                        post={post}
                        onTitleClick={handleTitleClick}
                        onEditPost={handleEditPost}
                        onHidePost={handleHidePost} 
                        onDeletePost={handleDeletePost}
                        onVisiblePost={handleVisiblePost}/>
                ))
            ) : (
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
