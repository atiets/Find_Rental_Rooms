import React from "react";

const Sidebar = ({ user, setSelectedMenu }) => {
  const handleLogout = () => {
    // Implement logout functionality
  };

  return (
    <div className="sidebar">
      <nav className="nav-menu">
        <ul>
          <li onClick={() => setSelectedMenu('allPost')}>Tất cả</li>
          <li onClick={() => setSelectedMenu('pendingList')}>Bài viết đang chờ</li>
          <li onClick={() => setSelectedMenu('visibleList')}>Bài viết đang hiển thị</li>
          <li onClick={() => setSelectedMenu('updateList')}>Bài viết chỉnh sửa chờ duyệt</li>
          <li onClick={handleLogout}>Đăng xuất</li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;