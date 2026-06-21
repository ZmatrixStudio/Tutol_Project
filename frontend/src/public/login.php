<?php
$key = hex2bin('c9688dcae56d6158565d284b88464bbe409956e6defb7f268172b3a44ab452a3');

$data =json_encode(["ip" => $_SERVER["REMOTE_ADDR"]]);
$nonce = random_bytes(12);
$tag = "";
$ciphertext =
openssl_encrypt( $data,"aes-256-gcm",$key,OPENSSL_RAW_DATA,$nonce,$tag);
$csrf = base64_encode($ciphertext .$tag);
$csrf = rtrim($csrf,"=");
$nonce64 = base64_encode($nonce);
$_SESSION["x_csrf_token"] = $csrf .":" .$nonce64;

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-csrf-token" content="<?= htmlspecialchars($_SESSION['x_csrf_token'], ENT_QUOTES, 'UTF-8') ?>">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <title>Đăng Nhập - Chào mừng bạn trở lại</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
        body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            overflow: hidden;
        }
        .container {
            width: 1200px;
            background: #FFFFFF;
            box-shadow: 0px 15px 35px rgba(0, 0, 0, 0.1), 
                0px 5px 15px rgba(0, 0, 0, 0.05);
            border-radius: 20px;
            display: flex;
            justify-content: space-between;
            height: 600px;
        }

        .right-btn {
            margin-right: 50px;
        }
        .input-group {
            box-sizing: border-box;
            position: relative;
            width: 500px;
            height: 60px;
            border: 2px solid rgba(0, 0, 0, 0.5);
            border-radius: 20px;
            display: flex;
            align-items: center;
            margin-top: 15px;
            background-color: #ffffff;
            overflow: visible;
            
        }

        .input-group::before,
        .input-group::after {
            content: "";
            position: absolute;
            inset: -2px; 
            border: 3px solid #19d228;
            border-radius: 20px;
            pointer-events: none;
            z-index: 1; 
        }

        .input-group::before {
            clip-path: polygon(50% 0, 50% 0, 50% 0, 50% 0);
        }
        .input-group::after {
            clip-path: polygon(50% 0, 50% 0, 50% 0, 50% 0);
            mask: linear-gradient(to right, #000, #000) no-repeat center top;
            mask-size: 0% 100%; 
            transition: mask-size 1.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .input-group input {
            border: none;
            height: 50px;
            font-size: 20px;
            outline: none;
            width: 350px;
            flex-shrink: 0;
        }


        .input-label{
            position:absolute;
            left:50%;
            top:0;
            transform: translate(-50%, -50%);
            background:white;
            padding:0 10px;
            font-size:20px;
            opacity:0;
            transition:.25s;
            pointer-events:none;
            font-family: 'Roboto';
            font-style: normal;
            font-weight: 700;
            font-size: 16px;
            line-height: 19px;
            color: #707070;
            z-index: 999;
        }

        .input-group:focus-within .input-label,
        .input-group input:not(:placeholder-shown) ~ .input-label {
            opacity: 1;
        }

        .input-field:focus::placeholder {
            color: transparent;
        }

        /* KÍCH HOẠT ANIMATION CHẠY TỪ GIỮA SANG HAI BÊN */
        /* Thay thế toàn bộ đoạn :has(...) của bạn bằng đoạn này */
.input-group.active .border-layer::before {
    animation: drawLeft 0.5s ease-in-out forwards;
    -webkit-animation: drawLeft 0.5s ease-in-out forwards;
}

.input-group.active .border-layer::after {
    animation: drawRight 0.5s ease-in-out forwards;
    -webkit-animation: drawRight 0.5s ease-in-out forwards;
}

/* Định nghĩa border-layer */
.border-layer {
    position: absolute;
    inset: -2px;
    pointer-events: none;
    z-index: 1;
}
.border-layer::before, .border-layer::after {
    content: "";
    position: absolute;
    inset: 0;
    border: 3px solid #19d228;
    border-radius: 20px;
    -webkit-clip-path: polygon(50% 0, 50% 0, 50% 0, 50% 0);
    clip-path: polygon(50% 0, 50% 0, 50% 0, 50% 0);
}

                /* NỬA BÊN TRÁI: Chạy từ giữa đỉnh -> góc trái -> cạnh trái -> đáy -> giữa đáy */
                /* ================= NỬA BÊN TRÁI (CHẠY 10% MỖI BƯỚC) ================= */
        @keyframes drawLeft {
            0%   { clip-path: polygon(50% 0, 50% 0, 50% 0, 50% 0); }
            10%  { clip-path: polygon(50% 0, 37.5% 0, 37.5% 0, 50% 0); }
            20%  { clip-path: polygon(50% 0, 25% 0, 25% 0, 50% 0); }
            30%  { clip-path: polygon(50% 0, 12.5% 0, 12.5% 0, 50% 0); }
            40%  { clip-path: polygon(50% 0, 0% 0, 0% 0, 50% 0); }        /* Chạm góc trên trái */
            50%  { clip-path: polygon(50% 0, 0% 0, 0% 50%, 50% 0); }      /* Chạy nửa cạnh dọc trái */
            60%  { clip-path: polygon(50% 0, 0% 0, 0% 100%, 50% 0); }     /* Chạm góc dưới trái */
            70%  { clip-path: polygon(50% 0, 0% 0, 0% 100%, 12.5% 100%); }
            80%  { clip-path: polygon(50% 0, 0% 0, 0% 100%, 25% 100%); }
            90%  { clip-path: polygon(50% 0, 0% 0, 0% 100%, 37.5% 100%); }
            100% { clip-path: polygon(50% 0, 0% 0, 0% 100%, 50% 100%); }   /* Gặp nhau ở giữa đáy */
        }
        @keyframes drawRight {
            0%   { clip-path: polygon(50% 0, 50% 0, 50% 0, 50% 0); }
            10%  { clip-path: polygon(50% 0, 62.5% 0, 62.5% 0, 50% 0); }
            20%  { clip-path: polygon(50% 0, 75% 0, 75% 0, 50% 0); }
            30%  { clip-path: polygon(50% 0, 87.5% 0, 87.5% 0, 50% 0); }
            40%  { clip-path: polygon(50% 0, 100% 0, 100% 0, 50% 0); }    /* Chạm góc trên phải */
            50%  { clip-path: polygon(50% 0, 100% 0, 100% 50%, 50% 0); }  /* Chạy nửa cạnh dọc phải */
            60%  { clip-path: polygon(50% 0, 100% 0, 100% 100%, 50% 0); } /* Chạm góc dưới phải */
            70%  { clip-path: polygon(50% 0, 100% 0, 100% 100%, 87.5% 100%); }
            80%  { clip-path: polygon(50% 0, 100% 0, 100% 100%, 75% 100%); }
            90%  { clip-path: polygon(50% 0, 100% 0, 100% 100%, 62.5% 100%); }
            100% { clip-path: polygon(50% 0, 100% 0, 100% 100%, 50% 100%); } /* Gặp nhau ở giữa đáy */
        }

        .btn-continue {
            position: relative;
            width: 500px; 
            height: 60px;
            background-color: #bdf2bd; 
            border: 1px solid #468449; 
            border-radius: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            overflow: hidden; 
            user-select: none; /* Ngăn chặn bôi đen chữ khi double click */
            transition: all 0.2s ease;
            margin-top: 15px;
        }

        .btn-continue:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(70, 132, 73, 0.3);
            background-color: #b2ebb2;
        }

        .btn-continue:active {
            transform: translateY(0);
        }

        .btn-text {
            font-family: 'Inter', sans-serif;
            font-size: 30px;
            font-weight: 700;
            color: #2e5931; 
            position: relative;
            z-index: 10; 
        }

        .water-blob {
            position: absolute;
            border-radius: 50%;
            opacity: 0.45; 
            filter: blur(14px); 
            pointer-events: none;
        }

        .blob-1 {
            width: 50px; height: 50px;
            background-color: #ffeb3b;
            left: 40px; top: 15px;
        }
        .blob-2 {
            width: 45px; height: 45px;
            background-color: #00bcd4;
            left: 140px; bottom: 10px;
        }
        .blob-3 {
            width: 55px; height: 55px;
            background-color: #e91e63;
            left: 220px; top: -10px;
        }
        .blob-4 {
            width: 40px; height: 40px;
            background-color: #ff9800;
            right: 250px; bottom: 5px;
        }
        .blob-5 {
            width: 60px; height: 60px;
            background-color: #03a9f4;
            right: 130px; top: 10px;
        }
        .blob-6 {
            width: 45px; height: 45px;
            background-color: #ffc107;
            right: 50px; bottom: 15px;
        }
        .blob-7 {
            width: 50px; height: 50px;
            background-color: #00bcd4;
            right: 15px; top: 5px;
        }

        .btn-register {
            box-sizing: border-box;

            position: relative;
            width: 500px;
            height: 60px;

            border: 3px solid #60A0FF;
            border-radius: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 15px;
            cursor: pointer;

            background-color: transparent; 
            user-select: none;             
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); 
        }

        .btn-register span {
            position: absolute;
            width: 372px;
            height: 60px;
            font-family: 'Roboto';
            font-style: normal;
            font-weight: 700;
            font-size: 30px;
            line-height: 60px;
            color: #60A0FF;

            text-align: center; 
            pointer-events: none; 
            transition: color 0.3s ease; 
        }

        .btn-register:hover {
            background-color: #60A0FF;
            box-shadow: 0 8px 20px rgba(96, 160, 255, 0.35); 
            transform: translateY(-2px); 
        }

        .btn-register:hover span {
            color: #ffffff; 
        }

        .btn-register:active {
            transform: translateY(1px); 
            box-shadow: 0 4px 10px rgba(96, 160, 255, 0.2);
        }

        .divider {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 500px;
            margin-top: 30px;
            
            opacity: 0.5;
        }

        .divider::before,
        .divider::after {
            content: "";
            flex: 1;
            height: 2px;
            background-color: #000000;
        }

        .divider span {
            padding: 0 20px;
            font-family: 'Poppins', sans-serif;
            font-style: normal;
            font-weight: 700;
            font-size: 20px;
            color: #000000;
            text-transform: uppercase;
        }

        .social-group {
            display: flex;
            gap: 30px;
            width: 500px;
            margin-top: 30px;
        }

        .btn-social {
            flex: 1;
            height: 60px;
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            cursor: pointer;
            user-select: none;
            transition: all 0.2s ease;
            margin-bottom: 30px;
        }

        .btn-social img {
            height: 30px;
            width: 30px;
            object-fit: contain;
        }

        .btn-social span {
            font-family: 'Poppins', sans-serif;
            font-style: normal;
            font-weight: 700;
            font-size: 20px;
        }

        .btn-google {
            background-color: #f1f8db;
            border: 1px solid #738054;
        }

        .btn-google span {
            color: #738054;
        }

        .btn-facebook {
            background-color: #60A0FF;
            border: 1px solid #1976d2;
        }

        .btn-facebook span {
            color: #ffffff;
        }

        .btn-social:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
        }

        .btn-social:active {
            transform: translateY(0);
        }

        .icon {
            margin-left: 20px;
            margin-right: 10px;
            font-size: 22px;
            transition: 0.3s;
            color: #7e7e7e;
        }

        .btn-la {
            margin-left: 25px;
            margin-top: -10px;
            overflow: hidden;
            border-radius: 20px;
            animation: shake 5s infinite ease-in-out;
            transform-origin: center;
        }

        @keyframes shake {
            0%   { transform: rotate(0deg) translateY(0); }
            25%  { transform: rotate(3deg) translateY(-1px); }
            50%  { transform: rotate(-3deg) translateY(1px); }
            75%  { transform: rotate(2deg) translateY(-1px); }
            100% { transform: rotate(0deg) translateY(0); }
        }
        .left-btn {
            width: 550px;
            background: rgba(119, 246, 240, 0.5);
            border-radius: 20px;
        }

        .welcome-container {
            display: flex;
            flex-direction: column;
            align-items:center;
            font-family: 'Poppins', 'Inter', sans-serif;
            gap: 15px;
            text-align: center;
        }

        .title-welcome {
            width: 500px;
            height: 44px;

            font-family: 'Roboto';
            font-style: normal;
            font-weight: 700;
            font-size: 50px;
            line-height: 94px;

            color: #000000;


        }

        .badge {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            height: 60px;
            padding: 0 40px;
            font-size: 32px;
            font-weight: 700;
            color: #FFFFFF;
            border-radius: 4px;
            box-sizing: border-box;
        }

        .badge-tutoring {
            background-color: #658354;
            width: 220px;
        }

        .badge-website {
            background-color: #d1a24b;
            width: 220px;
        }

        .svg-move-up {
            position: absolute;
            transform: translateX(230px) translateY(-300px) rotate(5deg);
            
            /* Chạy animation */
            animation: diagonalFloat 3s ease-in-out infinite alternate;
        }

        @keyframes diagonalFloat {
            0% {
                /* Điểm xuất phát: Phải trùng khớp với vị trí định vị ban đầu */
                transform: translate(210px, -280px); 
            }
            100% {
                /* Điểm kết thúc (đã cộng thêm): 
                X: 220px + 25px = 245px
                Y: -350px - 20px = -370px */
                transform: translate(230px, -300px); 
            }
        }
        .login-title-wrapper{

            padding-top:30px;

            display:flex;

            flex-direction:column;

            align-items:center;
            margin-bottom: 30px;
        }

        .login-title{

            margin:0;

            font-family:
                'Roboto',
                sans-serif;

            font-weight:700;

            font-size:40px;

            color:
                rgba(
                    31,
                    31,
                    31,
                    .9
                );

            line-height:1;
        }

        .login-line{

            margin-top:10px;

            width:260px;

            height:5px;

            background:#b89d9d;

            border-radius:999px;
        }

        .btn-forgot-password {
            text-align: end;
            font-family: 'Roboto';
            font-style: normal;
            font-weight: 700;
            color: #60A0FF;
            margin-top: 10px;
            cursor: pointer;
        }
        .input-field::placeholder {
            font-size: 18px; /* Chỉnh số này nhỏ lại theo ý bạn */
            color: #999;     /* Có thể chỉnh màu nhạt hơn để nhìn đỡ rối */
            opacity: 1;      /* Bắt buộc thêm dòng này để Safari/iPhone hiển thị đúng màu */
        }
            @media (max-width:1200px){
                body{
                    overflow-x:hidden;
                    overflow-y:auto;
                }

                .left-btn{
                    display:none;
                }

                .container{
                    width:90%;
                    max-width:450px;
                    height:auto;
                    margin:0 auto;
                    flex-direction:column;
                    padding:20px;
                    box-sizing:border-box;
                }

                .right-btn{
                    width:100%;
                    margin-right:0;
                }

                .input-group,
                .btn-continue,
                .btn-register,
                .divider,
                .social-group{
                    width:100%;
                    margin-left:0;
                }

                .btn-continue, .btn-register {
                    height: 50px;
                }

                .btn-register span{
                    font-size: 20px;
                }

                .login-title-wrapper{
                    margin-left:0;
                }

                
                /* Thêm phần này */
                .input-group{
                    display:flex;
                    align-items:center;
                }

                .input-group input{
                    flex:1;
                    width:80%;
                    height: 30px;
                }

                .btn-la{
                    margin-left:5px; /* sát input */
                    white-space:nowrap;
                    margin-top: 0.5px;
                    width: 60px;
                    height: 50px;
                    margin-top: -15px;
                    
                }

                .social-group span {
                    font-size: 15px;
                }

                .input-field::placeholder {
                    font-size: 15px; /* Chỉnh số này nhỏ lại theo ý bạn */
                    color: #999;     /* Có thể chỉnh màu nhạt hơn để nhìn đỡ rối */
                    opacity: 1;      /* Bắt buộc thêm dòng này để Safari/iPhone hiển thị đúng màu */
                }
                
            }
            #togglePassword {
                position: absolute;
                right: 15px;      /* Căn sát lề phải */
                color: #888;      /* Màu nhạt để tinh tế hơn */
                cursor: pointer;
                z-index: 10;      /* Đảm bảo nó luôn nằm trên các lớp khác */
                transition: color 0.3s ease;
            }

            #togglePassword:hover {
                color: #555;      /* Đổi màu khi hover để người dùng biết có thể click */
            }
    </style>
