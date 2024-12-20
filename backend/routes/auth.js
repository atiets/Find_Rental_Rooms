const { upload, authController } = require("../controllers/authControllers");
const middlewareControllers = require("../controllers/middlewareControllers");
const router = require("express").Router();



//register
router.post("/register", authController.registerUser);

//login
router.post("/login", authController.loginUser);

//refresh
router.post("/refresh", authController.requestRefreshToken);

//logout
router.post("/logout", middlewareControllers.verifyToken, authController.userLogout);

//login with gg
router.post("/google", authController.googleLogin);

// forgot password
router.post("/forgot-password", authController.forgotPassword);

//reset password
router.post("/reset-password", authController.resetPassword);
// Xem thông tin người dùng
router.get("/info", middlewareControllers.verifyToken, authController.getUserInfo);

// Chỉnh sửa thông tin người dùng
router.put("/update", middlewareControllers.verifyToken, authController.updateUserInfo, upload.single('picture'));


module.exports = router;