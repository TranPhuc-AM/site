# Personal Portfolio Website

Một trang Portfolio/CV cá nhân hiện đại, được xây dựng hoàn toàn bằng **HTML5, CSS3, và Vanilla JavaScript**.

## Điểm nổi bật
- **Modern UI**: Thiết kế Glassmorphism, Dark mode mặc định, Gradient sang trọng.
- **Data Driven**: Toàn bộ dữ liệu hiển thị được load từ file `data.json`. Giúp bạn chỉnh sửa nội dung dễ dàng mà không cần đụng vào code.
- **Tối ưu hóa**: Responsive 100%, Animations mượt mà (chỉ sử dụng CSS và JS thuần, không dùng thư viện ngoài ngoại trừ Icon).
- **Tính năng**: Typing effect, Scroll Spy, Progress Bar animation, Filter, v.v.

## Hướng dẫn sử dụng
Vì dự án có sử dụng Fetch API để tải file `data.json`, bạn không thể chạy trực tiếp file HTML bằng cách double-click trên trình duyệt (do chính sách CORS của trình duyệt). Bạn cần một Local Server.

**Cách 1: Dùng VS Code (Khuyên dùng)**
1. Mở thư mục dự án bằng Visual Studio Code.
2. Cài đặt Extension **Live Server**.
3. Click chuột phải vào `index.html` và chọn **"Open with Live Server"**.

**Cách 2: Dùng Python**
Mở terminal tại thư mục dự án và gõ:
```bash
python -m http.server 8000