</head>
<body>
    <div class="container">
        <div class="left-btn">
        </div>
        <div class="right-btn">
            <div class="login-title-wrapper">
                <h1 class="login-title">
                    Đăng Nhập
                </h1>

                <div class="login-line"></div>
            </div>
            <div class="input-group js-control">
                <i class="fa-regular fa-envelope icon"></i>

                <input type="text" id="email" class="input-field" placeholder="Example@gmail.com" required>
                <label for="email" class="input-label">Email</label>
                
                <div class="border-layer"></div>
                <img class="btn-la"  width="70" height="57" src="/Application/frontend/assets/images/la.png" alt="image">
            </div>
            <div class="input-group js-control">
                <i class="fa fa-lock icon"></i> 
                <input type="password" id="password" class="input-field" placeholder="Example1@" style="border-radius: 20px;" required>

                <label for="password" class="input-label">Mật Khẩu</label>
                
                <div class="border-layer"></div>
                <i class="fa fa-eye e-icon" id="togglePassword" style="font-size: 15px; margin-right: 20px; cursor: pointer;"></i>
            </div>

            <div class="btn-forgot-password" id="continue-forgot-password">
                <span>Quên mật khẩu ?</span>
            </div>

            <div class="btn-continue" id="login">
                <div class="water-blob blob-1"></div>
                <div class="water-blob blob-2"></div>
                <div class="water-blob blob-3"></div>
                <div class="water-blob blob-4"></div>
                <div class="water-blob blob-5"></div>
                <div class="water-blob blob-6"></div>
                <div class="water-blob blob-7"></div>
                <span class="btn-text">Tiếp Tục</span>
            </div>

            <div class="btn-register" id="continue-register">
                <span>Tạo Tài Khoản Mới</span>
            </div>

            <div class="divider">
                <span>KHÁC</span>
            </div>

            <div class="social-group">
                <div class="btn-social btn-google" id="google">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google">
                    <span>Google</span>
                </div>
                <div class="btn-social btn-facebook" id="facebook">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b9/2023_Facebook_icon.svg" alt="Facebook">
                    <span>Facebook</span>
                </div>
            </div>
        </div>
    </div>
    <script>
