import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, googleLogin } from "../../redux/apiRequest";
import { GoogleLogin } from "@react-oauth/google";
import "./Login.css";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Lấy trạng thái người dùng hiện tại từ Redux store
    const currentUser = useSelector((state) => state.auth.login.currentUser);

    useEffect(() => {
        // Kiểm tra nếu currentUser không null trước khi kiểm tra thuộc tính admin
        if (currentUser) {
            if (currentUser.admin === true) {
                navigate("/admin-dashboard"); // Chuyển hướng đến trang dành cho admin
            } else {
                navigate("/"); // Chuyển hướng đến trang chủ cho người dùng thông thường
            }
        }
    }, [currentUser, navigate]);
    
    const handleLogin = (e) => {
        e.preventDefault();
        const newUser = {
            username: username,
            password: password,
        };
        loginUser(newUser, dispatch, navigate);
    };

    const handleGoogleLogin = (response) => {
        if (response.error) {
            console.log("Lỗi đăng nhập Google:", response.error);
        } else {
            const { credential } = response;
            console.log("Credential từ Google:", credential);
            
            // Gọi googleLogin từ apiRequest để xác thực với backend
            googleLogin(credential, dispatch, navigate)
                .then(() => console.log("Đăng nhập Google thành công"))
                .catch((err) => console.error("Lỗi khi đăng nhập Google:", err));
        }
    };

    return ( 
        <section className="login-container">
            <div className="login-title"> Đăng nhập</div>
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label>Tên đăng nhập:</label>
                    <div className="input-container">
                        <input 
                            type="text" 
                            placeholder="Nhập tên đăng nhập" 
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label>Mật khẩu:</label>
                    <div className="input-container">
                        <input 
                            type="password" 
                            placeholder="Nhập mật khẩu" 
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>
                <div><button type="submit"> Đăng nhập </button></div>
                <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() => console.log("Lỗi đăng nhập Google")}
                />
            </form>
            <div className="login-register"> Don't have an account yet? </div>
            <Link className="login-register-link" to="/register">Register one for free </Link>
        </section>
    );
};

export default Login;