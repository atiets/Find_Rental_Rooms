import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createAxios } from "../../../createInstance";
import { getAllUsers } from "../../../redux/apiRequest";
import { loginSuccess } from "../../../redux/authSlice";
import "./ManageUsers.css";

const ManageUsers = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const userList = useSelector((state) => state.users.users?.allUsers);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openProfile, setOpenProfile] = useState(false);
  const [selectedUserProfile, setSelectedUserProfile] = useState(null);

  // Create axiosJWT instance
  let axiosJWT = createAxios(user, dispatch, loginSuccess);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user?.accessToken) {
      getAllUsers(user.accessToken, dispatch, axiosJWT);
    }
  }, [user, navigate]);

  // Open confirmation dialog
  const handleOpenDialog = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  // Open profile modal
  const handleOpenProfile = (user) => {
    console.log('Selected User:', user);
    console.log('Picture URL:', user?.profile?.picture);
    setSelectedUserProfile(user); // Set the selected user for profile modal
    setOpenProfile(true); // Open the profile modal
  };

  // Close confirmation dialog
  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  // Close profile modal
  const handleCloseProfile = () => {
    setOpenProfile(false);
    setSelectedUserProfile(null);
  };


  // Block/unblock user account
  const handleBlockUser = async () => {
    if (!selectedUser) return;

    try {
      const response = await axiosJWT.put(
        `/v1/user/block/${selectedUser._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${user?.accessToken}` },
        }
      );

      if (response.status === 200) {
        alert(response.data.message);
        // Refresh the user list
        getAllUsers(user?.accessToken, dispatch, axiosJWT);
      }
    } catch (error) {
      console.error("Error blocking/unblocking user:", error);
      alert("Không thể cập nhật trạng thái tài khoản.");
    } finally {
      handleCloseDialog();
    }
  };

  // Navigate to user's posts
  const handleViewPosts = (userId) => {
    navigate(`/user-posts/${userId}`);
  };

  // Filter out admin accounts
  const filteredUsers = userList?.filter((item) => !item.admin);

  return (
    <Box className="manage-users">
      <Box className="content">
        <Typography variant="h4" gutterBottom>
          Quản Lý Người Dùng
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Hành động</TableCell>
                <TableCell>Bài đăng</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers?.map((user) => (
                <TableRow key={user._id}>
                  <TableCell><p className="user_name" onClick={() => handleOpenProfile(user)}>{user.username}</p> </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.profile?.isBlocked ? "Đã khóa" : "Hoạt động"}
                  </TableCell>
                  <TableCell>
                    <Button
                      color={user.profile?.isBlocked ? "secondary" : "primary"}
                      onClick={() => handleOpenDialog(user)}
                    >
                      {user.profile?.isBlocked
                        ? "Mở khóa tài khoản"
                        : "Khóa tài khoản"}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      color="secondary"
                      onClick={() => handleViewPosts(user._id)}
                    >
                      Xem tất cả bài đăng
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog
        open={open}
        onClose={() => handleOpenDialog(user)}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">Xác Nhận</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            {selectedUser?.profile?.isBlocked
              ? `Bạn có chắc muốn mở khóa tài khoản của ${selectedUser?.username}?`
              : `Bạn có chắc muốn khóa tài khoản của ${selectedUser?.username}?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <div className="user-btn">
            <Button className="btn btn-cancel" onClick={handleCloseDialog} color="primary">
              Hủy
            </Button>
            <Button className="btn btn-accept" onClick={handleBlockUser} color="secondary" autoFocus>
              Xác nhận
            </Button>
          </div>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openProfile}
        onClose={handleCloseProfile}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="profile-dialog-title">
          Thông Tin Người Dùng
        </DialogTitle>
        <DialogContent>
          <div className="user-detail user-image">
            <img
              src={selectedUserProfile?.profile?.picture ? selectedUserProfile?.profile?.picture : require('../../../assets/images/user.png')}
              alt="Profile"
            />
          </div>

          <DialogContentText>
            {/* <strong>👤: </strong>{selectedUserProfile?.username}<br />
      <strong>📧: </strong>{selectedUserProfile?.email}<br />
      <strong>📞: </strong>{selectedUserProfile?.profile?.phone}<br />
      <strong>📍: </strong>{selectedUserProfile?.profile?.address}<br />
      <strong>💬: </strong>{selectedUserProfile?.profile?.}<br /> */}
            <div className="user-information">
              {
                selectedUserProfile?.username && <dl>
                  <dt><i className="fa-solid fa-user"></i> :</dt>
                  <dd>{selectedUserProfile?.username}</dd>
                </dl>
              }
              {
                selectedUserProfile?.email && <dl>
                <dt><i className="fa-solid fa-envelope"></i> :</dt>
                <dd>{selectedUserProfile?.email}</dd>
              </dl>
              }
              {
                selectedUserProfile?.profile?.phone &&  <dl>
                <dt><i className="fa-solid fa-phone"></i> :</dt>
                <dd><a href={`tel:${selectedUserProfile?.profile?.phone}`}>{selectedUserProfile?.profile?.phone}</a></dd>
              </dl>
              }
              {
                selectedUserProfile?.profile?.address &&  <dl>
                <dt><i className="fa-solid fa-location-dot"></i> :</dt>
                <dd>{selectedUserProfile?.profile?.address}</dd>
              </dl>
              }
              {
                selectedUserProfile?.profile?.bio &&  <dl>
                <dt><i className="fa-solid fa-book-atlas"></i> :</dt>
                <dd>{selectedUserProfile?.profile?.bio}</dd>
              </dl>
              }
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <div className="user-btn">
            <Button className="btn btn-accept" onClick={handleCloseProfile} color="primary">
              Đóng
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageUsers;