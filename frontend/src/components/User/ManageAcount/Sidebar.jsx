import React from "react";
import './Sidebar.css';

const Sidebar = ({ user, selectedMenu, setSelectedMenu }) => {
  const handleLogout = () => {
    console.log("User logged out");
  };

  const avatar = user?.avatar || "default-avatar.png";

  const menuItems = [
    { id: 'newPost', label: 'Đăng tin mới' },
    { id: 'postList', label: 'Danh sách tin đăng' },
    { id: 'manageAccount', label: 'Quản lý tài khoản' },
  ];

  return (
    <div className="sidebar">
      <div className="user-info">
        <div className="user-details">
          <img
            src={avatar} // Sử dụng đường dẫn avatar
            alt="User Avatar"
            className="user-avatar" // Thêm class để dễ dàng style
          />
        </div>
      </div>
      <nav className="nav-menu">
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={`menu-item ${selectedMenu === item.id ? 'active' : ''}`}
              onClick={() => setSelectedMenu(item.id)}
            >
              {item.label}
            </li>
          ))}
          <li className="menu-item logout" onClick={handleLogout}>
            Đăng xuất
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
