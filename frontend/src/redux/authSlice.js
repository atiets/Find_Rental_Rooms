import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from 'jwt-decode';

const authSlice = createSlice({
    name: "auth",
    initialState: {
        login: {
            currentUser: null,
            isFetching: false,
            error: false
        },
        register: {
            isFetching: false,
            error: false,
            success: false
        },
        logout: {
            isFetching: false,
            error: false
        }
    },
    reducers: {
        loginStart: (state) => {
            state.login.isFetching = true;
        },
        loginSuccess: (state, action) => {
            state.login.isFetching = false;
            state.login.currentUser = action.payload;
            state.login.error = false;
        },
        loginFailed: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        },

        registerStart: (state) => {
            state.register.isFetching = true;
        },
        registerSuccess: (state, action) => {
            state.register.isFetching = false;
            state.register.error = false;
            state.register.success = true;
        },
        registerFailed: (state) => {
            state.register.isFetching = false;
            state.register.error = true;
            state.register.success = false;
        },

        logoutStart: (state) => {
            state.login.isFetching = true;
        },
        logoutSuccess: (state, action) => {
            state.login.isFetching = false;
            state.login.currentUser = null;
            state.login.error = false;
        },
        logoutFailed: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        },

        googleLoginStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        // googleLoginSuccess: (state, action) => {
        //     state.login.isFetching = false;
        //     state.login.currentUser = action.payload; 
        //     state.login.error = false;
        // },
        googleLoginSuccess: (state, action) => {
            state.login.isFetching = false;

            const { credential, accessToken } = action.payload; // Lấy credential và accessToken từ action payload

            // Kiểm tra nếu credential không phải là chuỗi hợp lệ
            if (!credential || typeof credential !== 'string') {
                console.error("Credential không hợp lệ:", credential);
                state.login.error = true;
                return;
            }

            try {
                // Giải mã token (ví dụ: JWT)
                console.log("Credential từ Google:", credential);
                const decodedToken = jwtDecode(credential);

                // Kiểm tra token có hợp lệ không
                if (!decodedToken || !decodedToken.sub || !decodedToken.email) {
                    console.error("Token không chứa thông tin người dùng hợp lệ");
                    state.login.error = true;
                    return;
                }

                // Lưu thông tin người dùng vào Redux
                state.login.currentUser = {
                    _id: decodedToken.sub,  // ID của người dùng từ Google
                    username: decodedToken.name || decodedToken.given_name || "Google User",  // Tên người dùng
                    email: decodedToken.email,  // Email người dùng
                    profile: { picture: decodedToken.picture },  // Lưu ảnh đại diện
                    admin: false,  // Mặc định không phải admin
                    accessToken,  // Lưu accessToken từ backend
                    googleCredential: credential, // Lưu credential của Google
                    createdAt: new Date(decodedToken.iat * 1000).toISOString(), // Thời gian tạo người dùng
                    updatedAt: new Date().toISOString(),
                    __v: 0  // Mặc định là 0
                };
                console.log("Current User in Redux:", state.login.currentUser);
                state.login.error = false;
            } catch (error) {
                console.error("Lỗi khi giải mã token:", error);
                state.login.error = true;
            }
        },
        googleLoginFailed: (state) => {
            state.isFetching = false;
            state.error = true;
        },

        forgotPasswordStart: (state) => {
            state.forgotPassword.isFetching = true;
        },
        forgotPasswordSuccess: (state) => {
            state.forgotPassword.isFetching = false;
            state.forgotPassword.success = true;
            state.forgotPassword.error = false;
        },
        forgotPasswordFailed: (state) => {
            state.forgotPassword.isFetching = false;
            state.forgotPassword.error = true;
        },
        updateProfilePicture: (state, action) => {
            if (state.login.currentUser) {
                state.login.currentUser.profile.picture = action.payload;
            } else {
                console.error("Không có người dùng nào đăng nhập để cập nhật ảnh.");
            }
        },
    }
});

export const {
    loginStart,
    loginFailed,
    loginSuccess,
    registerStart,
    registerSuccess,
    registerFailed,
    logoutStart,
    logoutSuccess,
    logoutFailed,
    googleLoginStart,
    googleLoginSuccess,
    googleLoginFailed,
    forgotPasswordStart,
    forgotPasswordSuccess,
    forgotPasswordFailed,
    updateProfilePicture
} = authSlice.actions;

export default authSlice.reducer;