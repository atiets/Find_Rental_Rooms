const Post = require('../models/Post');
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');

exports.createPost = async (req, res) => {
    try {
        const { title, content, address, category, rentalPrice, area, rentalTarget, maxOccupants, youtubeLink, contactInfo } = req.body;

        // Nếu có ảnh được upload lên, lấy đường dẫn của ảnh
        const imageUrls = [];
        if (req.files && req.files.length > 0) {
            // Lấy đường dẫn ảnh từ Cloudinary
            req.files.forEach(file => {
                imageUrls.push(file.path); // Lưu đường dẫn ảnh
            });
        }

        // Tạo post mới
        const newPost = new Post({
            title,
            content,
            address: JSON.parse(address),  // Giả sử bạn gửi dữ liệu dưới dạng string JSON từ frontend
            category,
            rentalPrice,
            area,
            rentalTarget,
            maxOccupants,
            youtubeLink,
            contactInfo: JSON.parse(contactInfo),
            images: imageUrls,  // Lưu đường dẫn ảnh từ Cloudinary
        });

        // Lưu bài viết vào MongoDB
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);  // Trả về bài viết vừa tạo
    } catch (error) {
        console.error("Error creating post:", error);  // Log chi tiết lỗi
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Lấy tất cả bài đăng
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts); // Trả về mã trạng thái 200
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy bài đăng theo ID
exports.getPostById = async (req, res) => {
    try {
        console.log("Request ID:", req.params.id); // Kiểm tra ID trong request
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

        Object.assign(post, req.body); // Cập nhật các trường bài đăng
        const updatedPost = await post.save();
        res.status(200).json(updatedPost); // Trả về mã trạng thái 200 khi cập nhật thành công
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Xóa bài đăng
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Bài đăng không tồn tại.' });
        }

        await post.remove();
        res.status(204).send(); // Trả về mã trạng thái 204 No Content khi xóa thành công
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Hàm để lấy bài viết theo trạng thái
exports.getPostsByStatus = async (req, res) => {
    try {
        const { status } = req.query; // Lấy trạng thái từ query parameter
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
    const updateData = req.body;

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

//Ẩn bài đăng
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

