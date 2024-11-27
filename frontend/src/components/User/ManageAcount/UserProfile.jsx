import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import "./UserProfile.css";

const UserProfile = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        profile: {
            name: "",
            phone: "",
            address: "",
        },
    });
    const [errors, setErrors] = useState({});
    const [editMode, setEditMode] = useState(false);

    const accessToken = useSelector(
        (state) => state.auth?.login?.currentUser?.accessToken
    );

    useEffect(() => {
        const fetchData = async () => {
            if (!accessToken) return; // Nếu không có accessToken, dừng thực hiện API
            try {
                const response = await axios.get("http://localhost:8000/v1/auth/info", {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                setFormData(response.data);
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };
        fetchData();
    }, [accessToken]);

    const validate = () => {
        let tempErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/;

        if (!emailRegex.test(formData.email)) {
            tempErrors.email = "Email không đúng định dạng.";
        }

        if (!phoneRegex.test(formData.profile.phone)) {
            tempErrors.phone = "Số điện thoại không hợp lệ.";
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (["name", "phone", "address"].includes(name)) {
            setFormData((prev) => ({
                ...prev,
                profile: {
                    ...prev.profile,
                    [name]: value,
                },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = async () => {
        if (validate()) {
            try {
                await axios.put(
                    "http://localhost:8000/v1/auth/update",
                    formData,
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                );
                setEditMode(false);
            } catch (error) {
                console.error("Error updating user info:", error);
            }
        }
    };

    if (!accessToken) {
        return <p>Vui lòng đăng nhập để xem thông tin cá nhân.</p>;
    }

    return (
        <div className="user-profile">
            <h2>Thông tin cá nhân</h2>
            <p>Xem và cập nhật thông tin tài khoản của bạn</p>
            <form className="profile-form">
                <div className="form-group">
                    <label>Tên đăng nhập</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled
                    />
                    {errors.email && <span className="error">{errors.email}</span>}
                </div>
                <div className="form-group">
                    <label>Họ và tên</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.profile.name}
                        onChange={handleInputChange}
                        disabled={!editMode}
                    />
                </div>
                <div className="form-group">
                    <label>Số điện thoại</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.profile.phone}
                        onChange={handleInputChange}
                        disabled={!editMode}
                    />
                    {errors.phone && <span className="error">{errors.phone}</span>}
                </div>
                <div className="form-group">
                    <label>Địa chỉ</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.profile.address}
                        onChange={handleInputChange}
                        disabled={!editMode}
                    />
                </div>
                <div className="form-actions">
                    {editMode ? (
                        <>
                            <button type="button" onClick={handleSave}>
                                Lưu
                            </button>
                            <button type="button" onClick={() => setEditMode(false)}>
                                Hủy
                            </button>
                        </>
                    ) : (
                        <button type="button" onClick={() => setEditMode(true)}>
                            Chỉnh sửa
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default UserProfile;
