let countdownInterval; 

window.showLoading = function() {
    const loading = document.createElement('div');
    loading.id = 'otp-loading';
    loading.className = `
        fixed inset-0 bg-black/50 flex items-center justify-center z-[99999]
    `;

    loading.innerHTML = `
        <div class="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
    `;

    document.body.appendChild(loading);
}

window.hideLoading = function() {
    const loading = document.getElementById('otp-loading');
    if (loading) loading.remove();
}

window.showOTPModal = function(email, initTime) {
    window.location.hash = "otp";
    
    if (document.getElementById('otp-modal')) {
        document.getElementById('otp-modal').remove();
    }
    
    clearInterval(countdownInterval);

    const slideStyle = document.createElement('style');
    slideStyle.innerHTML = `
        @keyframes modalInSmooth {
            0% {
                transform: translateY(60px) scale(0.96);
                opacity: 0;
                filter: blur(8px);
            }

            
            60% {
                transform: translateY(-8px) scale(1.01);
                opacity: 1;
                filter: blur(0px);
            }

            80% {
                transform: translateY(3px) scale(0.998);
            }

            100% {
                transform: translateY(0) scale(1);
                opacity: 1;
                filter: blur(0px);
            }
        }

        #otp-modal > div {
            animation: modalInSmooth 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            will-change: transform, opacity, filter;
        }
    `;
    document.head.appendChild(slideStyle);

    const modalHTML = `
        <div id="otp-modal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] transition-opacity duration-300">
            <div class="bg-[#F5F5F5] w-[340px] rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-12 duration-300 ease-out">
                
                <div class="px-6 pt-6 pb-4 relative">
                    <button onclick="closeOTPModal()" class="absolute top-6 left-6 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer p-0.5 rounded-lg hover:bg-gray-200/50" title="Quay lại">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                        </svg>
                    </button>

                    <div class="absolute top-6 right-6">
                        <div id="countdown-wrapper" class="flex items-center gap-1 text-xs text-gray-500 bg-gray-200/60 px-2 py-0.5 rounded-md border border-gray-300/30 transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-3.5 h-3.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            <span id="otp-countdown" class="font-bold">00:00</span>
                        </div>
                    </div>

                    <div class="text-center mt-6"> 
                        <h2 class="text-[17px] font-semibold text-gray-800">Nhập mã OTP</h2>
                        <p class="text-sm text-gray-500 mt-1.5 px-6">Mã đã được gửi đến: <br><strong class="text-gray-700 break-all">${email}</strong></p>
                    </div>
                </div>

                <div class="px-6 pb-6 flex justify-center gap-4" id="otp-container">
                    <input type="text" maxlength="1" class="otp-box w-[60px] h-[60px] bg-white border-[3px] border-[#9F8E8E] rounded-[10px] text-center text-3xl font-medium focus:border-green-500 focus:outline-none backdrop-blur-sm shadow-sm transition-all">
                    <input type="text" maxlength="1" class="otp-box w-[60px] h-[60px] bg-white border-[3px] border-[#9F8E8E] rounded-[10px] text-center text-3xl font-medium focus:border-green-500 focus:outline-none backdrop-blur-sm shadow-sm transition-all">
                    <input type="text" maxlength="1" class="otp-box w-[60px] h-[60px] bg-white border-[3px] border-[#9F8E8E] rounded-[10px] text-center text-3xl font-medium focus:border-green-500 focus:outline-none backdrop-blur-sm shadow-sm transition-all">
                    <input type="text" maxlength="1" class="otp-box w-[60px] h-[60px] bg-white border-[3px] border-[#9F8E8E] rounded-[10px] text-center text-3xl font-medium focus:border-green-500 focus:outline-none backdrop-blur-sm shadow-sm transition-all">
                </div>

                <div class="px-6 pb-2">
                    <button id="submit-otp-btn" onclick="verifyOTP()" 
                            class="w-full h-12 bg-[#4ADE80] hover:bg-[#22C55E] active:bg-[#16A34A] 
                                   text-white font-semibold text-[17px] rounded-2xl transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
                        Submit
                    </button>
                </div>
                
                <div class="px-6 pb-2 text-center min-h-[32px]">
                    <button id="resend-otp-btn" onclick="resendOTP('${email}')" class="hidden text-sm text-blue-600 hover:text-blue-800 hover:underline font-semibold cursor-pointer py-1 mx-auto">
                        Gửi lại mã OTP
                    </button>
                </div>

                <div id="status-message" class="px-6 pb-5 text-center text-sm font-medium min-h-[24px]"></div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    if (initTime !== null && initTime > 0) {
        startOTPCountdown(initTime);
    } else {
        document.getElementById('otp-countdown').textContent = "00:00";
    }

    const inputs = document.querySelectorAll('.otp-box');
    inputs.forEach((input, index) => {
        input.addEventListener('input', () => {
            input.value = input.value.replace(/[^0-9]/g, '');
            if (input.value.length === 1 && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === "Backspace" && input.value.length === 0 && index > 0) {
                inputs[index - 1].focus();
            }
        });
    });

    inputs[0].addEventListener('paste', (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').slice(0, 4).replace(/[^0-9]/g, '');
        pasted.split('').forEach((char, i) => {
            if (inputs[i]) inputs[i].value = char;
        });
        if (pasted.length > 0) inputs[Math.min(pasted.length, 3)].focus();
    });

    setTimeout(() => inputs[0].focus(), 100);
}

window.closeOTPModal = function() {
    if (localStorage.getItem("T-Auth")){
        const confirmExit = confirm("Bạn có chắc chắn muốn thoát? Mã OTP hiện tại sẽ bị hủy.");
        if (confirmExit) {
            localStorage.removeItem("T-Auth");
            
            if (typeof countdownInterval !== 'undefined') {
                clearInterval(countdownInterval);
            }
            
            const modal = document.getElementById('otp-modal');
            if (modal) {
                modal.remove();
            }
            
            if (window.location.hash === "#otp") {
                window.location.hash = ""; 
            }
        }
    } else {
        const modal = document.getElementById('otp-modal');
        if (modal) {
            modal.remove();
        }
        
        if (window.location.hash === "#otp") {
            window.location.hash = ""; 
        }
    }
};

// Hàm xử lý đếm ngược thời gian
window.startOTPCountdown = function(durationInSeconds) {
    let timer = durationInSeconds;
    const countdownEl = document.getElementById('otp-countdown');
    const countdownWrapper = document.getElementById('countdown-wrapper');
    const submitBtn = document.getElementById('submit-otp-btn');
    const resendBtn = document.getElementById('resend-otp-btn');

    countdownInterval = setInterval(() => {
        let minutes = Math.floor(timer / 60);
        let seconds = timer % 60;

        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        if (countdownEl) {
            countdownEl.textContent = `${minutes}:${seconds}`;
        }

        if (timer <= 15 && timer > 0) {
            if (countdownEl) countdownEl.className = "font-bold text-red-600 animate-pulse";
            if (countdownWrapper) countdownWrapper.className = "flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-200 transition-all";
        }

        // Khi hết thời gian
        if (--timer < 0) {
            clearInterval(countdownInterval);
            localStorage.removeItem("T-Auth");
            if (countdownEl) countdownEl.textContent = "Hết hạn";
            if (submitBtn) submitBtn.setAttribute('disabled', 'true');
            if (resendBtn) resendBtn.classList.remove('hidden');
        }
    }, 1000);
}

// Hàm xử lý khi bấm nút Gửi lại mã OTP
window.resendOTP = function(email) {
    const statusEl = document.getElementById('status-message');
    statusEl.innerHTML = `<span class="text-blue-600">Đang gửi lại mã OTP mới...</span>`;
    
    // Xóa sạch dữ liệu cũ tại các ô input
    const inputs = document.querySelectorAll('.otp-box');
    inputs.forEach(input => {
        input.value = '';
        input.style.borderColor = '#9F8E8E';
        input.style.backgroundColor = '#FFFFFF';
    });

    // Gọi lại hàm hiển thị modal để reset trạng thái đồng hồ và nút bấm
    setTimeout(() => {
        showOTPModal(email);
        const statusNew = document.getElementById('status-message');
        if (statusNew) {
            statusNew.innerHTML = `<span class="text-green-600">Mã OTP mới đã được gửi!</span>`;
        }
    }, 1000);
};

window.verifyOTP = async () => {
    const inputs = document.querySelectorAll('.otp-box');
    let otp = '';
    inputs.forEach(input => otp += input.value);

    const statusEl = document.getElementById('status-message');

    if (otp.length !== 4) {
        statusEl.innerHTML = '<span class="text-red-500">Vui lòng nhập đủ 4 số</span>';
        return;
    }

    // VERI OTP
    const { headers } =  await import("./get-headers.js");
    const token = localStorage.getItem("T-Auth");

    if (token == null){
        const modal = document.getElementById("otp-modal");
        if (modal) modal.remove();
    }

    const res = await fetch("http://localhost:8080/api/v1/auth/veri-otp", {
        method: "POST",
        headers: {
            ...(await headers()),
            "T-Auth": "Bearer " + token
        },
        body: JSON.stringify({
            "otp": otp,
        })
    })

    const data = await res.json();

    if (data.success) {
        localStorage.removeItem("T-Auth");
        clearInterval(countdownInterval);
        
        inputs.forEach(input => {
            input.style.borderColor = '#22C55E';
            input.style.backgroundColor = '#F0FDF4';
        });
        statusEl.innerHTML = `<span class="text-green-600">Xác thực thành công!</span>`;
        
        setTimeout(() => {
            const modal = document.getElementById('otp-modal');
            if (modal) modal.remove();
        }, 1500);
        // MỞ TRANG HOME LOGIN THÀNH CÔNG 
        location.href = "Home";
        return true;
    } else {
        inputs.forEach(input => {
            input.style.borderColor = '#EF4444';
            input.style.backgroundColor = '#FEF2F2';
            input.classList.add('shake');
        });
        statusEl.innerHTML = `<span class="text-red-600">Mã OTP không đúng</span>`;
        
        setTimeout(() => {
            inputs.forEach(input => {
                input.value = '';
                input.style.borderColor = '#9F8E8E';
                input.style.backgroundColor = '#FFFFFF';
                input.classList.remove('shake');
            });
            statusEl.innerHTML = '';
            inputs[0].focus();
        }, 1800);
    }
};

// Shake animation
const style = document.createElement('style');
style.innerHTML = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20%, 60% { transform: translateX(-6px); }
        40%, 80% { transform: translateX(6px); }
    }
    .shake { animation: shake 0.4s ease-in-out; }
`;
document.head.appendChild(style);

window.addEventListener("hashchange", () => {
    if (window.location.hash !== "#otp") {
        clearInterval(countdownInterval); // Xóa bộ đếm khi người dùng bấm back hoặc tắt modal bằng hash
        const modal = document.getElementById("otp-modal");
        if (modal) modal.remove();
    }
});

window.addEventListener("load", async () => {
    const { headers } = await import("./get-headers.js");

    const token = localStorage.getItem("T-Auth");
    if (!token) return;

    const res = await fetch("http://localhost:8080/api/v1/auth/check-token", {
        method: "POST",
        headers: {
            ...(await headers()),
            Authorization: "Bearer " + token
        }
    });

    if (!res.ok) {
        localStorage.removeItem("T-Auth");
        return;
    }

    const data = await res.json();

    window.location.hash = "otp";
    showOTPModal(data.email, data.expiresIn);
});

// showOTPModal("tenban@gmail.com");
// HOÀN THIỆN CHỨC NĂNG LẤY LẠI MÃ VÀ VERI OTP