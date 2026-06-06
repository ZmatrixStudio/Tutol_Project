<p align="center">
  <img src="https://avatars.githubusercontent.com/u/7392261?s=40&v=4" alt="Tutol Project Logo" width="200" height="200">
</p>

<h1 align="center">🚀 TUTOL PROJECT 🚀</h1>
<p align="center"><b>Spring Boot Security & Authentication Wrapper</b></p>

<p align="center">
  <a href="https://spring.io/projects/spring-boot"><img src="https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=spring" alt="Spring Boot"></a>
  <a href="https://openjdk.org/"><img src="https://img.shields.io/badge/Java-17%20%2F%2021-ED8B00?style=for-the-badge&logo=openjdk" alt="Java Version"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" alt="License"></a>
</p>

---

## 🔐 AES-GCM Decryption Utility

Class này dùng để **giải mã dữ liệu đã được mã hoá bằng thuật toán AES-GCM (Advanced Encryption Standard - Galois/Counter Mode)**.

---

### 📌 Chức năng

- Chuyển dữ liệu dạng Hex (nonce + ciphertext) sang byte[]
- Giải mã dữ liệu bằng thuật toán `AES/GCM/NoPadding`
- Xác thực tính toàn vẹn dữ liệu (integrity check)
- Trả về dữ liệu gốc (plaintext)

---

### 📥 Input

- `nonceHex`: Nonce / IV (Initialization Vector) dạng Hex -> 24 ký tự / 2 = 12 bytes (96-bit)
- `cipherHex`: Dữ liệu đã mã hoá dạng Hex
- `key`: Khoá bí mật AES (byte[]) -> 32 bytes (256-bit)

---

### 📤 Output

- Chuỗi dữ liệu gốc (plaintext - String)

---

### 🚀 Cách sử dụng

```java
AESGCMDecrypt decryptor = new AESGCMDecrypt(nonceHex, cipherHex, key);
String result = decryptor.decrypt();

System.out.println("Plain text: " + result);
```

## Cấu hình Otp Email
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com 
spring.mail.password=app_password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

