<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Quên mật khẩu</title>

    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="style/style.css">
</head>

<body class="bg-[#f6f1f1] h-screen overflow-hidden flex items-center justify-center p-3">

    <!-- BOX -->
    <div class="w-[380px] bg-white rounded-2xl shadow-xl p-6 animate-fade-in-up">

        <!-- ICON -->
        <div class="flex justify-center mb-3">
            <div class="w-12 h-12 rounded-full bg-[#f3e5e5] flex items-center justify-center">
                <i class="fa-solid fa-key text-[#71f36f] text-xl"></i>
            </div>
        </div>

        <!-- TITLE -->
        <h1 class="text-center text-xl font-semibold mb-1">Quên mật khẩu</h1>
        <p class="text-center text-sm text-gray-400 mb-5">
            Nhập email để nhận mã OTP
        </p>

        <!-- EMAIL INPUT -->
        <div class="border-2 border-[#c9b8b3] rounded-xl px-3 h-[50px] flex items-center mb-4">
            <i class="fa-regular fa-envelope text-[#7d6d69]"></i>
            <input id="email"
                   type="text"
                   placeholder="Nhập email"
                   class="w-full ml-3 outline-none text-sm bg-transparent">
        </div>

        <!-- BUTTON -->
        <button onclick="sendOtp()"
                class="w-full h-[48px] bg-[#71f36f] rounded-xl text-white font-semibold hover:opacity-90 transition">
            Gửi mã OTP
        </button>

        <!-- BACK -->
        <div class="text-center mt-4">
            <a href="javascript:void(0)"
            onclick="history.back()"
            class="text-sm text-[#ff5d73] hover:underline">
                ← Quay lại
            </a>
        </div>

        <!-- MESSAGE -->
        <div id="login-message"
                class="fixed top-5 right-5 px-4 py-3 rounded-xl text-sm font-semibold shadow-lg
                        transform translate-x-32 opacity-0 transition-all duration-500 z-50
                        backdrop-blur-md bg-white/20 border border-white/30">
            </div>

    </div>

    <script src="js/email-validation.js"></script>
    <script src="js/otp-verify.js"></script>
    <script src="js/notification.js"></script>
    
    <script>
        function sendOtp() {
            const email = document.getElementById("email").value;
            const msg = document.getElementById("msg");

            if (!email) {
                showMessage ("Vui lòng nhập Email");
                return;
            }

            if (!isValidEmail(email)) {
                showMessage ("Email không hợp lệ");
                return;
            }

            // Kiểm tra xem gmail đó có trong database không
            // Nếu có thì
            if(showOTPModal(email)){
                console.log("Xác thực thành công")
            }
            // xác minh thành công thì cho đổi mật khẩu 
            // Nếu không thì
            showMessage ("Email không tồn tại trong hệ thống");
            
        }
    </script>

</body>
</html>