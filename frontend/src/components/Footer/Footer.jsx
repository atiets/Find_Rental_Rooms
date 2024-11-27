import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import './Footer.css';

const Footer = () => {
  return (
    <Box className="footer">
      <Box className="footer-logo-description">
        <Typography variant="h6" className="footer-logo">PHÒNG TRỌ XINH</Typography>
        <Typography variant="body2" className="footer-description">
          Tìm phòng trọ chưa bao giờ dễ dàng đến thế! Hãy đến với Phòng trọ xinh - vô vàn thông tin hữu ích được mang lại.
        </Typography>
        <Box className="footer-social">
          <Button className="social-button">Facebook</Button>
          <Button className="social-button">Instagram</Button>
          <Button className="social-button">LinkedIn</Button>
        </Box>
      </Box>

      <Box className="footer-links">
        <Typography variant="h6">Liên kết</Typography>
        <Typography variant="body2">About us</Typography>
        <Typography variant="body2">Community Blog</Typography>
        <Typography variant="body2">Work with Us</Typography>
        <Typography variant="body2">Privacy Policy</Typography>
        <Typography variant="body2">Contact us</Typography>
      </Box>

      <Box className="footer-newsletter">
        <Typography variant="h6">Bản tin</Typography>
        <Typography variant="body2">Đăng ký ngay để nhận bản tin mới nhất.</Typography>
        <TextField label="Email address" variant="outlined" className="email-input" />
        <Button className="subscribe-button">Đăng ký</Button>
      </Box>

      <Box className="footer-contact">
        <Typography variant="h6">Liên hệ</Typography>
        <Typography variant="body2">Số điện thoại: (+84) 0313-728-397</Typography>
        <Typography variant="body2">Email: PhongTroXinh@gmail.com</Typography>
        <Typography variant="body2">Địa chỉ: 01 Đ. Võ Văn Ngân, Linh Chiểu, Thủ Đức, Hồ Chí Minh</Typography>
      </Box>
    </Box>
  );
};

export default Footer;