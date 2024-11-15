
import axios from 'axios';

const API_URL = 'http://localhost:8000/v1/posts/'; // Thay thế bằng URL API của bạn

export const createPost = async (postData, token) => {
  const response = await axios.post(API_URL, postData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  console.log("Response status:", response.status);
  console.log("Response data:", response.data);
  if (response.status === 201 || response.status === 200) {
    return response;
  } else {
    throw new Error('Unexpected response status: ' + response.status);
  }
}

export const getAllPosts = async (token) => { 
  try {
    const response = await axios.get(`${API_URL}posts`, {
      headers: {
        Authorization: `Bearer ${token}` // Thêm token vào header
      }
    });
    return response.data; // Return the data from the response
  } catch (error) {
    throw new Error(error.message); // Throw an error if the request fails
  }
};

export const getApprovedPosts = async () => {
  try {
    const response = await axios.get(`${API_URL}posts-by-status?status=approved`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getPostDetail = async (id) => {
  try {
    const response = await axios.get(`${API_URL}posts/${id}`);
    return response;
  } catch (error) {
    console.error('Lỗi khi gọi API lấy chi tiết bài đăng:', error);
    throw error;
  }
};

export const getUserPostsByStateAndVisibility = async (status, visibility, token) => {
  try {
    const response = await axios.get(`${API_URL}list-post-pending`, {
      params: { status, visibility },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Lỗi khi gọi API lấy bài đăng của người dùng theo trạng thái và visibility:', error);
    throw error;
  }
};
