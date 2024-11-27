import React, { useState, useRef } from "react";
import './Sidebar.css';
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

const Sidebar = ({ user, selectedMenu, setSelectedMenu, updateProfilePicture }) => {
  const dispatch = useDispatch();
  const profile = user?.profile || {};
  const name = profile.name || "Người dùng";
  const picture = profile.picture || "default-avatar.png";

  const [preview, setPreview] = useState(picture); // Lưu ảnh được chọn trước khi upload

  // Lấy accessToken từ Redux store
  const accessToken = useSelector((state) => state.auth?.login?.currentUser?.accessToken);

  // Sử dụng ref để tham chiếu tới input file
  const fileInputRef = useRef(null);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result); // Hiển thị ảnh xem trước
      };
      reader.readAsDataURL(file);

      // Tạo FormData để gửi ảnh lên server
      const formData = new FormData();
      formData.append("picture", file);  // Thêm file ảnh vào formData

      try {
        // Gửi ảnh lên server thông qua API (giả sử API này nhận file ảnh và trả về URL ảnh)
        const response = await axios.put(
          "http://localhost:8000/v1/auth/update",  // Địa chỉ API
          formData,  // Dữ liệu gửi đi, ở đây là formData chứa ảnh
          {
            headers: {
              "Content-Type": "multipart/form-data",  // Đảm bảo rằng content type là multipart/form-data
              Authorization: `Bearer ${accessToken}`, // Gửi accessToken từ Redux store
            }
          }
        );

        // Cập nhật lại thông tin ảnh profile từ phản hồi
        if (response.data.profile?.picture) {
          dispatch(updateProfilePicture(response.data.profile.picture)); // Cập nhật ảnh đại diện trong Redux
          console.log("Profile picture updated!");
          console.log(response.data.profile?.picture)
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };


  const handleImageClick = () => {
    // Mở hộp thoại chọn ảnh khi người dùng nhấp vào ảnh đại diện
    fileInputRef.current.click();
  };

  const handleLogout = () => {
    console.log("User logged out");
    // Thêm logic đăng xuất
  };

  const menuItems = [
    { id: 'newPost', label: 'Đăng tin mới' },
    { id: 'postList', label: 'Danh sách tin đăng' },
    { id: 'manageAccount', label: 'Quản lý tài khoản' },
  ];

  return (
    <div className="sidebar">
      <div className="user-info">
        <div className="user-details">
          {/* Ảnh đại diện có thể nhấp để chọn ảnh */}
          <img
            src={preview} // Hiển thị ảnh hiện tại hoặc ảnh đã chọn
            alt="User Avatar"
            className="user-picture"
            onClick={handleImageClick} // Mở hộp thoại chọn ảnh khi người dùng nhấp vào ảnh
          />

          {/* Input file ẩn đi, sẽ được trigger khi người dùng nhấp vào ảnh */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="upload-input"
            ref={fileInputRef} // Liên kết với ref
            style={{ display: 'none' }} // Ẩn input file
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
          {/* <li className="menu-item logout" onClick={handleLogout}>
            Đăng xuất
          </li> */}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
