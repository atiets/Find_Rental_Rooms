import Diversity3OutlinedIcon from '@mui/icons-material/Diversity3Outlined';
import EmailIcon from '@mui/icons-material/Email';
import HouseOutlinedIcon from '@mui/icons-material/HouseOutlined';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import { Avatar, Box, Button, Card, Divider, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPostDetail } from '../../../redux/postAPI';
import Header from '../Header/Header';
import './PostDetail.css';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const response = await getPostDetail(id);
        console.log("Response Data:", response);
        setPost(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy chi tiết bài đăng:', error);
      }
    };

    fetchPostDetail();
  }, [id]);

  if (!post) return <div>Loading...</div>;

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % post.images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + post.images.length) % post.images.length);
  };


  return (
    <div className="post-detail-container">
      <Header />
      {post.images && post.images.length > 0 && (
        <div className="image-gallery">
          <img
            src={post.images[currentIndex]}
            alt={`Post image ${currentIndex + 1}`}
            className="post-detail-image"
          />
          <button className="prev-btn" onClick={prevImage}>←</button>
          <button className="next-btn" onClick={nextImage}>→</button>
        </div>
      )}

      <Box className="container-content-detail">
        <Box className="container-left">
          <Box className="container-cost">
            <Typography className='post-title'>{post.title}</Typography>
            <Button className="room-post-price">{post.rentalPrice}</Button>
          </Box>
          <Button
            startIcon={<RoomOutlinedIcon />}
            className='address-detail'
          >
            {post.address.exactaddress} {post.address.ward} {post.address.district} {post.address.province}
          </Button>
          <Typography className='post-content'>{post.content}</Typography>
          <TableContainer component={Paper} className='container-table'>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className='title-cell'> <HouseOutlinedIcon className='style-icon' /> Loại hình cho thuê</TableCell>
                  <TableCell>{post.category}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className='title-cell'> <Diversity3OutlinedIcon className='style-icon' /> Số người tối đa</TableCell>
                  <TableCell>{post.maxOccupants}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className='title-cell'> <PeopleOutlineOutlinedIcon className='style-icon' />Đối tượng cho thuê</TableCell>
                  <TableCell>{post.rentalTarget}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className='title-cell'> <MapOutlinedIcon className='style-icon' /> Diện tích</TableCell>
                  <TableCell>{post.area}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box className="container-right">
          <Card className='card-info'>
            <Box className='container-contactinfo'>
              <Avatar className="room-post-avatar">{post.contactInfo.username.charAt(0)}</Avatar>
              <Typography className="room-post-username">{post.contactInfo.username}</Typography>
            </Box>
            <Divider></Divider>
            <Button variant="outlined" className="room-post-button">
              <LocalPhoneIcon className='style-icon'/> {post.contactInfo.phoneNumber}
            </Button>
            <Button variant="outlined" className="room-post-button">
              <EmailIcon className='style-icon'/> Gửi tin nhắn
            </Button>
          </Card>
        </Box>
      </Box>
    </div>
  );
};

export default PostDetail;
