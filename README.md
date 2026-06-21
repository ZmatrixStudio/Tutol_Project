  <!-- <p align="center">
    <img src="src/main/resources/static/image/bannerGithub.jpg" alt="Tutol Project Logo" width="1000" height="400">
  </p> -->

<h1 align="center"> TUTOL PROJECT </h1>
<p align="center">
  <a href="https://spring.io/projects/spring-boot"><img src="https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=spring&logoColor=white" alt="Spring Boot"></a>
  <a href="https://www.postgresql.org/"><img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"></a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/HTML"><img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5"></a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/CSS"><img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3"></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"></a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"><img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"></a>
</p>
<p align="center"><b>Tutol là nền tảng kết nối gia sư nhanh chóng và tiện lợi, giúp người học dễ dàng tìm kiếm gia sư phù hợp. Hệ thống tích hợp OCR (Optical Character Recognition – nhận dạng ký tự quang học) giúp trích xuất nội dung từ hình ảnh một cách nhanh chóng, cùng với AI (Artificial Intelligence – trí tuệ nhân tạo) hỗ trợ tóm tắt kiến thức và cung cấp giải thích cơ bản, giúp việc học trở nên trực quan, hiệu quả và dễ tiếp cận hơn.</b></p>

---
## 1. Các chức năng của hệ thống 

> **Xác thực & Bảo mật (Authentication):** Hỗ trợ đăng nhập an toàn thông qua email, đồng thời tích hợp OAuth2 với Google và Facebook, giúp người dùng đăng nhập nhanh chóng và tiện lợi.

> **Cơ chế SPA và Định tuyến Client (Custom SPA Router):** Sử dụng cơ chế định tuyến dựa trên Hash (`#home`, `#history`...) giúp chuyển trang siêu tốc mà không cần tải lại toàn bộ trang (No-Refresh). Hệ thống giữ cố định khung Layout tổng (Header, Taskbar) để tối ưu băng thông, đồng thời lưu vết URL cho phép người dùng thoải mái F5 làm mới trang hoặc Back/Forward trình duyệt mà không bị mất trạng thái.

> **Thanh Toán Trực Tuyến:** Hệ thống thanh toán độc lập sử dụng API chính thông của các ngân hàng không qua API thứ ba. Có thể giúp người dùng và admin có thể bảo mật dữ liệu ngân hàng.

> **OCR:** Hệ thông OCR có thể chuyển hình ảnh sang văn bản có tích hợp AI(Ollama, OpenAI,...).

> **API Gateway:** Một cửa duy nhất cho Frontend có thể giao tiếp với Backend

---

## 2. Kiến trúc hệ thống 
---

## 3. Cách chạy dự án

### 3.1 Yêu cầu hệ thống

Để chạy được hệ thống Tutol, máy của bạn cần đáp ứng các yêu cầu sau:

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Tailwind CSS

### Backend
- Java JDK 21 trở lên
- Spring Boot 3.x
- Maven 3.8+

### Database
- PostgreSQL 13 trở lên
- PgAdmin 4 (khuyến nghị để quản lý database)

### Công cụ hỗ trợ
- Git (quản lý mã nguồn)
- VS Code hoặc IntelliJ IDEA (IDE phát triển)
- Postman (kiểm tra API)

---

## 4. Cấu hình Otp Email
```properties
spring.mail.host = smtp.gmail.com
spring.mail.port = 587
spring.mail.username = ${MAIL_NAME}      
spring.mail.password = ${MAIL_PASSWORD}  
spring.mail.properties.mail.smtp.auth = true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.connectiontimeout=5000
spring.mail.properties.mail.smtp.timeout=5000
spring.mail.properties.mail.smtp.writetimeout=5000
spring.mail.properties.mail.smtp.pool=true
```
- `${MAIL_NAME}`: Email dùng để gửi OTP (tài khoản Gmail đã đăng ký)
- `${MAIL_PASSWORD}`: App Password (mã ứng dụng 16 ký tự do Google cung cấp, không phải mật khẩu đăng nhập Gmail)
---

## 5. Cấu hình PostgreSQL
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/${NAME_DATABASE}
spring.datasource.username=postgres
spring.datasource.password=${DB_PASSWORD}
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

- `${NAME_DATABASE}`: Tên database trong PostgreSQL (database mà hệ thống sẽ kết nối tới)
- `${DB_PASSWORD}`: Mật khẩu của user PostgreSQL (user postgres)
---

## 6. Cấu hình Google reCAPTCHA V3
```properties
recaptcha.secret=${RECAPTCHA_SECRET}
recaptcha.site-key=${RECAPTCHA_SITE_KEY}
```

- `${RECAPTCHA_SECRET}`: **Secret Key** do Google reCAPTCHA cung cấp. Chỉ sử dụng ở backend để xác thực token, tuyệt đối không public.
- `${RECAPTCHA_SITE_KEY}`: **Site Key** do Google reCAPTCHA cung cấp. Dùng ở frontend để khởi tạo reCAPTCHA và tạo token xác thực.
---

## 7. Cấu hình OAuth2

### 7.1 OAuth2 Google
```properties
google.client-id=${GOOGLE_CLIENT_ID}
```

- `${GOOGLE_CLIENT_ID}`: Client ID do Google cấp khi cấu hình OAuth2 trong Google Cloud Console. Giá trị này dùng để nhận diện ứng dụng ở phía frontend khi thực hiện đăng nhập Google.
> **Chuỗi ID Example**: 135399930194-xxx.apps.googleusercontent.com
### 7.2 OAuth2 Facebook
```properties
facebook.app-token=${FACEBOOK_APP_TOKEN}
facebook.app-id=${FACEBOOK_APP_ID}
facebook.version=${FACEBOOK_VERSION}
```
- `${FACEBOOK_APP_TOKEN}`: Chuỗi token dùng để xác thực ứng dụng với Facebook API, bao gồm App ID và App Secret được kết hợp lại. Được sử dụng để thực hiện các yêu cầu xác thực và gọi API Facebook an toàn.
- `${FACEBOOK_APP_ID}`: Mã định danh duy nhất của ứng dụng được cấp bởi Facebook khi đăng ký trong Facebook Developers. Dùng để nhận diện ứng dụng khi tích hợp Facebook Login.
- `${FACEBOOK_VERSION}`: Phiên bản của Facebook Graph API mà ứng dụng sử dụng (ví dụ: v25.0). Việc chỉ định phiên bản giúp đảm bảo tính ổn định và tương thích với các API của Facebook.


