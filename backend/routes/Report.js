const express = require('express');
const router = express.Router();
const Post = require('../models/Post'); // Đường dẫn tới schema bài đăng

// API thống kê

router.get('/category', async (req, res) => {
  try {
    const statistics = await Post.aggregate([
      { $group: { _id: "$category", total: { $sum: 1 } } },
    ]);
    res.status(200).json(statistics);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch statistics by category" });
  }
});
router.get('/stats', async (req, res) => {
  try {
    const statistics = await Post.aggregate([
      { $group: { _id: "$status", total: { $sum: 1 } } },
    ]);
    res.status(200).json(statistics);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch statistics by status" });
  }
});
router.get('/province', async (req, res) => {
  try {
    const statistics = await Post.aggregate([
      { $group: { _id: "$address.province", total: { $sum: 1 } } },
    ]);
    res.status(200).json(statistics);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch statistics by province" });
  }
});
router.get('/daterange', async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Dữ liệu bài đăng theo ngày (số lượng bài đăng thêm vào mỗi ngày trong khoảng thời gian)
    const dailyStatistics = await Post.aggregate([
      {
        $match: {
          createdAt: {
            $gte: start,
            $lte: end,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          dailyCount: { $sum: 1 }, // Số lượng bài đăng mới trong ngày
        },
      },
      {
        $sort: { _id: 1 }, // Sắp xếp theo ngày (tăng dần)
      },
    ]);

    // Trả về số lượng bài đăng được thêm mới vào trong mỗi ngày trong khoảng thời gian
    res.status(200).json({
      dailyStatistics: dailyStatistics,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch statistics by date range" });
  }
});


router.get('/total', async (req, res) => {
  try {
    const totalPosts = await Post.countDocuments();
    res.status(200).json({ totalPosts });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch total posts" });
  }
});


module.exports = router;
