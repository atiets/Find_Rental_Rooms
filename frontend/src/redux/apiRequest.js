import axios from "axios";
import { loginFailed, loginStart, loginSuccess, logoutFailed, logoutStart, logoutSuccess, registerFailed, registerStart, registerSuccess } from "./authSlice";
import { deleteUserFailed, deleteUserStart, deleteUserSuccess, getUsersFailed, getUsersSuccess, getUserStart } from "./userSlice";
import { googleLoginStart, googleLoginSuccess, googleLoginFailed, forgotPasswordSuccess, forgotPasswordFailed } from "./authSlice"; // Nếu bạn muốn tạo slice cho Google Login
import { toast } from "react-toastify";

export const loginUser = async (user, dispatch, navigate, setErrorMessage) => {
    axios.defaults.baseURL = 'http://localhost:8000';
    dispatch(loginStart());
  
    try {
      const res = await axios.post("/v1/auth/login", user);
      const userData = res.data;
  
      dispatch(loginSuccess(userData));
  
      // Redirect user based on their role
      if (userData.admin === true) {
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      // Check if the error has a response from the server
      if (err.response) {
        console.error("Login Error:", err.response.data);
  
        // Handle specific error codes from the server
        if (err.response.status === 404) {
          setErrorMessage("Tên đăng nhập không đúng!");
        } else if (err.response.status === 401) {
          setErrorMessage("Mật khẩu không đúng!");
        } else if (err.response.status === 403) {
          toast.error("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ.");
        } else {
          setErrorMessage(err.response.data.message || "Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.");
        }
      } else if (err.request) {
        console.error("Network error or no response from the server:", err.message);
        setErrorMessage("Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.");
      } else {
        // Handle other unexpected errors
        console.error("Other error:", err.message);
        setErrorMessage("Đã xảy ra lỗi không xác định. Vui lòng thử lại.");
      }
  
      dispatch(loginFailed());
    }
  };  

  export const registerUser = async (user, dispatch, navigate, setErrorMessage) => {
    axios.defaults.baseURL = 'http://localhost:8000';
    dispatch(registerStart());
    
    try {
      const res = await axios.post("/v1/auth/register", user);
      dispatch(registerSuccess(res.data));
      navigate("/login");
    } catch (err) {
      if (err.response) {
        console.error("Register error:", err.response.data);
        
        // Kiểm tra lỗi trả về từ server và hiển thị thông báo tương ứng
        const errorMessage = err.response.data.message || "Đăng ký thất bại!";
        
        // Nếu lỗi là trùng email hoặc trùng tên, hiển thị thông báo cụ thể
        if (err.response.data.message.includes("Email đã tồn tại")) {
          setErrorMessage("Email đã tồn tại. Vui lòng chọn email khác.");
        } else if (err.response.data.message.includes("Tên người dùng đã tồn tại")) {
          setErrorMessage("Tên người dùng đã tồn tại. Vui lòng chọn tên khác.");
        } else {
          setErrorMessage(errorMessage);
        }
      } else {
        console.error("Register error:", err.message);
        setErrorMessage("Có lỗi xảy ra. Vui lòng thử lại.");
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

export const resetPasswordRequest = async (userEmail, dispatch, setMessage, navigate) => {
    axios.defaults.baseURL = 'http://localhost:8000'; // Địa chỉ API backend
    try {
        const res = await axios.post("/v1/auth/forgot-password", userEmail);
        dispatch(forgotPasswordSuccess());
        setMessage('Đường dẫn đặt lại mật khẩu đã được gửi đến email của bạn.');
        navigate("/login");  // Chuyển về màn hình login sau khi yêu cầu thành công
    } catch (err) {
        console.error("Forgot password error:", err.response || err.message);
        setMessage("Đã xảy ra lỗi, vui lòng thử lại.");
        dispatch(forgotPasswordFailed());
    }
};

export const resetPassword = async (passwordData, dispatch, setMessage, navigate) => {
    axios.defaults.baseURL = 'http://localhost:8000';
    try {
        const res = await axios.post("/v1/auth/reset-password", passwordData);
        setMessage('Mật khẩu đã được thay đổi thành công.');
        navigate("/login");  // Sau khi đặt lại mật khẩu thành công, chuyển hướng về login
    } catch (err) {
        console.error("Reset password error:", err.response || err.message);
        setMessage("Đã xảy ra lỗi, vui lòng thử lại.");
    }
};