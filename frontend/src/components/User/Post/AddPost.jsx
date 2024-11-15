import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { Box, Button, FormControl, FormHelperText, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { createPost } from '../../../redux/postAPI';
import './AddPost.css';
import CustomizedBreadcrumbs from './CustomizedBreadcrumbs';

const SelectWithLabel = ({ label, options, value, onChange }) => {
    return (
        <FormControl fullWidth variant="outlined">
            <InputLabel>{label}</InputLabel>
            <Select
                value={value || ''}
                onChange={(event) => {
                    const selected = options.find(option => option.code === event.target.value);
                    onChange(selected);
                }}
                label={label}
                size="small"
            >
                {options.map((option) => (
                    <MenuItem key={option.code} value={option.code}>
                        {option.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

const TextFieldWithoutLabel = ({ value, onChange, placeholder }) => {
    return (
        <TextField
            value={value}
            onChange={onChange}
            variant="outlined"
            size="small"
            placeholder={placeholder}
            fullWidth
            InputLabelProps={{
                style: { display: 'none' },
            }}
            inputProps={{
                style: { fontSize: '14px' },
            }}
        />
    );
};

const AddPost = () => {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);
    const [address, setAddress] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const currentUser = useSelector((state) => state.auth.login.currentUser);
    const accessToken = currentUser?.accessToken;
    const user = currentUser?._id;
    const [phone, setPhone] = useState('');
    const [rentalPrice, setRentalPrice] = useState('');
    const [currency, setCurrency] = useState('dong_thang');
    const [area, setArea] = useState('');
    const formattedArea = `${area}m²`;
    const [areaError, setAreaError] = useState(''); // Thêm state cho lỗi diện tích
    const [rentalTarget, setRentalTarget] = useState('');
    const [maxOccupants, setMaxOccupants] = useState('');
    const [maxOccupantsError, setMaxOccupantsError] = useState('');
    const [youtubeLink, setYoutubeLink] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const fullAddress = `${address} ${selectedWard ? selectedWard.name : ''} ${selectedDistrict ? selectedDistrict.name : ''} ${selectedProvince ? selectedProvince.name : ''}`;
    const [propertyType, setpropertyType] = useState('');
    const dispatch = useDispatch();
    const [error, setError] = useState(''); // Trạng thái cho thông báo lỗi

    const handleMaxOccupantsChange = (e) => {
        const value = e.target.value;
        const regex = /^[0-9]*$/; // Regex cho số nguyên không âm

        if (value === '' || regex.test(value)) {
            setMaxOccupants(value);
            setMaxOccupantsError('');
        } else {
            setMaxOccupantsError('Số lượng tối đa phải là số nguyên không âm');
        }
    };
    const handleRentalPriceChange = (e) => {
        const value = e.target.value;
        const regex = /^[0-9]*\.?[0-9]*$/; // Regex cho số thực không âm

        if (value === '' || regex.test(value)) {
            setRentalPrice(value);
            setError('');
        } else {
            setError('Giá cho thuê phải là số thực không âm');
        }
    };

    // Hàm xử lý thay đổi cho diện tích
    const handleAreaChange = (e) => {
        const value = e.target.value;
        const regex = /^[0-9]*\.?[0-9]*$/; // Regex cho số thực không âm

        if (value === '' || regex.test(value)) {
            setArea(value);
            setAreaError('');
        } else {
            setAreaError('Diện tích phải là số thực không âm');
        }
    };

    const handleCurrencyChange = (e) => {
        setCurrency(e.target.value);
    };

    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);

        // Kiểm tra số lượng ảnh
        if (selectedImages.length + files.length <= 8) {
            // Dùng Promise.all để đợi tất cả các file được đọc xong
            Promise.all(
                files.map(file => {
                    return new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            resolve({ file, preview: reader.result });
                        };
                        reader.onerror = reject; // Bắt lỗi nếu có vấn đề khi đọc file
                        reader.readAsDataURL(file); // Đọc file dưới dạng URL để hiển thị ảnh
                    });
                })
            )
                .then(newImages => {
                    // Cập nhật state với các hình ảnh đã chọn
                    setSelectedImages(prevImages => [
                        ...prevImages,
                        ...newImages // Thêm hình ảnh mới vào danh sách hiện tại
                    ]);
                })
                .catch(error => {
                    console.error('Error reading file:', error);
                    alert('Có lỗi khi tải ảnh lên.');
                });
        } else {
            alert('Bạn chỉ có thể tải lên tối đa 8 hình ảnh.');
        }
    };


    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await axios.get('https://provinces.open-api.vn/api/?depth=3');
                setProvinces(response.data);
            } catch (error) {
                console.error('Error fetching provinces:', error);
            }
        };

        fetchProvinces();
    }, []);

    const handleProvinceChange = (newValue) => {
        setSelectedProvince(newValue);
        setSelectedDistrict(null);
        setSelectedWard(null);
        setDistricts(newValue ? newValue.districts || [] : []);
        setWards([]);
    };

    const handleDistrictChange = (newValue) => {
        setSelectedDistrict(newValue);
        setSelectedWard(null);
        setWards(newValue ? newValue.wards || [] : []);
    };

    const handleWardChange = (newValue) => {
        setSelectedWard(newValue);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Định dạng giá trị rentalPrice
        const formattedRentalPrice = `${rentalPrice} ${currency === 'dong_thang' ? 'Triệu/tháng' : 'Triệu/m²/tháng'}`;

        const formData = new FormData();

        // Thêm các dữ liệu khác vào formData
        formData.append('address', JSON.stringify({
            exactaddress: address,
            province: selectedProvince ? selectedProvince.name : '',
            district: selectedDistrict ? selectedDistrict.name : '',
            ward: selectedWard ? selectedWard.name : '',
        }));
        formData.append('category', propertyType);
        formData.append('title', title);
        formData.append('content', content);
        formData.append('contactInfo', JSON.stringify({
            user: user,
            username: currentUser?.username,
            phoneNumber: phone,
        }));
        formData.append('rentalPrice', formattedRentalPrice);
        formData.append('area', formattedArea);
        formData.append('rentalTarget', rentalTarget);
        formData.append('maxOccupants', maxOccupants);
        formData.append('youtubeLink', youtubeLink);

        for (let image of selectedImages) {
            formData.append('images', image.file);
        }

        try {
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }

            const response = await createPost(formData, accessToken);
            alert('Đăng tin thành công');
            Navigate("/");
            console.log('Post added successfully:', response);
        } catch (err) {
            if (err.response) {
                console.error('Server error:', err.response.data);
            } else {
                console.error('Error adding post:', err.message);
            }
        }
    };


    return (
        <div>
            <Box sx={{ display: 'flex', height: '100vh' }}>
                <Box sx={{ flex: 4, bgcolor: '#ffffff', padding: 2, justifyContent: 'center'}}>
                    <CustomizedBreadcrumbs />
                    <h1>Đăng tin mới</h1>
                    <hr className="horizontal-line" />
                    <form className="form-container " onSubmit={handleSubmit}>
                        <h2>Địa chỉ cho thuê</h2>
                        <div style={{ display: 'flex', gap: '16px', flexGrow: 1 }}>
                            <div style={{ flex: 1 }}>
                                <SelectWithLabel
                                    label="Chọn Tỉnh/Thành phố"
                                    options={provinces}
                                    value={selectedProvince ? selectedProvince.code : null}
                                    onChange={handleProvinceChange}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <SelectWithLabel
                                    label="Chọn Quận/Huyện"
                                    options={districts}
                                    value={selectedDistrict ? selectedDistrict.code : null}
                                    onChange={handleDistrictChange}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <SelectWithLabel
                                    label="Chọn Phường/Xã"
                                    options={wards}
                                    value={selectedWard ? selectedWard.code : null}
                                    onChange={handleWardChange}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <TextFieldWithoutLabel
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Số nhà, tên đường"
                                />
                            </div>
                        </div>
                        <Box sx={{ marginTop: 2 }}>
                            <h2>Địa chỉ chính xác</h2>
                            <TextField
                                variant="outlined"
                                value={fullAddress}
                                size='small'
                                InputProps={{
                                    readOnly: true,
                                    sx: { bgcolor: '#f0f0f0' },
                                }}
                                fullWidth
                                sx={{ marginTop: 1 }}
                            />
                        </Box>
                        <h2>Thông tin mô tả</h2>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>Chọn loại hình cho thuê</Typography>
                        <FormControl sx={{ m: 1, minWidth: 300 }} size="small">
                            <Select
                                sx={{ fontSize: "" }}
                                native
                                value={propertyType}
                                onChange={(e) => setpropertyType(e.target.value)}
                            >
                                <option aria-label="None" value="">--Chọn loại chuyên mục--</option>
                                <option value="Nhà trọ, phòng trọ">Nhà trọ, phòng trọ</option>
                                <option value="Nhà nguyên căn">Nhà nguyên căn</option>
                                <option value="Cho thuê căn hộ">Cho thuê căn hộ</option>
                                <option value="Cho thuê căn hộ mini">Cho thuê căn hộ mini</option>
                                <option value="Cho thuê căn hộ dịch vụ">Cho thuê căn hộ dịch vụ</option>
                                <option value="Cho thuê mặt bằng, văn phòng">Cho thuê mặt bằng, văn phòng</option>
                            </Select>
                        </FormControl>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }} >Tiêu đề</Typography>
                        <TextField
                            size="small"
                            variant="outlined"
                            fullWidth
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>Nội dung miêu tả</Typography>
                        <TextField
                            size="small"
                            variant="outlined"
                            fullWidth
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                        <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>Thông tin liên hệ</Typography>
                        <TextField
                            variant="outlined"
                            size='small'
                            value={currentUser?.username || ''} // Hiển thị username từ currentUser
                            InputProps={{
                                readOnly: true, // Không cho phép chỉnh sửa
                                sx: { bgcolor: '#f0f0f0', width: '30vw' },
                            }}
                        />
                        <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>Điện thoại</Typography>
                        <TextField
                            sx={{ width: '30vw' }}
                            variant="outlined"
                            size='small'
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                        <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>Giá cho thuê</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '40vw', marginBottom: 2 }}>
                            <TextField
                                id="outlined-amount"
                                variant="outlined"
                                size='small'
                                sx={{ flex: 1, marginRight: 1 }} // Thêm khoảng cách bên phải
                                value={rentalPrice}
                                onChange={handleRentalPriceChange}
                                inputProps={{
                                    inputMode: 'decimal', // Chỉ định kiểu nhập là số thập phân
                                    pattern: "\\d+(\\.\\d{1,2})?", // Chấp nhận số thập phân với tối đa hai chữ số sau dấu phẩy
                                    step: "0.01"
                                }}
                                error={!!error} // Đặt error nếu có thông báo lỗi
                            />
                            <FormControl variant="outlined" sx={{ minWidth: '120px' }}>
                                <InputLabel id="currency-label"></InputLabel>
                                <Select
                                    labelId="currency-label"
                                    size='small'
                                    id="currency-select"
                                    value={currency} // Đặt giá trị của Select từ state
                                    onChange={handleCurrencyChange} // Cập nhật state khi thay đổi
                                >
                                    <MenuItem value="dong_thang">Triệu/tháng</MenuItem>
                                    <MenuItem value="dong_m2_thang">Triệu/m²/tháng</MenuItem>
                                </Select>
                            </FormControl>
                            {error && <FormHelperText error sx={{ marginLeft: 1 }}>{error}</FormHelperText>} {/* Hiển thị thông báo lỗi */}
                        </Box>

                        <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>Diện tích</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '40vw' }}>
                            <TextField
                                id="amount-field"
                                variant="outlined"
                                size='small'
                                fullWidth
                                value={area}
                                onChange={handleAreaChange}
                                inputProps={{
                                    min: 0, // Chỉ cho phép số dương
                                    pattern: "\\d+(\\.\\d{1,2})?", // Chấp nhận số thập phân với tối đa hai chữ số sau dấu phẩy
                                    step: "0.01"
                                }}
                                error={!!areaError} // Đặt error nếu có thông báo lỗi
                            />
                            <TextField
                                id="area-field"
                                variant="outlined"
                                size='small'
                                value="m²" // Giá trị cố định là m²
                                InputProps={{ readOnly: true }}
                                sx={{ backgroundColor: '#f0f0f0', marginLeft: 1 }} // Thêm khoảng cách bên trái
                            />
                        </Box>
                        {areaError && <FormHelperText error sx={{ marginLeft: 1 }}>{areaError}</FormHelperText>}
                        <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>Đối tượng cho thuê</Typography>
                        <Select

                            size='small'
                            value={rentalTarget}
                            onChange={(e) => setRentalTarget(e.target.value)}
                            sx={{ width: '30vw' }}
                        >
                            <MenuItem value="Tất cả">--Tất cả--</MenuItem>
                            <MenuItem value="Nam">Nam</MenuItem>
                            <MenuItem value="Nữ">Nữ</MenuItem>
                        </Select>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>Số lượng tối đa</Typography>
                        <TextField
                            variant="outlined"
                            size='small'
                            value={maxOccupants}
                            onChange={handleMaxOccupantsChange}
                            sx={{ width: '30vw' }}
                        />
                        {maxOccupantsError && <FormHelperText error sx={{ marginLeft: 1 }}>{maxOccupantsError}</FormHelperText>} {/* Hiển thị thông báo lỗi */}

                        <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>Link Youtube</Typography>
                        <TextField
                            variant="outlined"
                            size='small'
                            value={youtubeLink}
                            onChange={(e) => setYoutubeLink(e.target.value)}
                            sx={{ width: '30vw' }}
                            inputProps={{
                                min: 0, // Chỉ cho phép số dương
                            }}
                            error={!!maxOccupantsError}
                        />
                        <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>Hình ảnh</Typography>
                        <p className='custom-fontp'>Cập nhật hình ảnh chi tiết sẽ giúp tin đăng được chú ý hơn</p>
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="upload-button"
                            type="file"
                            name="images"  // Đặt tên trường là 'files[]' để Multer nhận diện đúng
                            multiple
                            onChange={handleImageChange}
                        />
                        <label htmlFor="upload-button">
                            <IconButton component="span" sx={{ width: '20vw', height: 'auto' }}>
                                <PhotoCamera sx={{ width: '20vw', height: 'auto' }} />
                            </IconButton>
                        </label>
                        <div>
                            {selectedImages.map((image, index) => (
                                <img
                                    key={index}
                                    src={image.preview}
                                    alt={`uploaded-${index}`}
                                    style={{ width: '100px', margin: '5px' }}
                                />
                            ))}
                        </div>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '2vw', marginTop: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    backgroundColor: '#4CAF50',
                                    width: '14vw',
                                    color: 'white',
                                    fontSize: '16px',
                                    '&:hover': {
                                        backgroundColor: '#45a049',
                                    },
                                }}
                            >
                                Đăng tin
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Box>
        </div>
    );
};

export default AddPost;