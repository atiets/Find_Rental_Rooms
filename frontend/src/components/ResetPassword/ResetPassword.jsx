import { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './ResetPassword.css';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { token } = useParams(); // Lấy token từ URL
    const navigate = useNavigate();

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!newPassword || !confirmPassword) {
            setError('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp!');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:8000/v1/auth/reset-password`, {
                token,
                newPassword,
            });
            setMessage(response.data); // Hiển thị thông báo thành công
            setTimeout(() => navigate('/login'), 2000); // Điều hướng về trang login sau 2 giây
        } catch (err) {
            setError(err.response?.data || 'Có lỗi xảy ra!');
        }
    };

    return (
        <div className="reset-password-container">
            <h2>Đặt lại mật khẩu</h2>
            <form onSubmit={handleResetPassword}>
                <div className="input-group">
                    <label>Mật khẩu mới:</label>
                    <input 
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Nhập mật khẩu mới"
                    />
                </div>
                <div className="input-group">
                    <label>Xác nhận mật khẩu:</label>
                    <input 
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Xác nhận mật khẩu"
                    />
                </div>
                <button type="submit">Đặt lại mật khẩu</button>
            </form>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default ResetPassword;