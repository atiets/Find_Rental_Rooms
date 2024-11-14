import { Box, FormControl, Select } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createAxios } from '../../../createInstance';
import { logout } from '../../../redux/apiRequest';
import { logoutSuccess } from '../../../redux/authSlice';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const currentUser = useSelector((state) => state.auth.login.currentUser);
    const dispatch = useDispatch();
    const accessToken = currentUser?.accessToken;
    const id = currentUser?._id;
    const [propertyType, setPropertyType] = useState('');
    const axiosJWT = createAxios(currentUser, dispatch, logoutSuccess);
    const handleLogout = () => {
        logout(dispatch, id, navigate, accessToken, axiosJWT);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleChange = (event) => {
        setPropertyType(event.target.value);
        console.log('Selected Property Type:', event.target.value);
        if (event.target.value === 'tro') {
            navigate('/ChoThueTro');
        } else if (event.target.value === 'nha') {
            navigate('/ChoThueNha');
        } else if (event.target.value === 'matbang') {
            navigate('/ChoThueMatBang');
        }
    };

    const handleAddPost = () => {
        // Kiểm tra xem người dùng có đăng nhập hay không
        if (!currentUser) {
            alert('Bạn cần đăng nhập để đăng tin mới.'); // Hiển thị thông báo
            navigate('/login'); // Di chuyển đến trang đăng nhập
        } else {
            navigate('/AddPost'); // Di chuyển đến trang thêm bài viết
        }
    };

    return (
        <AppBar position="static" className="header">
            <Toolbar className='toolbar'>
                <Typography variant="h6" className="header-title">
                    PhongTroXinh.com
                </Typography>
                <Box className="header-buttons">
                    <Button color="inherit" onClick={() => navigate('/')}>Trang Chủ</Button>
                    <FormControl variant="outlined" className="property-select">
                        <Select
                            id="property-type"
                            value={propertyType}
                            onChange={handleChange}
                            displayEmpty
                            className="property-select-input"
                            inputProps={{
                                'aria-label': 'Chọn Loại Bất Động Sản',
                            }}
                        >
                            <MenuItem value="" disabled>Chọn Loại Bất Động Sản</MenuItem>
                            <MenuItem value="tro">Cho Thuê Trọ</MenuItem>
                            <MenuItem value="nha">Cho Thuê Nhà</MenuItem>
                            <MenuItem value="matbang">Cho Thuê Mặt Bằng</MenuItem>
                        </Select>
                    </FormControl>
                    <Button color="inherit" onClick={() => navigate('/TinTuc')}>Tin Tức</Button>
                    <Button color="inherit" onClick={handleAddPost}>Đăng tin mới</Button>
                    <Button color="inherit" onClick={handleClick}>
                        {currentUser ? `Hi, ${currentUser.username}` : 'Tài khoản'}
                    </Button>
                </Box>
            </Toolbar>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                classes={{ paper: 'menu' }}
            >
                {!currentUser ? (
                    <>
                        <MenuItem className="menu-item" onClick={() => { navigate('/login'); handleClose(); }}>Đăng Nhập</MenuItem>
                        <MenuItem className="menu-item" onClick={() => { navigate('/register'); handleClose(); }}>Đăng Ký</MenuItem>                    </>
                ) : (
                    <>
                        <MenuItem className="menu-item" onClick={() => { navigate('/managerAc'); handleClose(); }}>Quản lý tài khoản</MenuItem>
                        <MenuItem className="menu-item" onClick={handleLogout}>Đăng Xuất</MenuItem>
                    </>
                )}
            </Menu>
        </AppBar>
    );
};

export default Header;