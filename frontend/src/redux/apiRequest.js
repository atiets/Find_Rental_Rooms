import axios from "axios";
import { loginFailed, loginStart, loginSuccess, logoutFailed, logoutStart, logoutSuccess, registerFailed, registerStart, registerSuccess } from "./authSlice";
import { deleteUserFailed, deleteUserStart, deleteUserSuccess, getUsersFailed, getUsersSuccess, getUserStart } from "./userSlice";
import { googleLoginStart, googleLoginSuccess, googleLoginFailed } from "./authSlice"; // Nếu bạn muốn tạo slice cho Google Login


export const loginUser = async(user, dispatch, navigate) =>{
    axios.defaults.baseURL = 'http://localhost:8000';
    dispatch(loginStart());
    try{
        const res = await axios.post("/v1/auth/login", user);
        const userData = res.data; 

        dispatch(loginSuccess(userData));

        // Kiểm tra username để điều hướng
        if (userData.admin === true) {
            navigate("/admin-dashboard");
        } else {
            navigate("/");
        }
    }catch(err){
        if (err.response) {
            console.error("Login error:", err.response.data);
            const errorMessage = err.response.data.message || "Login failed"; 
            console.error("Error message:", errorMessage);
        } else {
            console.error("Login error:", err.message);
        }
        dispatch(loginFailed());
    }
};

export const registerUser = async(user, dispatch, navigate) =>{
    axios.defaults.baseURL = 'http://localhost:8000';
    dispatch(registerStart());
    try{
        const res = await axios.post("/v1/auth/register", user);
        dispatch(registerSuccess((await res).data));
        navigate("/login");
    }catch(err){
        if (err.response) {
        console.error("Register error:", err.response.data);
        // Optionally, you can access a specific error message if it exists
        const errorMessage = err.response.data.message || "Register failed"; 
        console.error("Error message:", errorMessage);
    } else {
        console.error("Register error:", err.message);
    }
    dispatch(registerFailed());
    }
};

export const getAllUsers = async (accessToken, dispatch, axiosJWT) => {
    console.log("Access Token:", accessToken);
    dispatch(getUserStart());
    try {
        const res = await axiosJWT.get("/v1/user", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        dispatch(getUsersSuccess(res.data));
    } catch (err) {
        if (err.response) {
            const errorMessage = err.response.data.message || "Get users failed";
            console.error("Get users error:", errorMessage);
            console.log("Error Details:", err.response);
        } else {
            console.error("Get users error:", err.message);
            console.log("Error Details:", err);
        }
        dispatch(getUsersFailed());
    }
};

export const deleteUser = async (userId, accessToken, dispatch) => {
    axios.defaults.baseURL = 'http://localhost:8000';
    dispatch(deleteUserStart());
    try {
        await axios.delete(`/v1/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        dispatch(deleteUserSuccess(userId)); 
    } catch (err) {
        if (err.response) {
            console.error("Delete user error:", err.response.data);
            const errorMessage = err.response.data.message || "Delete user failed"; 
            console.error("Error message:", errorMessage);
        } else {
            console.error("Delete user error:", err.message);
        }
        dispatch(deleteUserFailed()); 
    }
};    


export const logout = async (dispatch, id, navigate, accessToken, axiosJWT) => {
    axiosJWT.defaults.baseURL = 'http://localhost:8000';
    dispatch(logoutStart());
    try {
        const res = await axiosJWT.post("/v1/auth/logout", { id }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        dispatch(logoutSuccess(res.data)); 
        navigate("/"); 
    } catch (err) {
        if (err.response) {
            console.error("Logout error:", {
                message: err.response.data.message || "Logout failed",
                statusCode: err.response.status,
                statusText: err.response.statusText,
                headers: err.response.headers,
                data: err.response.data,
            });
        } else {
            console.error("Logout error:", {
                message: err.message,
                stack: err.stack,
            });
        }
        dispatch(logoutFailed()); 
    }
};


export const googleLogin = async (tokenId, dispatch, navigate) => {
    axios.defaults.baseURL = 'http://localhost:8000';
    dispatch(googleLoginStart());
    try {
        // Gửi tokenId của Google đến backend để xác minh
        const res = await axios.post("/v1/auth/google", { tokenId });
        const userData = res.data;

        // Kiểm tra xem backend trả về thông tin người dùng hợp lệ và accessToken
        if (userData && userData.accessToken) {
            // Lưu thông tin người dùng và accessToken vào Redux (payload là credential)
            dispatch(googleLoginSuccess({
                credential: tokenId,  // Lưu credential (tokenId của Google) vào Redux
                accessToken: userData.accessToken, 
            }));
            navigate("/"); // Chuyển hướng người dùng về trang chủ
        } else {
            throw new Error("Không có accessToken trong phản hồi từ backend");
        }
    } catch (err) {
        if (err.response) {
            console.error("Google login error:", err.response.data);
            const errorMessage = err.response.data.message || "Google login failed";
            console.error("Error message:", errorMessage);
        } else {
            console.error("Google login error:", err.message);
        }
        dispatch(googleLoginFailed()); // Gọi action thất bại nếu có lỗi
    }
};