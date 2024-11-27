const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, 'uploads');

// Kiểm tra xem thư mục uploads có tồn tại chưa, nếu chưa thì tạo
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}