const password = document.getElementById("password");
const toggle = document.getElementById("togglePassword");

toggle.addEventListener("click", function () {
    if (password.type === "password") {
        password.type = "text";
        this.classList.remove("fa-eye");
        this.classList.add("fa-eye-slash");
    } else {
        password.type = "password";
        this.classList.remove("fa-eye-slash");
        this.classList.add("fa-eye");
    }
});
</script>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script>
        document.getElementById("login").addEventListener("click", async() => {
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const csrf = document .querySelector( 'meta[name="x-csrf-token"]' ) .getAttribute( 'content' );
            if (!email){
                console.log("Email không được để trống");
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
                console.log("Email không đúng định dạng");
                return;
            }
            if (!password){
                console.log("Password không được để trống");
                return;
            }

            axios.post("api/v1/auth/login",
                {email, password},
                { headers: {
                        "X-CSRF-TOKEN": csrf + ":" + Math.floor(Date.now() / 1000)
                    }
                }
            )
            .then(res => {
                if (res.status === 200) {
                    window.location.href = "/";
                    return;
                }
                sessionStorage.setItem("login_response", btoa(JSON.stringify(res.data)));
                location.reload();
            })
            .catch(err => {
                console.log("Server gặp lỗi !");
            });

            const raw = sessionStorage.getItem("login_response");

            if (raw) {
                const data = JSON.parse(atob(raw));
                console.log(data);
                sessionStorage.removeItem("login_response");
            }

        })



    </script>
    <script>
    const groups = document.querySelectorAll('.js-control');
    groups.forEach(group => {
        const input = group.querySelector('.input-field');
        
        // Khi nhấn vào hoặc gõ chữ
        const checkActive = () => {
            if (document.activeElement === input || input.value !== "") {
                group.classList.add('active');
            } else {
                group.classList.remove('active');
            }
        };

        input.addEventListener('focus', checkActive);
        input.addEventListener('blur', checkActive);
        input.addEventListener('input', checkActive);
    });
</script>
<script>
    function renderLeftBtn() {
    const box = document.querySelector(".left-btn");

    if (window.innerWidth >= 1200) {
        box.innerHTML = `
            <div class="welcome-container">
                <h1 class="title-welcome">Welcome To The</h1>
                <div class="badge badge-tutoring">Tutoring</div>
                <div class="badge badge-website">Website</div>
            </div>
            <img class="svg-move-up" width="465" height="650"
                 src="/Application/frontend/assets/images/rocket.png" alt="Rocket">
        `;
    } else {
        box.innerHTML = ""; 
    }
}

renderLeftBtn();
window.addEventListener("resize", renderLeftBtn);
</script>
</body>
</html>

