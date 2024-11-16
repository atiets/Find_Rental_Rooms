// src/redux/postSlice.js

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createPost } from './postAPI'; // Nhập khẩu hàm createPost

// Thunk để thêm bài viết
export const addPost = createAsyncThunk(
  'posts/addPost',
  async (postData, { rejectWithValue }) => {
    try {
      const response = await createPost(postData); // Gọi hàm createPost
      return response.data; // Dữ liệu bài viết vừa được thêm
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add post');
    }
  }
);

const postSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Xử lý thêm bài viết
      .addCase(addPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.push(action.payload); // Thêm bài viết vào danh sách
      })
      .addCase(addPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Lưu thông báo lỗi
      })
  },
});

// Export các action và reducer
export const { clearError } = postSlice.actions;

export default postSlice.reducer;
