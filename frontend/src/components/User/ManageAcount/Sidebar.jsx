import React from "react";

const Sidebar = ({ user, setSelectedMenu }) => {
  const handleLogout = () => {
    // Implement logout functionality
  };

  return (
    <div className="sidebar">
      <div className="user-info">
        <img src={user.avatar} alt="User Avatar" className="avatar" />
        <div className="user-details">
          <h3 className="user-name">{user.username}</h3>
          <p className="user-phone">{user.phone}</p>
        </div>
      </div>
      <nav className="nav-menu">
        <ul>
          <li onClick={() => setSelectedMenu('newPost')}>Đăng tin mới</li>
          <li onClick={() => setSelectedMenu('postList')}>Danh sách tin đăng</li>
          <li onClick={() => setSelectedMenu('manageAccount')}>Quản lý tài khoản</li>
          <li onClick={handleLogout}>Đăng xuất</li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;