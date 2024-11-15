const postController = require("../controllers/postControllers");
const uploadCloud = require('../congfig/cloudinaryConfig'); 
const middlewareControllers = require("../controllers/middlewareControllers");
const router = require("express").Router();

// Lấy tất cả bài đăng
router.get("/posts",middlewareControllers.verifyTokenAndAdminAuth, postController.getAllPosts);
// Lấy bài đăng theo ID
router.get("/posts/:id", postController.getPostById);
// Tạo bài đăng mới (cần xác thực)
router.post("/", middlewareControllers.verifyToken, uploadCloud.array('images', 5), postController.createPost);

router.put("/posts/:id", middlewareControllers.verifyToken, postController.updatePost);
// Xóa bài đăng (cần xác thực)
router.delete("/posts/:id", middlewareControllers.verifyTokenAndAdminAuth, postController.deletePost);
//Lấy bài đăng theo status
router.get('/posts-by-status', postController.getPostsByStatus);
router.get('/list-post-pending',middlewareControllers.verifyToken, postController.getUserPostsByStateAndVisibility);
// Route cập nhật bài đăng
router.put('/update/:postId',middlewareControllers.verifyToken, postController.updatePost);
// Route ẩn/hiện bài đăng
router.put('/toggle-visibility/:postId',middlewareControllers.verifyToken, postController.toggleVisibility);

module.exports = router;