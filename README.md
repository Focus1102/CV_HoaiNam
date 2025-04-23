# CV Website - Vũ Phan Hoài Nam

## Tổng quan về dự án
Đây là một trang web CV cá nhân được phát triển bằng HTML, CSS, JavaScript và Bootstrap 5, hiển thị thông tin cá nhân, kỹ năng, dự án và thông tin liên hệ của Vũ Phan Hoài Nam.

## Cấu trúc thư mục
```
/
├── assets/              # Chứa tài nguyên hình ảnh
│   ├── Nam.png          # Ảnh đại diện
│   ├── cake-website.jpg # Ảnh dự án website bán bánh
│   └── logo.png         # Logo trang web
├── components/          # Chứa các thành phần có thể tái sử dụng
│   └── nav.html         # Thành phần điều hướng (navigation)
├── css/                 # Chứa file CSS
│   └── cv.css           # CSS chính của trang web
├── js/                  # Chứa file JavaScript
│   ├── cv.js            # JS xử lý chức năng chính của CV
│   └── nav.js           # JS xử lý điều hướng và menu
├── views/               # Chứa các trang con
│   ├── about.html       # Trang giới thiệu
│   ├── contact.html     # Trang liên hệ
│   └── myproduct.html   # Trang sản phẩm
└── cv.html              # Trang chính (trang chủ)
```

## Luồng hoạt động

### 1. Tải trang

Khi người dùng truy cập trang web, `cv.html` sẽ được tải đầu tiên. Quá trình tải diễn ra như sau:

1. Tài liệu HTML được tải với các thẻ meta, tiêu đề, và các liên kết đến Bootstrap CSS, Bootstrap Icons và CSS tùy chỉnh.
2. JavaScript được tải ở cuối trang, bao gồm Bootstrap JS, thư viện docx (để xuất file Word), nav.js và cv.js.

### 2. Tải thanh điều hướng (Navigation)

Thanh điều hướng được tải động bằng JavaScript (nav.js):

1. Khi sự kiện `DOMContentLoaded` kích hoạt, nav.js tìm phần tử có id `nav-container` và tải nội dung từ `components/nav.html` vào đó.
2. Sau khi tải thanh điều hướng, các chức năng sau được thiết lập:
   - Đánh dấu mục điều hướng hiện tại (active)
   - Thiết lập xử lý sự kiện cho logo
   - Thiết lập menu di động
   - Thiết lập nút cuộn lên đầu trang
   - Thiết lập hiệu ứng cuộn cho header

### 3. Điều hướng giữa các trang

Điều hướng giữa các trang được xử lý bằng AJAX để tạo trải nghiệm mượt mà hơn:

1. Khi người dùng nhấp vào một liên kết điều hướng, sự kiện click được chặn lại và xử lý bởi hàm `navigateTo()`.
2. Hàm này thêm hiệu ứng chuyển trang (làm mờ nội dung hiện tại).
3. Nếu đích là trang chính (cv.html), trang được tải lại hoàn toàn.
4. Nếu đích là trang con, JavaScript tải nội dung của trang đó bằng AJAX mà không làm mới toàn bộ trang:
   - Kiểm tra bộ nhớ đệm (sessionStorage) xem trang đã được tải trước đó chưa
   - Nếu đã có trong bộ nhớ đệm, sử dụng nội dung đã lưu
   - Nếu chưa có, tải nội dung từ máy chủ và lưu vào bộ nhớ đệm
   - Cập nhật URL trình duyệt mà không tải lại trang
   - Cập nhật trạng thái active trên thanh điều hướng

### 4. Chức năng chế độ tối (Dark Mode)

Chức năng chuyển đổi giữa chế độ sáng và tối được triển khai trong cv.js:

1. Khi trang tải xong, một nút chuyển đổi chế độ tối được thêm vào trang.
2. Trạng thái chế độ tối được lưu trong localStorage và được khôi phục khi tải lại trang.
3. Khi nhấp vào nút, lớp CSS 'dark-mode' được thêm/xóa khỏi thẻ body và biểu tượng nút thay đổi tương ứng.

### 5. Xuất CV sang file Word

Chức năng xuất CV sang file Word được triển khai trong cv.js:

1. Khi người dùng nhấp vào nút "Export File Word", một sự kiện click được kích hoạt.
2. JavaScript thu thập tất cả thông tin từ các phần của CV (thông tin cá nhân, học vấn, kỹ năng, v.v.).
3. Ảnh đại diện được chuyển đổi thành base64.
4. Sử dụng thư viện docx.js, một tài liệu Word mới được tạo với tất cả thông tin và hình ảnh.
5. Tài liệu Word được tạo thành blob và tải xuống tự động.

### 6. Các trang con

Trang web có 3 trang con chính:

1. **About (about.html)**: Hiển thị thông tin giới thiệu về bản thân.
2. **My Product (myproduct.html)**: Hiển thị thông tin về các dự án cá nhân.
3. **Contact (contact.html)**: Hiển thị thông tin liên hệ và biểu mẫu liên hệ.

Mỗi trang con đều có cấu trúc tương tự trang chính, bao gồm header, main content, và footer. Khi được tải bằng AJAX, chỉ phần nội dung chính (section) được trích xuất và thêm vào trang.

## Tính năng nổi bật

1. **Điều hướng mượt mà**: Sử dụng AJAX để tải các trang mà không làm mới toàn bộ trang, tạo trải nghiệm giống SPA (Single Page Application).
2. **Chế độ tối**: Cho phép người dùng chuyển đổi giữa chế độ sáng và tối.
3. **Thiết kế đáp ứng**: Sử dụng Bootstrap 5 để tạo giao diện hoạt động tốt trên mọi kích thước màn hình.
4. **Xuất CV sang Word**: Cho phép xuất thông tin CV sang định dạng Word để dễ dàng chia sẻ.
5. **Bộ nhớ đệm**: Sử dụng sessionStorage để lưu trữ nội dung trang, giảm thời gian tải và lưu lượng mạng.
6. **Menu di động**: Thiết kế menu thân thiện với thiết bị di động, hỗ trợ cả thao tác vuốt để đóng.
7. **Hiệu ứng chuyển trang**: Hiệu ứng mờ dần khi chuyển giữa các trang để tạo trải nghiệm mượt mà.

## Công nghệ sử dụng

- **HTML5**: Cấu trúc và nội dung trang web
- **CSS3**: Định dạng và tạo kiểu
- **JavaScript**: Xử lý tương tác người dùng và tải động
- **Bootstrap 5**: Framework CSS để tạo giao diện đáp ứng
- **Bootstrap Icons**: Bộ biểu tượng đẹp mắt
- **docx.js**: Thư viện JS để tạo tài liệu Word 