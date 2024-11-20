import React from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';
import './Footer.css';

const Footer = () => {
  return (
    <Box className="footer" sx={{ backgroundColor: '#282c34', color: '#fff', padding: '20px 0' }}>
      <Container>
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              CÔNG TY TNHH UTE
            </Typography>
            <Typography variant="body2">
              Chuyên cung cấp dịch vụ cho thuê phòng trọ, căn hộ, nhà nguyên căn tại TP. Hồ Chí Minh.
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Thông tin liên hệ</Typography>
            <Typography variant="body2">Tổng đài CSKH: 04564789</Typography>
            <Typography variant="body2">Email: PhongTroXinh@gmail.com</Typography>
            <Typography variant="body2">
              Địa chỉ: 01 Đ. Võ Văn Ngân, Linh Chiểu, Thủ Đức, Hồ Chí Minh
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="body2" sx={{ textAlign: 'center' }}>
              Copyright © 2023 - 2024 PhongTroXinh.com
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
