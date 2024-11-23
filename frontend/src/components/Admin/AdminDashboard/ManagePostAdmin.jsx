import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { Button, Menu, MenuItem, Pagination, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { approvePost, getAllPosts, rejectPost } from '../../../redux/postAPI';
import './ManagePostAdmin.css';
import RoomPostManage from './RoomPostManage';

const ManagePostAdmin = () => {
    const [filter, setFilter] = useState('Tất cả');
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);
    const [allPosts, setAllPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const currentUser = useSelector((state) => state.auth.login.currentUser);
    const token = currentUser?.accessToken;

    const navigate = useNavigate();

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setAnchorEl(null);
    };

    const handleTitleClick = (id) => {
        navigate(`/posts/${id}`);
    };

    const statusVisibilityMap = {
        'Tất cả': { status: '', visibility: '' },
        'Chờ duyệt': { status: 'pending', visibility: 'hiden' },
        'Đang hiển thị': { status: 'approved', visibility: 'visible' },
        'Đã từ chối': { status: 'rejected', visibility: 'hiden' },
    };

    const fetchFilteredPosts = async () => {
        const { status, visibility } = statusVisibilityMap[filter] || {};
        try {
            const data = await getAllPosts(token, currentPage, 5, status, visibility);
            if (Array.isArray(data.posts)) {
                const formattedPosts = data.posts.map(post => ({
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
                    status: post.status,
                    images: post.images ? post.images.slice(0, 2) : [],
                }));

                setAllPosts(formattedPosts);
                setCurrentPage(data.currentPage);
                setTotalPages(data.totalPages);
            } else {
                console.error('Dữ liệu trả về không phải là mảng.');
            }
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu từ API:', error);
        }
    };

    useEffect(() => {
        fetchFilteredPosts();
    }, [filter, currentPage]);

    const handleFilterChange = (event) => {
        setFilter(event.target.innerText);
        handleClose();
    };

    const handleApprove = async (postId) => {
        try {
            await approvePost(token, postId);
            fetchFilteredPosts();
        } catch (error) {
            console.error('Lỗi khi duyệt bài viết:', error);
        }
    };

    const handleReject = async (postId) => {
        try {
            await rejectPost(token, postId);
            fetchFilteredPosts();
        } catch (error) {
            console.error('Lỗi khi từ chối bài viết:', error);
        }
    };

    return (
        <div className="all-posts-list">
            <div className='manage-post-admin-actions'>
                <div className='manage-post-admin-container-filter'></div>
                <Button startIcon={<FilterAltOutlinedIcon />} className='manage-post-admin-btn-filter' onClick={handleClick}>
                    Lọc bài viết
                </Button>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem onClick={handleFilterChange}>Tất cả</MenuItem>
                    <MenuItem onClick={handleFilterChange}>Chờ duyệt</MenuItem>
                    <MenuItem onClick={handleFilterChange}>Đang hiển thị</MenuItem>
                    <MenuItem onClick={handleFilterChange}>Đã từ chối</MenuItem>
                </Menu>
            </div>
            {allPosts.length > 0 ? (
                allPosts.map((post, index) => (
                    <RoomPostManage
                        key={index}
                        post={post}
                        onTitleClick={handleTitleClick}
                        onApprove={handleApprove}
                        onReject={handleReject}
                    />
                ))
            ) : (
                <div className='container-nocontent'>
                    <Typography>Chưa có tin đăng nào</Typography>
                </div>
            )}
            <Pagination
                className='manage-post-admin-pagination'
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="medium"
                siblingCount={1}
                boundaryCount={1}
            />
        </div>
    );
};

export default ManagePostAdmin;