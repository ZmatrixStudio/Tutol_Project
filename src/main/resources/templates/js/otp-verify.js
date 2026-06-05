function showOTPModal(email) {
    window.location.hash = "otp";
    
    if (document.getElementById('otp-modal')) {
        document.getElementById('otp-modal').remove();
    }
    const modalHTML = `
        <div id="otp-modal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]">
            <div class="bg-[#F5F5F5] w-[340px] rounded-3xl shadow-2xl overflow-hidden">
                
                <!-- Header -->
                <div class="px-6 pt-6 pb-5 text-center">
                    <h2 class="text-[17px] font-semibold text-gray-800">Nhập mã OTP</h2>
                    <p class="text-sm text-gray-500 mt-1">Mã đã được gửi đến: <strong>${email}</strong></p>
                </div>

                <!-- OTP Inputs -->
                <div class="px-6 pb-6 flex justify-center gap-4" id="otp-container">
                    <input type="text" maxlength="1" class="otp-box w-[60px] h-[60px] bg-white border-[3px] border-[#9F8E8E] rounded-[10px] text-center text-3xl font-medium focus:border-green-500 focus:outline-none backdrop-blur-sm shadow-sm transition-all">
                    <input type="text" maxlength="1" class="otp-box w-[60px] h-[60px] bg-white border-[3px] border-[#9F8E8E] rounded-[10px] text-center text-3xl font-medium focus:border-green-500 focus:outline-none backdrop-blur-sm shadow-sm transition-all">
                    <input type="text" maxlength="1" class="otp-box w-[60px] h-[60px] bg-white border-[3px] border-[#9F8E8E] rounded-[10px] text-center text-3xl font-medium focus:border-green-500 focus:outline-none backdrop-blur-sm shadow-sm transition-all">
                    <input type="text" maxlength="1" class="otp-box w-[60px] h-[60px] bg-white border-[3px] border-[#9F8E8E] rounded-[10px] text-center text-3xl font-medium focus:border-green-500 focus:outline-none backdrop-blur-sm shadow-sm transition-all">
                </div>

                <!-- Submit -->
                <div class="px-6 pb-4">
                    <button onclick="verifyOTP()" 
                            class="w-full h-12 bg-[#4ADE80] hover:bg-[#22C55E] active:bg-[#16A34A] 
                                   text-white font-semibold text-[17px] rounded-2xl transition-all">
                        Submit
                    </button>
                </div>

                <!-- Status -->
                <div id="status-message" class="px-6 pb-6 text-center text-sm font-medium min-h-[24px]"></div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Tự động nhảy ô
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

    // Paste hỗ trợ
    inputs[0].addEventListener('paste', (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').slice(0, 4).replace(/[^0-9]/g, '');
        pasted.split('').forEach((char, i) => {
            if (inputs[i]) inputs[i].value = char;
        });
        if (pasted.length > 0) inputs[Math.min(pasted.length, 3)].focus();
    });

    // Focus ô đầu tiên
    setTimeout(() => inputs[0].focus(), 100);
}

window.verifyOTP = function() {
    const inputs = document.querySelectorAll('.otp-box');
    let otp = '';
    inputs.forEach(input => otp += input.value);

    const statusEl = document.getElementById('status-message');

    if (otp.length !== 4) {
        statusEl.innerHTML = '<span class="text-red-500">Vui lòng nhập đủ 4 số</span>';
        return;
    }

    if (otp === "1234") {
        inputs.forEach(input => {
            input.style.borderColor = '#22C55E';
            input.style.backgroundColor = '#F0FDF4';
        });
        statusEl.innerHTML = `<span class="text-green-600">Xác thực thành công!</span>`;
        
        setTimeout(() => {
            document.getElementById('otp-modal').remove();
        }, 1500);
        return true;
        // Trả về token và cookie sau đó mở trang control kiểm tra nếu có token và 
        // cookie thì cho vào trang index.html

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
        const modal = document.getElementById("otp-modal");
        if (modal) modal.remove();
    }
});

// showOTPModal("tenban@gmail.com");
