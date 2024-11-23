const Post = require('../models/Post');
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');

exports.createPost = async (req, res) => {
    try {
        const { title, content, address, category, rentalPrice, area, rentalTarget, maxOccupants, youtubeLink, contactInfo } = req.body;

        if (!title || !content || !address || !category || !rentalPrice || !area || !rentalTarget || !contactInfo) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const imageUrls = [];
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                imageUrls.push(file.path); 
            });
        }

        const newPost = new Post({
            title,
            content,
            address: JSON.parse(address),  
            category,
            rentalPrice,
            area,
            rentalTarget,
            maxOccupants,
            youtubeLink,
            contactInfo: JSON.parse(contactInfo),
            images: imageUrls,  
        });

        const savedPost = await newPost.save();
        res.status(201).json({
            message: "Post created successfully",
            post: savedPost
        }); 
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: "Validation error", error: error.message });
        }
        console.error("Error creating post:", error);  
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status || '';
        const visibility = req.query.visibility || '';
        const startIndex = (page - 1) * limit;

        const query = {};
        if (status) query.status = status;
        if (visibility) query.visibility = visibility;

        const total = await Post.countDocuments(query);
        const posts = await Post.find(query)
            .skip(startIndex)
            .limit(limit);

        res.status(200).json({
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            posts,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getPostById = async (req, res) => {
    try {
        console.log("Request ID:", req.params.id);
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'ID không hợp lệ' });
        }

        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Bài đăng không tồn tại.' });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error('Lỗi khi lấy chi tiết bài đăng:', error);
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật bài đăng
exports.updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Bài đăng không tồn tại.' });
        }

        Object.assign(post, req.body); 
        const updatedPost = await post.save();
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Bài đăng không tồn tại.' });
        }
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Delete post successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getPostsByStatus = async (req, res) => {
    try {
        const { status } = req.query;
        if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }

        const posts = await Post.find({ status });
        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching posts by status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//Lấy bài đăng(new)
exports.getUserPostsByStateAndVisibility = async (req, res) => {
    try {
        const { status, visibility } = req.query; 

        if (!status || !visibility) {
            return res.status(400).json({ message: "State and visibility are required" });
        }

        const posts = await Post.find({
            "contactInfo.user": req.user.id,
            status,
            visibility
        });

        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching user posts by state and visibility:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//Cập nhật bài đăng
exports.updatePost = async (req, res) => { 
    const { postId } = req.params;
    let updateData = req.body;
    
    updateData.status = "update";
    updateData.visibility = "hidden";
  
    try {
      const updatedPost = await Post.findByIdAndUpdate(postId, updateData, { new: true });
      if (!updatedPost) {
        return res.status(404).json({ message: 'Bài đăng không tồn tại' });
      }
      res.json(updatedPost);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  };  

exports.toggleVisibility = async (req, res) => {
    const { postId } = req.params;
  
    try {
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Bài đăng không tồn tại' });
      }
      post.visibility = post.visibility === 'visible' ? 'hiden' : 'visible';
      await post.save();
  
      res.json({ message: 'Trạng thái hiển thị đã được cập nhật', visibility: post.visibility });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  };
  
//Lấy post của admin theo trạng thái có phân trang
exports.getUserPostAd = async (req, res) => {
    try {
        const { status, visibility, page = 1, limit = 10 } = req.query;

        if (!status || !visibility) {
            return res.status(400).json({ message: "State and visibility are required" });
        }
        const startIndex = (page - 1) * limit; 
        const total = await Post.countDocuments({
            "contactInfo.user": req.user.id,
            status,
            visibility,
        });

        const posts = await Post.find({
            "contactInfo.user": req.user.id,
            status,
            visibility,
        })
        .skip(startIndex)
        .limit(parseInt(limit))
        .exec();

        res.status(200).json({
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            posts,
        });
    } catch (error) {
        console.error("Error fetching user posts by state and visibility:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//Duyệt bài viết của admin
exports.approvePost = async (req, res) => {
    try {
      const postId = req.params.id;
      const post = await Post.findByIdAndUpdate(
        postId,
        { status: 'approved', visibility: 'visible' }, 
        { new: true } 
      );
  
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      res.status(200).json({ message: 'Post approved successfully', post });
    } catch (error) {
      res.status(500).json({ message: 'Error approving post', error: error.message });
    }
  };

  //Từ chối bài viết
  exports.rejectPost = async (req, res) => {
    try {
      const postId = req.params.id; 
      const post = await Post.findByIdAndUpdate(
        postId,
        { status: 'rejected', visibility: 'hiden' },
        { new: true } 
      );
  
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      res.status(200).json({ message: 'Post rejected successfully', post });
    } catch (error) {
      res.status(500).json({ message: 'Error rejecting post', error: error.message });
    }
  };