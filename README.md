🎥 VTI Cinemas - Hệ Thống Đặt Vé Xem Phim
📖 Giới Thiệu
VTI Cinemas là một hệ thống đặt vé xem phim trực tuyến, giúp người dùng dễ dàng tìm kiếm, đặt vé. Dự án hướng đến việc cung cấp trải nghiệm giải trí nhanh chóng, tiện lợi và trực quan cho người dùng.

🚀 Tính Năng Chính
Tìm kiếm và đặt vé xem phim.
Hiển thị danh sách phim đang chiếu, sắp chiếu và các suất chiếu đặc biệt.
Hỗ trợ đánh giá phim với hệ thống đánh giá 5 sao và bình luận.
Xác thực người dùng an toàn với đăng nhập bằng Google, Facebook và Email.
Tích hợp phân quyền và bảo mật mạnh mẽ.
Quản lý người dùng với các vai trò (Admin, Manager, User).

🛠️ Công Nghệ Sử Dụng (Tech Stack)
Frontend
React.js: Xây dựng giao diện người dùng (UI) theo mô hình component.
Redux: Quản lý state toàn cục của ứng dụng.
Axios: Gửi và nhận dữ liệu từ backend (API).
React Router: Điều hướng giữa các trang trong ứng dụng.
CSS-in-JS (Styled Components hoặc Emotion) / Sass: Tạo style cho UI.
Ant Design, Tailwind CSS: Cung cấp các thành phần giao diện sẵn có để thiết kế UI nhanh hơn.

Backend
Java với Spring Boot: Xây dựng API, xử lý logic nghiệp vụ, và kết nối cơ sở dữ liệu.
Spring Security: Đảm bảo bảo mật, quản lý xác thực và phân quyền.
Spring Data JPA: Tương tác với cơ sở dữ liệu MySQL thông qua các thao tác CRUD.
JWT (JSON Web Token): Xác thực người dùng và quản lý session an toàn.
Maven: Quản lý phụ thuộc và build dự án.

Database (Cơ sở Dữ liệu)
MySQL: Lưu trữ thông tin về người dùng, phim, lịch chiếu, vé và đánh giá.

Hosting & Deployment (Triển khai)
Heroku (hoặc AWS, Google Cloud, Azure): Triển khai backend và cơ sở dữ liệu.
FireBase: Triển khai frontend React.
Authentication (Xác Thực)
JWT Authentication: Xác thực và phân quyền người dùng khi đăng nhập.
Firebase Authentication (tuỳ chọn): Đăng nhập bằng Google hoặc Facebook.

DevOps & Quản lý Dự Án
Git & GitHub: Quản lý mã nguồn và hỗ trợ làm việc nhóm.
CI/CD (Continuous Integration/Continuous Deployment): Tự động kiểm thử và triển khai sau mỗi lần commit.

Testing (Kiểm Thử)
Postman: Kiểm thử API thông qua các yêu cầu HTTP.
Jest hoặc React Testing Library: Kiểm thử các component của React.
JUnit (Java): Kiểm thử backend và đảm bảo logic nghiệp vụ.

⬇️ Hướng Dẫn Cài Đặt
Yêu Cầu Hệ Thống
Node.js (>= 14.0.0)
Java (>= 11)
MySQL (>= 8.0)

Git
Bước 1: Clone Repository
git clone <https://github.com/DUYLINH1402/VTI-Cinemas-FE.git>

Bước 2: Cài Đặt Frontend
npm install
npm start

Bước 3: Cài Đặt Backend
Cài đặt các phụ thuộc bằng Maven:
mvn install

Chạy ứng dụng:
mvn spring-boot:run

Bước 4: Cấu Hình Database
Tạo một cơ sở dữ liệu MySQL:
CREATE DATABASE vti_cinemas;
Cập nhật file application.properties trong backend với thông tin kết nối.

🧪 Testing
Kiểm thử Frontend:
npm test

Kiểm thử Backend: Sử dụng JUnit trong môi trường phát triển.
Kiểm thử API: Sử dụng Postman hoặc cURL để kiểm tra các endpoint.

📬 Liên Hệ
Nếu có bất kỳ vấn đề hoặc câu hỏi nào, vui lòng liên hệ qua:
Email: mock2406@gmail.com
GitHub: https://github.com/DUYLINH1402
