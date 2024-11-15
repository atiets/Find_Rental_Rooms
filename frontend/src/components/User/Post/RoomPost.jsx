import React from 'react';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Avatar, Box, Button, Card, CardContent, CardMedia, IconButton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getApprovedPosts } from '../../../redux/postAPI';
import './RoomPost.css';

const RoomPost = ({ post, onTitleClick }) => {
  return (
    <Card className="room-post-card">
      <Box className="room-post-images">
        {/* Chỉ hiển thị ảnh đầu tiên */}
        {post.images[0] && (
          <CardMedia
            component="img"
            image={post.images[0]} 
            alt="Room image"
            className="room-post-image"
          />
        )}
        <button className="room-post-price">{post.rentalPrice}</button>
      </Box>
      <CardContent className="room-post-content">
        <Box>
          <Typography className="room-post-title" onClick={() => onTitleClick(post.id)}>
            {post.title}
          </Typography>
          <Typography variant="body2" className="room-post-location">
            {post.address.district}, {post.address.province}
          </Typography>
        </Box>
        <Box>
          <Button className="post-area">{post.area}</Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RoomPost;
