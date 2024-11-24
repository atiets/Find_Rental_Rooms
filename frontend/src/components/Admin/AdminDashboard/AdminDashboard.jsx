import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import './AdminDashboard.css';

import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement, 
  PointElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement, // Đăng ký PointElement
  Title,
  Tooltip,
  Legend
);

const AdminStatistics = () => {
  const [totalPosts, setTotalPosts] = useState(0);
  const [statusStats, setStatusStats] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [provinceStats, setProvinceStats] = useState([]);
  const [dateRangeStats, setDateRangeStats] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch dữ liệu tổng hợp
    const fetchData = async () => {
      setLoading(true);
      const newErrors = {};

      try {
        const totalRes = await axios.get('http://localhost:8000/v1/report/total');
        setTotalPosts(totalRes.data.totalPosts);
      } catch (err) {
        newErrors.totalPosts = 'Không thể tải dữ liệu tổng số bài đăng';
      }

      try {
        const statusRes = await axios.get('http://localhost:8000/v1/report/stats');
        setStatusStats(statusRes.data.postsByStatus || []);
      } catch (err) {
        newErrors.statusStats = 'Không thể tải dữ liệu bài đăng theo trạng thái';
      }

      try {
        const categoryRes = await axios.get('http://localhost:8000/v1/report/category');
        setCategoryStats(categoryRes.data || []);
      } catch (err) {
        newErrors.categoryStats = 'Không thể tải dữ liệu bài đăng theo danh mục';
      }

      try {
        const provinceRes = await axios.get('http://localhost:8000/v1/report/province');
        setProvinceStats(provinceRes.data || []);
      } catch (err) {
        newErrors.provinceStats = 'Không thể tải dữ liệu bài đăng theo tỉnh/thành phố';
      }

      setErrors(newErrors);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleDateRangeSearch = () => {
    axios
      .get('http://localhost:8000/v1/report/daterange', {
        params: { startDate, endDate },
      })
      .then((res) => {
        // Dữ liệu trả về từ API
        setDateRangeStats(res.data.dailyStatistics || []);
      })
      .catch(() => {
        setErrors((prev) => ({
          ...prev,
          dateRange: 'Không thể tải dữ liệu bài đăng theo khoảng thời gian',
        }));
      });
  };

  // Kiểm tra trạng thái tải
  if (loading) {
    return <p>Đang tải dữ liệu...</p>;
  }

  // Dữ liệu biểu đồ
  const statusData = {
    labels: statusStats?.map((stat) => stat._id) || [],
    datasets: [
      {
        label: 'Số lượng bài đăng theo trạng thái',
        data: statusStats?.map((stat) => stat.count) || [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const categoryData = {
    labels: categoryStats?.map((stat) => stat._id) || [],
    datasets: [
      {
        label: 'Số lượng bài đăng theo danh mục',
        data: categoryStats?.map((stat) => stat.total) || [],
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const provinceData = {
    labels: provinceStats?.map((stat) => stat._id) || [],
    datasets: [
      {
        label: 'Số lượng bài đăng theo tỉnh/thành phố',
        data: provinceStats?.map((stat) => stat.total) || [],
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
    ],
  };

  const dateRangeData = {
    labels: dateRangeStats?.map((stat) => stat._id) || [], // Use `_id` as the date
    datasets: [
      {
        label: 'Số lượng bài đăng mới theo ngày',
        data: dateRangeStats?.map((stat) => stat.dailyCount) || [],
        backgroundColor: 'rgba(255, 99, 132, 0.2)', // Light color for the line area
        borderColor: 'rgba(255, 99, 132, 1)', // Darker color for the line
        borderWidth: 2,  // Line thickness
        fill: true, // Option to fill the area under the line
        tension: 0.4, // Smoothness of the line curve
      },
    ],
  };
  
  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Ngày', // X-axis label (date)
        },
      },
      y: {
        title: {
          display: true,
          text: 'Số lượng bài đăng', // Y-axis label (post count)
        },
        beginAtZero: true, // Start Y-axis from 0
      },
    },
    plugins: {
      legend: {
        position: 'top', // Position the legend at the top
      },
    },
  };
  

  return (
    <div>
      <h1>Chào mừng đến Trang Quản Trị</h1>
      <h1>Tổng số bài đăng: {totalPosts}</h1>

      {Object.values(errors).map((err, index) => (
        <p key={index} style={{ color: 'red' }}>
          {err}
        </p>
      ))}

      <h2>Bài đăng theo Danh mục</h2>
      <div className="chart-container">
        <Bar data={categoryData} options={{ responsive: true }} />
      </div>

      <h2>Bài đăng theo Tỉnh/Thành phố</h2>
      <div className="chart-container">
        <Bar data={provinceData} options={{ responsive: true }} />
      </div>

      <h2>Bài đăng theo Khoảng thời gian</h2>
      <div className="date-range-container">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button onClick={handleDateRangeSearch}>Tìm kiếm</button>
      </div>

      <div className="chart-container">
        <Line data={dateRangeData} options={options} />
      </div>
    </div>
  );
};

export default AdminStatistics;
