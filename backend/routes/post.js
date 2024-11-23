const postController = require("../controllers/postControllers");
const uploadCloud = require('../congfig/cloudinaryConfig'); 
const middlewareControllers = require("../controllers/middlewareControllers");
const router = require("express").Router();

// Lấy tất cả bài đăng
router.get("/posts",middlewareControllers.verifyTokenAndAdminAuth, postController.getAllPosts);
//Lấy bài đăng theo trạng thái của admin
router.get("/list-pending",middlewareControllers.verifyTokenAndAdminAuth, postController.getUserPostAd);
// Lấy bài đăng theo ID
router.get("/posts/:id", postController.getPostById);
// Tạo bài đăng mới (cần xác thực)
router.post("/", middlewareControllers.verifyToken, uploadCloud.array('images', 5), postController.createPost);
router.put("/posts/:id", middlewareControllers.verifyToken, postController.updatePost);
// Xóa bài đăng (cần xác thực)
router.delete("/posts/:id", middlewareControllers.verifyToken, postController.deletePost);
//Lấy bài đăng theo status
router.get('/posts-by-status', postController.getPostsByStatus);
//Lấy bài đăng của bản thân quản lý bài đăng user
router.get('/list-post-pending',middlewareControllers.verifyToken, postController.getUserPostsByStateAndVisibility);
//Lấy bài đăng của người dùng quản lý bài đăng admin
router.get('/user-posts/:userId', middlewareControllers.verifyTokenAndAdminAuth, postController.getUserPostsByUserId);
router.put('/update/:postId',middlewareControllers.verifyToken, postController.updatePost);
// Route ẩn/hiện bài đăng
router.put('/toggle-visibility/:postId',middlewareControllers.verifyToken, postController.toggleVisibility);
// Route cho duyệt bài
router.put('/:id/approve', middlewareControllers.verifyTokenAndAdminAuth, postController.approvePost);
// Route cho từ chối bài
router.put('/:id/reject', middlewareControllers.verifyTokenAndAdminAuth, postController.rejectPost);
module.exports = router;