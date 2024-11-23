import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { Box, Button, FormControl, FormHelperText, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../../../redux/postAPI';
import './AddPost.css';

const SelectWithLabel = ({ label, options, value, onChange }) => {
    return (
        <FormControl fullWidth variant="outlined" >
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
    const [areaError, setAreaError] = useState('');
    const [rentalTarget, setRentalTarget] = useState('');
    const [maxOccupants, setMaxOccupants] = useState('');
    const [maxOccupantsError, setMaxOccupantsError] = useState('');
    const [youtubeLink, setYoutubeLink] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const fullAddress = `${address} ${selectedWard ? selectedWard.name : ''} ${selectedDistrict ? selectedDistrict.name : ''} ${selectedProvince ? selectedProvince.name : ''}`;
    const [propertyType, setpropertyType] = useState('');
    const dispatch = useDispatch();
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [addressError, setAddressError] = useState('');
    const [errors, setErrors] = useState({});

    const handleAddressChange = (e) => {
        const value = e.target.value;
        if (value.length <= 50) {
            setAddress(value);
            setAddressError('');
        } else {
            setAddressError('Địa chỉ không được vượt quá 50 ký tự.');
        }
    };

    const handleMaxOccupantsChange = (e) => {
        const value = e.target.value;
        const regex = /^[0-9]*$/;

        if (value === '' || regex.test(value)) {
            setMaxOccupants(value);
            setMaxOccupantsError('');
        } else {
            setMaxOccupantsError('Số lượng tối đa phải là số nguyên không âm');
        }
    };
    const handleRentalPriceChange = (e) => {
        const value = e.target.value;
        const regex = /^[0-9]*\.?[0-9]*$/;

        if (value === '' || regex.test(value)) {
            setRentalPrice(value);
            setError('');
        } else {
            setError('Giá cho thuê phải là số thực không âm');
        }
    };

    const handleAreaChange = (e) => {
        const value = e.target.value;
        const regex = /^[0-9]*\.?[0-9]*$/;

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

        if (selectedImages.length + files.length <= 8) {
            Promise.all(
                files.map(file => {
                    return new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            resolve({ file, preview: reader.result });
                        };
                        reader.onerror = reject;
                        reader.readAsDataURL(file);
                    });
                })
            )
                .then(newImages => {
                    setSelectedImages(prevImages => [
                        ...prevImages,
                        ...newImages
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
        const formattedRentalPrice = `${rentalPrice} ${currency === 'dong_thang' ? 'Triệu/tháng' : 'Triệu/m²/tháng'}`;

        const formData = new FormData();
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
            alert("Đăng bài thành công, vui lòng chờ admin duyệt")
            navigate('/');
        } catch (err) {
            if (err.response) {
                alert('Server error:', err.response.data.message);
            }
        }
    };

    return (
        <div>
            <Box sx={{ display: 'flex', height: '100vh' }} className="addpost-container">
                <Box sx={{ flex: 4, bgcolor: '#ffffff', padding: 2, justifyContent: 'center' }}>
                    <form className="form-container " onSubmit={handleSubmit}>
                        <Typography className='title'>Đăng tin mới</Typography>
                        <Typography className='title2'>Địa chỉ cho thuê</Typography>
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
                                <TextField
                                    id="address-field"
                                    label="Địa chỉ"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    value={address}
                                    onChange={handleAddressChange}
                                    inputProps={{
                                        maxLength: 50, // Giới hạn số ký tự tối đa
                                    }}
                                    error={!!addressError}
                                />
                                {addressError && (
                                    <FormHelperText error sx={{ marginLeft: 1 }}>
                                        {addressError}
                                    </FormHelperText>
                                )}
                            </div>
                        </div>
                        <Box sx={{ marginTop: 2 }}>
                            <Typography className='title2'>Địa chỉ chính xác</Typography>
                            <TextField
                                size='small'
                                variant="outlined"
                                value={fullAddress}
                                InputProps={{
                                    readOnly: true,
                                    sx: { bgcolor: '#f0f0f0', marginBottom: '0.5rem' },
                                }}
                                fullWidth
                                sx={{ marginTop: 1 }}
                            />
                        </Box>
                        <Box className='container-info-detail'>
                            <Typography className='title3'>Chọn loại hình cho thuê</Typography>
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
                            <Typography className='title3' >Tiêu đề</Typography>
                            <TextField
                                size="small"
                                variant="outlined"
                                fullWidth
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <Typography className='title3'>Nội dung miêu tả</Typography>
                            <textarea
                                size="small"
                                variant="outlined"
                                fullWidth
                                rows={4}
                                value={content}
                                onChange={(e) => setContent(e.target.value)
                                }
                            />
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: '16px', // Khoảng cách giữa các thành phần
                                    alignItems: 'center', // Căn chỉnh theo trục dọc
                                    marginTop: '1rem'
                                }}
                            >
                                <TextField
                                    id="outlined-basic"
                                    label="Thông tin liên hệ"
                                    variant="outlined"
                                    size="small"
                                    value={currentUser?.username || ''}
                                    InputProps={{
                                        readOnly: true,
                                        sx: { bgcolor: '#f0f0f0', width: '30vw' },
                                    }}
                                />
                                <TextField
                                    id="outlined-basic"
                                    label="Điện thoại"
                                    variant="outlined"
                                    sx={{ width: '30vw' }}
                                    size="small"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 2, // Khoảng cách giữa hai box
                                    alignItems: 'flex-start', // Căn trên
                                    flexWrap: 'nowrap', // Không cho phép xuống dòng
                                    width: '100%', // Chiều rộng tối đa của container
                                    marginTop: '0.5rem'
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        width: '48%', // Thu hẹp chiều rộng để 2 Box nằm trên một hàng
                                        marginBottom: 2,
                                    }}
                                >
                                    <TextField
                                        id="outlined-basic"
                                        label="Giá cho thuê"
                                        variant="outlined"
                                        size="small"
                                        value={rentalPrice}
                                        onChange={handleRentalPriceChange}
                                        inputProps={{
                                            inputMode: 'decimal',
                                            pattern: '\\d+(\\.\\d{1,2})?',
                                            step: '0.01',
                                        }}
                                        error={!!error}
                                    />
                                    <FormControl variant="outlined" sx={{ minWidth: '120px', marginLeft: 1 }}>
                                        <InputLabel id="currency-label"></InputLabel>
                                        <Select
                                            labelId="currency-label"
                                            size="small"
                                            id="currency-select"
                                            value={currency}
                                            onChange={handleCurrencyChange}
                                        >
                                            <MenuItem value="dong_thang">Triệu/tháng</MenuItem>
                                            <MenuItem value="dong_m2_thang">Triệu/m²/tháng</MenuItem>
                                        </Select>
                                    </FormControl>
                                    {error && (
                                        <FormHelperText error sx={{ marginLeft: 1 }}>
                                            {error}
                                        </FormHelperText>
                                    )}
                                </Box>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        width: '48%', // Thu hẹp chiều rộng
                                    }}
                                >
                                    <TextField
                                        id="outlined-basic"
                                        label="Diện tích"
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        value={area}
                                        onChange={handleAreaChange}
                                        inputProps={{
                                            min: 0,
                                            pattern: '\\d+(\\.\\d{1,2})?',
                                            step: '0.01',
                                        }}
                                        error={!!areaError}
                                    />
                                    <TextField
                                        id="area-field"
                                        variant="outlined"
                                        size="small"
                                        value="m²"
                                        InputProps={{ readOnly: true }}
                                        sx={{ backgroundColor: '#f0f0f0', marginLeft: 1, maxWidth: '80px' }}
                                    />
                                    {areaError && <FormHelperText error sx={{ marginLeft: 1 }}>{areaError}</FormHelperText>}
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 2, // Khoảng cách giữa các thành phần
                                    alignItems: 'center', // Căn giữa theo trục dọc
                                    flexWrap: 'nowrap', // Ngăn không cho xuống dòng
                                    width: '100%', // Chiều rộng tối đa của container
                                }}
                            >
                                <FormControl
                                    size="small"
                                    sx={{ width: '30%' }} // Điều chỉnh chiều rộng của thành phần
                                >
                                    <InputLabel id="demo-simple-select-helper-label">Đối tượng cho thuê</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-helper-label"
                                        label="Đối tượng cho thuê"
                                        value={rentalTarget}
                                        onChange={(e) => setRentalTarget(e.target.value)}
                                    >
                                        <MenuItem value="Tất cả">--Tất cả--</MenuItem>
                                        <MenuItem value="Nam">Nam</MenuItem>
                                        <MenuItem value="Nữ">Nữ</MenuItem>
                                    </Select>
                                </FormControl>

                                <TextField
                                    id="outlined-basic"
                                    label="Số lượng tối đa"
                                    variant="outlined"
                                    size="small"
                                    value={maxOccupants}
                                    onChange={handleMaxOccupantsChange}
                                    sx={{ width: '30%' }}
                                    error={!!maxOccupantsError}
                                />
                                {maxOccupantsError && (
                                    <FormHelperText error sx={{ marginLeft: 1 }}>
                                        {maxOccupantsError}
                                    </FormHelperText>
                                )}

                                <TextField
                                    id="outlined-basic"
                                    label="Link youtube"
                                    variant="outlined"
                                    size="small"
                                    value={youtubeLink}
                                    onChange={(e) => setYoutubeLink(e.target.value)}
                                    sx={{ width: '30%' }}
                                    inputProps={{
                                        min: 0,
                                    }}
                                    error={!!maxOccupantsError}
                                />
                            </Box>
                            <Typography className='title3'>Hình ảnh</Typography>
                            <p className='custom-fontp'>Cập nhật hình ảnh chi tiết sẽ giúp tin đăng được chú ý hơn</p>
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="upload-button"
                                type="file"
                                name="images"
                                multiple
                                onChange={handleImageChange}
                            />
                            <label htmlFor="upload-button">
                                <IconButton component="span" sx={{ width: '20vw', height: 'auto' }}>
                                    <PhotoCamera sx={{ width: '15vw', height: 'auto', justifyContent: 'center' }} />
                                </IconButton>
                            </label>
                            <div>
                                {selectedImages.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image.preview}
                                        alt={`uploaded-${index}`}
                                        style={{ width: '100px', margin: '5px', top: '300px' }}
                                    />
                                ))}
                            </div>
                        </Box>
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