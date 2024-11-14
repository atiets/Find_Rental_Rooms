import React from 'react';
import { Box, Typography } from '@mui/material';
import './Footer.css';

const Footer = () => {
  return (
    <Box className="footer">
      <Typography variant="h6">
        CÔNG TY TNHH UTE
      </Typography>
      <Typography variant="body1">
        Tổng đài CSKH: 04564789
      </Typography>
      <Typography variant="body1">
        Copyright © 2023 - 2024 PhongTroXinh.com
      </Typography>
      <Typography variant="body1">
        Email: PhongTroXinh@gmail.com
      </Typography>
      <Typography variant="body1">
        Địa chỉ: 01 Đ. Võ Văn Ngân, Linh Chiểu, Thủ Đức, Hồ Chí Minh
      </Typography>
    </Box>
  );
};

export default Footer;