import { useState } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../../redux/apiRequest";

const Register = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const handleRegister = (e) => {
        e.preventDefault();
        const newUser = {
            email: email,
            username: username,
            password: password,
        };
        registerUser(newUser, dispatch, navigate);
    };

    return ( 
        <section className="register-container">
            <div className="register-title">Đăng ký</div>
            <form onSubmit={handleRegister}>
                <div className="form-group">
                    <label>Email</label>
                    <div className="input-container">
                        <input 
                            type="text" 
                            placeholder="Nhập email của bạn" 
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label>Tên người dùng</label>
                    <div className="input-container">
                        <input 
                            type="text" 
                            placeholder="Nhập tên người dùng" 
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label>Mật khẩu</label>
                    <div className="input-container">
                        <input 
                            type="password" 
                            placeholder="Nhập mật khẩu" 
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>
                <button type="submit">Tạo tài khoản</button>
            </form>
            <div className="register-login">
                Đã có tài khoản? 
                <Link className="register-login-link" to="/login"> Đăng nhập </Link>
            </div>
        </section>
    );
}

export default Register;