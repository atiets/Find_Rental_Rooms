import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApprovedPosts } from '../../../redux/postAPI';
import RoomPost from './RoomPost';
import './ListPostHome.css'; // Import CSS

const ListPostHome = () => {
  const [approvedPosts, setApprovedPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const navigate = useNavigate();

  // Hàm xử lý sự kiện khi người dùng click vào tiêu đề bài đăng
  const handleTitleClick = (id) => {
    if (id) {
      navigate(`/posts/${id}`);
    } else {
      console.error('ID bài đăng không hợp lệ');
    }
  };

  // Hàm thay đổi các bộ lọc
  const handleFilterChange = (event, filterType) => {
    const value = event.target.value;
    switch (filterType) {
      case 'province':
        setSelectedProvince(value);
        setSelectedDistrict('');
        setSelectedWard('');
        break;
      case 'district':
        setSelectedDistrict(value);
        setSelectedWard('');
        break;
      case 'ward':
        setSelectedWard(value);
        break;
      case 'price':
        setSelectedPrice(value);
        break;
      default:
        break;
    }
  };

  // Lấy danh sách bài đăng đã phê duyệt từ API
  useEffect(() => {
    const fetchApprovedPosts = async () => {
      try {
        const response = await getApprovedPosts();
        const data = response.data;
        console.log(response.data);
        const formattedPosts = data.map(post => ({
          id: post._id,
          address: {
            province: post.address?.province || '',
            district: post.address?.district || '',
            ward: post.address?.ward || '',
          },
          title: post.title || '',
          content: post.content || '',
          contactInfo: {
            username: post.contactInfo?.username || '',
            phoneNumber: post.contactInfo?.phoneNumber || '',
          },
          rentalPrice: post.rentalPrice,
          area: post.area,
          images: post.images ? post.images.slice(0, 2) : [],
        }));

        setApprovedPosts(formattedPosts);
        setFilteredPosts(formattedPosts); // Mặc định hiển thị tất cả bài đăng
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu từ API:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedPosts();
  }, []);

  // Lọc bài đăng khi thay đổi tỉnh thành, quận/huyện, xã/phường, hoặc giá
  useEffect(() => {
    let filtered = approvedPosts;

    // Lọc theo tỉnh
    if (selectedProvince) {
      filtered = filtered.filter(post => post.address.province === selectedProvince);
    }

    // Lọc theo quận
    if (selectedDistrict) {
      filtered = filtered.filter(post => post.address.district === selectedDistrict);
    }

    // Lọc theo xã/phường
    if (selectedWard) {
      filtered = filtered.filter(post => post.address.ward === selectedWard);
    }

    // Lọc theo giá
    if (selectedPrice) {
      console.log(selectedPrice)
      const [minPrice, maxPrice] = selectedPrice.split('-').map(price => parseInt(price, 10));

      filtered = filtered.filter(post => {
        // Lấy giá trị rentalPrice và loại bỏ ký tự không phải số
        const price = parseInt(post.rentalPrice.replace(/[^\d]/g, ''), 10);

        return price >= minPrice && price <= maxPrice;
      });
    }

    setFilteredPosts(filtered);
  }, [selectedProvince, selectedDistrict, selectedWard, selectedPrice, approvedPosts]);

  // Phân trang
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Nếu đang tải dữ liệu, hiển thị loading spinner
  if (loading) return (
    <div className="spinner-container">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 loading-spinner"></div>
    </div>
  );

  // Tổng số trang
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filter Section */}
      <div className="filter-container">
        {/* Dropdown lọc tỉnh thành */}
        <div className="flex items-center mr-4">
          <label htmlFor="province" className="mr-3 text-lg font-semibold">Chọn tỉnh thành:</label>
          <select
            id="province"
            onChange={(e) => handleFilterChange(e, 'province')}
            value={selectedProvince}
          >
            <option value="">Tất cả tỉnh thành</option>
            {[...new Set(approvedPosts.map(post => post.address.province))].map((province, index) => (
              <option key={index} value={province}>
                {province}
              </option>
            ))}
          </select>
        </div>

        {/* Dropdown lọc quận/huyện */}
        <div className="flex items-center mr-4">
          <label htmlFor="district" className="mr-3 text-lg font-semibold">Chọn quận/huyện:</label>
          <select
            id="district"
            onChange={(e) => handleFilterChange(e, 'district')}
            value={selectedDistrict}
            disabled={!selectedProvince}
          >
            <option value="">Tất cả quận/huyện</option>
            {[...new Set(approvedPosts
              .filter(post => post.address.province === selectedProvince)
              .map(post => post.address.district)
            )].map((district, index) => (
              <option key={index} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>

        {/* Dropdown lọc xã/phường */}
        <div className="flex items-center mr-4">
          <label htmlFor="ward" className="mr-3 text-lg font-semibold">Chọn xã/phường:</label>
          <select
            id="ward"
            onChange={(e) => handleFilterChange(e, 'ward')}
            value={selectedWard}
            disabled={!selectedDistrict}
          >
            <option value="">Tất cả xã/phường</option>
            {[...new Set(approvedPosts
              .filter(post => post.address.province === selectedProvince && post.address.district === selectedDistrict)
              .map(post => post.address.ward)
            )].map((ward, index) => (
              <option key={index} value={ward}>
                {ward}
              </option>
            ))}
          </select>
        </div>

        {/* Chuyển Dropdown lọc mức giá xuống dưới */}

      </div>
      <div className="filter-container">
        <div className="flex items-center mt-4">
          <label htmlFor="price" className="mr-3 text-lg font-semibold">Chọn mức giá:</label>
          <select
            id="price"
            onChange={(e) => handleFilterChange(e, 'price')}
            value={selectedPrice}
          >
            <option value="">Tất cả mức giá</option>
            <option value="0-1">Dưới 1 triệu</option>
            <option value="1.1-5">Từ 1 triệu đến 5 triệu</option>
            <option value="5-10">Từ 5 triệu đến 10 triệu</option>
            <option value="10-20">Từ 10 triệu đến 20 triệu</option>
            <option value="21-1000">Trên 20 triệu</option>
          </select>
        </div>
      </div>

      {/* Danh sách bài đăng */}
      <div className="posts-grid">
        {currentPosts.map((post) => (
          <RoomPost key={post.id} post={post} onTitleClick={handleTitleClick} />
        ))}
      </div>

      {/* Phân trang */}
      <div className="pagination mt-4 flex justify-center">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="prev-button px-4 py-2 bg-gray-300 rounded-l-lg"
        >
          Trước
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`page-button px-4 py-2 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="next-button px-4 py-2 bg-gray-300 rounded-r-lg"
        >
          Sau
        </button>
      </div>
    </div>
  );
};

export default ListPostHome;
