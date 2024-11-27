const bcrypt = require("bcrypt"); //hash pass
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { use } = require("../routes/user");
const { OAuth2Client } = require('google-auth-library');
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");

let refreshTokens = [];
const client_id = '542714924408-kun6tfccnlcit4k9ono82oue7vqhth70.apps.googleusercontent.com';

const client = new OAuth2Client(client_id);


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");  // Lưu ảnh vào thư mục 'uploads'
    },
    filename: (req, file, cb) => {
        // Đặt tên file là ID của người dùng + thời gian + đuôi mở rộng của file
        cb(null, req.user.id + "-" + Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn kích thước file tối đa là 5MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error("Chỉ chấp nhận ảnh JPEG, PNG hoặc GIF!"));
        }
    },
});
const authController = {
    //REGISTER
    registerUser: async (req, res) => {
        try {
            const existingUserByEmail = await User.findOne({ email: req.body.email });
            const existingUserByUsername = await User.findOne({ username: req.body.username });

            if (existingUserByEmail) {
                return res.status(400).json({ message: "Email đã tồn tại!" });
            }

            if (existingUserByUsername) {
                return res.status(400).json({ message: "Tên người dùng đã tồn tại!" });
            }

            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: hashed,
            });

            const user = await newUser.save();
            res.status(200).json(user);

        } catch (err) {
            console.error("Error details: ", err);
            res.status(500).json({ error: "An error occurred", details: err.message });
        }
    },

    //generate access token
    generateAccessToken: (user) => {
        return jwt.sign(
            {
                id: user.id,
                admin: user.admin,
            },
            process.env.JWT_ACCESS_KEY,
            { expiresIn: "30d" }
        );
    },

    //generate refresh token
    generateRefreshToken: (user) => {
        return jwt.sign(
            {
                id: user.id,
                admin: user.admin,
            },
            process.env.JWT_REFRESH_KEY,
            { expiresIn: "365d" }
        );
    },

    //LOGIN
    loginUser: async (req, res) => {
        const client_id = '542714924408-kun6tfccnlcit4k9ono82oue7vqhth70.apps.googleusercontent.com';
        try {
            const user = await User.findOne({ username: req.body.username });
            if (!user) {
                return res.status(404).json("Tên đăng nhập không đúng!");
            }

            if (user.profile && user.profile.isBlocked) {
                return res.status(403).json("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ.");
            }

            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) {
                return res.status(40).json("Mật khẩu không đúng!");
            }

            // Nếu người dùng hợp lệ
            const accessToken = authController.generateAccessToken(user);
            const newRefreshToken = authController.generateRefreshToken(user);
            refreshTokens.push(newRefreshToken); // Sử dụng refreshTokens ở đây

            // Lưu refresh vào cookies
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            });

            const { password, ...others } = user._doc;
            res.status(200).json({ ...others, accessToken });

        } catch (err) {
            console.error("Error details: ", err);
            res.status(500).json({ error: "Có lỗi xảy ra. Vui lòng thử lại sau.", details: err.message });
        }
    },

    requestRefreshToken: async (req, res) => {
        // Lấy refresh token từ cookies
        const refreshTokenFromCookies = req.cookies.refreshToken;
        if (!refreshTokenFromCookies) return res.status(401).json("You're not authenticated");
        if (!refreshTokens.includes(refreshTokenFromCookies)) {
            return res.status(403).json("Refresh token is not valid!");
        }

        jwt.verify(refreshTokenFromCookies, process.env.JWT_REFRESH_KEY, (err, user) => {
            if (err) {
                console.log(err);
                return res.status(403).json("Refresh token is not valid!");
            }

            // Xóa token cũ
            refreshTokens = refreshTokens.filter((token) => token !== refreshTokenFromCookies);
            // Tạo token mới
            const newAccessToken = authController.generateAccessToken(user);
            const newRefreshToken = authController.generateRefreshToken(user);
            refreshTokens.push(newRefreshToken);

            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            });
            res.status(200).json({ accessToken: newAccessToken });
        });
    },

    userLogout: async (req, res) => {
        res.clearCookie("refreshToken");
        refreshTokens = refreshTokens.filter(token => token !== req.cookies.refreshToken);
        res.status(200).json("Logged out successfully!")
    },

    //gg login
    googleLogin: async (req, res) => {
        const { tokenId } = req.body;  // Nhận token từ client
        console.log(tokenId)
        try {
            // Xác minh token với Google
            const ticket = await client.verifyIdToken({
                idToken: tokenId,
                audience: client_id,
            });
            const payload = ticket.getPayload();
            // Dùng email hoặc Google ID từ payload để tìm hoặc tạo tài khoản người dùng
            const user = await User.findOne({ email: payload.email });
            if (!user) {
                // Nếu người dùng chưa có trong database, tạo tài khoản mới
                const newUser = new User({
                    username: payload.name,
                    email: payload.email,
                    googleId: payload.sub,  // Lưu Google ID của người dùng
                });
                await newUser.save();
            }

            // Tạo Access Token để trả về cho client
            const accessToken = authController.generateAccessToken(user);
            res.status(200).json({ accessToken });

        } catch (error) {
            console.error("Google authentication error: ", error);
            res.status(500).json({ error: "Google authentication failed", error });
        }
    },

    //forgot pass
    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json("Email không tồn tại trong hệ thống!");
            }

            // Tạo token reset mật khẩu
            const resetToken = authController.generateAccessToken(user);

            // Cấu hình email để gửi mã reset mật khẩu
            const transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Đặt lại mật khẩu",
                text: `Vui lòng nhấp vào liên kết để đặt lại mật khẩu của bạn: 
                ${process.env.CLIENT_URL}/reset-password/${resetToken}`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("Gửi email thất bại:", error);
                    return res.status(500).json("Có lỗi xảy ra khi gửi email.");
                }
                console.log("Email sent: " + info.response);
                res.status(200).json("Email đặt lại mật khẩu đã được gửi!");
            });

        } catch (error) {
            console.error("Error details: ", error);
            res.status(500).json({ error: "An error occurred", details: error.message });
        }
    },
    //reset password
    resetPassword: async (req, res) => {
        try {
            const { token, newPassword } = req.body;

            // Xác thực token
            jwt.verify(token, process.env.JWT_ACCESS_KEY, async (err, user) => {
                if (err) return res.status(403).json("Token không hợp lệ hoặc đã hết hạn!");

                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(newPassword, salt);

                await User.findByIdAndUpdate(user.id, { password: hashedPassword });
                res.status(200).json("Mật khẩu đã được đặt lại thành công!");
            });
        } catch (error) {
            console.error("Error details: ", error);
            res.status(500).json({ error: "An error occurred", details: error.message });
        }
    },
    getUserInfo: async (req, res) => {
        try {
            // Lấy thông tin người dùng từ JWT token
            const userId = req.user.id;  // user.id được lấy từ JWT payload (đã giải mã)

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json("User not found");
            }

            const { password, ...others } = user._doc;  // Loại bỏ password từ kết quả trả về
            res.status(200).json(others);  // Trả về thông tin người dùng không có mật khẩu
        } catch (err) {
            console.error("Error details: ", err);
            res.status(500).json({ error: "An error occurred", details: err.message });
        }
    },

    // Chỉnh sửa thông tin người dùng
    updateUserInfo: async (req, res) => {
        try {
            const userId = req.user.id;  // user.id từ JWT payload (đã giải mã)

            // Kiểm tra xem người dùng có tồn tại không
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json("User not found");
            }

            // Lấy thông tin mới từ request body
            const { username, email, profile } = req.body;

            // Cập nhật thông tin người dùng
            if (username) user.username = username;
            if (email) user.email = email;

            // Nếu có dữ liệu profile trong body, cập nhật vào trường profile
            if (profile) {
                // Cập nhật thông tin profile
                if (profile.name) user.profile.name = profile.name;
                if (profile.phone) user.profile.phone = profile.phone;
                if (profile.address) user.profile.address = profile.address;

                // Nếu có ảnh mới được upload, lưu vào profile.picture
                if (req.file) {
                    user.profile.picture = req.file.path;  // Lưu đường dẫn ảnh vào trường picture
                    console.log("có ảnh")
                }
                else {
                    console.log(req.file)
                }
            }

            // Lưu lại thay đổi
            const updatedUser = await user.save();

            // Trả về thông tin người dùng đã cập nhật
            const { password, ...others } = updatedUser._doc;
            res.status(200).json(others);
        } catch (err) {
            console.error("Error details: ", err);
            res.status(500).json({ error: "An error occurred", details: err.message });
        }
    }
};

//store token:
// C1: local storage -> dễ bị tấn công: xss
// C2: HTTPONLY cookies -> csrf -> khắc phục: SAMESITE
// C3: redux store -> access token
//     httponly cookies -> refreshToken


module.exports = {
    upload,
    authController
};