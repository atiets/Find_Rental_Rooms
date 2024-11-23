import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h6>CÔNG TY TNHH UTE</h6>
          <p>Chuyên cung cấp dịch vụ cho thuê phòng trọ, căn hộ, nhà nguyên căn tại TP. Hồ Chí Minh.</p>
        </div>
        <div className="footer-section">
          <h6>Thông tin liên hệ</h6>
          <p>Tổng đài CSKH: 04564789</p>
          <p>Email: PhongTroXinh@gmail.com</p>
          <p>Địa chỉ: 01 Đ. Võ Văn Ngân, Linh Chiểu, Thủ Đức, Hồ Chí Minh</p>
        </div>
        <div className="footer-section">
          <p>Copyright © 2023 - 2024 PhongTroXinh.com</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
