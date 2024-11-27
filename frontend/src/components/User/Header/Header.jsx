import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createAxios } from '../../../createInstance';
import { logout } from '../../../redux/apiRequest';
import { logoutSuccess } from '../../../redux/authSlice';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const currentUser = useSelector((state) => state.auth.login.currentUser);
    const dispatch = useDispatch();
    const accessToken = currentUser?.accessToken;
    const id = currentUser?._id;
    const [propertyType, setPropertyType] = useState('');
    const axiosJWT = createAxios(currentUser, dispatch, logoutSuccess);

    const handleLogout = () => {
        logout(dispatch, id, navigate, accessToken, axiosJWT);
    };

    const handleDropdownToggle = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleAddPost = () => {
        if (!currentUser) {
            alert('Bạn cần đăng nhập để đăng tin mới.');
            navigate('/login');
        } else {
            navigate('/AddPost');
        }
    };

    return (
        <header className="header">
            <div className="header-container">
                <h1 className="header-title" onClick={() => navigate('/')}>PhongTroXinh.com</h1>
                <nav className="header-nav">
                    <button onClick={() => navigate('/')} className="nav-button">Trang Chủ</button>
                    <button onClick={handleAddPost} className="nav-button">Đăng Tin Mới</button>
                    <div className="user-dropdown">
                        <button onClick={handleDropdownToggle} className="nav-button">
                            {currentUser ? `Hi, ${currentUser.username}` : 'Tài khoản'}
                        </button>
                        {dropdownOpen && (
                            <div className="dropdown-menu">
                                {!currentUser ? (
                                    <>
                                        <button onClick={() => { navigate('/login'); setDropdownOpen(false); }} className="dropdown-item">Đăng Nhập</button>
                                        <button onClick={() => { navigate('/register'); setDropdownOpen(false); }} className="dropdown-item">Đăng Ký</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => { navigate('/managerAc'); setDropdownOpen(false); }} className="dropdown-item">Tài Khoản</button>
                                        <button onClick={handleLogout} className="dropdown-item">Đăng Xuất</button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;
