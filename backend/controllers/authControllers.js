const bcrypt = require("bcrypt"); //hash pass
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { use } = require("../routes/user");
const { OAuth2Client } = require ('google-auth-library');

let refreshTokens = [];
const client_id = '542714924408-kun6tfccnlcit4k9ono82oue7vqhth70.apps.googleusercontent.com';

const client = new OAuth2Client(client_id);

const authController = {
    //REGISTER
    registerUser: async(req, res) => {
        try{
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            const newUser = await new User({
                username: req.body.username,
                email: req.body.email,
                password: hashed,
            });

            const user = await newUser.save();
            res.status(200).json(user);
        }catch(err){
            // res.status(200).json(err);
            console.error("Error details: ", err); 
            res.status(500).json({ error: "An error occurred", details: err.message });
        }
    },

    //generate access token
    generateAccessToken: (user) =>{
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
    generateRefreshToken: (user) =>{
        return jwt.sign(
            {
                id: user.id,
                admin: user.admin,
            },
            process.env.JWT_REFRESH_KEY,
            { expiresIn: "1000d" }
        );
    },

    //LOGIN
    loginUser: async (req, res) => {
        try {
            const user = await User.findOne({ username: req.body.username });
            if (!user) {
                return res.status(404).json("Wrong username!");
            }
            
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) {
                return res.status(404).json("Wrong password!");
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
            res.status(500).json({ error: "An error occurred", details: err.message });
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

    userLogout: async(req, res) => {
        res.clearCookie("refreshToken");
        refreshTokens = refreshTokens.filter(token  => token !== req.cookies.refreshToken);
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
            res.status(500).json({ error: "Google authentication failed", error});
        }
    },

};

//store token:
// C1: local storage -> dễ bị tấn công: xss
// C2: HTTPONLY cookies -> csrf -> khắc phục: SAMESITE
// C3: redux store -> access token
//     httponly cookies -> refreshToken


module.exports = authController;