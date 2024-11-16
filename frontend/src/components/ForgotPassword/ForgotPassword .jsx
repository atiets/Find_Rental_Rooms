import { useState } from 'react';
import axios from 'axios'; // Sử dụng axios để gọi API
import './ForgotPassword.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!email) {
            setError('Vui lòng nhập email!');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:8000/v1/auth/forgot-password`, { email });
            setMessage(response.data); // Hiển thị thông báo thành công từ backend
        } catch (err) {
            setError(err.response?.data || 'Có lỗi xảy ra!');
        }
    };

    return (
        <div className="forgot-password-container">
            <h2>Quên mật khẩu</h2>
            <form onSubmit={handleForgotPassword}>
                <div className="input-group">
                    <label>Email:</label>
                    <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Nhập email của bạn"
                    />
                </div>
                <button type="submit">Gửi yêu cầu</button>
            </form>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default ForgotPassword;