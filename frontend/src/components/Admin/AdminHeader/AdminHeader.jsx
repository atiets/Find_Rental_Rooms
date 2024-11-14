import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createAxios } from '../../../createInstance';
import { logout } from '../../../redux/apiRequest';
import { logoutSuccess } from '../../../redux/authSlice';
import './AdminHeader.css';

const AdminHeader = () => {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.login.currentUser); 
  const dispatch = useDispatch();
  const accessToken = currentUser?.accessToken;
  const id = currentUser?._id;
  let axiosJWT = axios.create({
    baseURL: "http://localhost:8000",
  });
  axiosJWT = createAxios(currentUser, dispatch, logoutSuccess);

  const handleLogout = () => {
    logout(dispatch, id, navigate, accessToken, axiosJWT);
  };

  return (
    <AppBar position="static" className="admin-header">
      <Toolbar>
        <Typography variant="h6" className="admin-header-title">
          Admin Dashboard
        </Typography>
        <Box className="admin-header-buttons">
          <Button color="inherit" onClick={() => navigate('/admin-dashboard')}>Dashboard</Button>
          <Button color="inherit" onClick={() => navigate('/manage-users')}>Quản Lý Người Dùng</Button>
          <Button color="inherit" onClick={() => navigate('/manage-posts')}>Quản Lý Bài Đăng</Button>
          <Button color="inherit" onClick={() => navigate('/manage-news')}>Quản Lý Tin Tức</Button> 
          <Button color="inherit" onClick={() => navigate('/admin-settings')}>Cài Đặt</Button>
          <Button color="inherit" onClick={handleLogout}>Đăng Xuất</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AdminHeader;