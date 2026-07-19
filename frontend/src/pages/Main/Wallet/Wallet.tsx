import { useEffect, useState } from "react";

export default function WalletPage(){
    useEffect(() => {document.title = "Ví tiền của tôi"})
    const [pendingActivate, setPendingActivate] = useState<"deposit" | "withdaw" | null>(null);
    const [popupVeriPass, setPopupVeriPass] = useState(false);
    const [popupVeriOtp, setPopupVeriOtp] = useState(false);
    
    const [popupDesposit, setPopupDesposit] = useState(false);
    const [popupWithdraw, setPopupWithdraw] = useState(false);
    
    const [popupSepay, setPopupSepay] = useState(false);
    const [popupAddBank, setPopupAddBank] = useState(false);

    const [amount, setAmount] = useState("");
    const [sepayContent, setSepayContent] = useState("");

    // GỬI GHI CHÚ, SỐ TIỀN, STK, TTK  VỀ SERVER
    const sepayRequests = async () => {
        // const res = axios.post("deposit/create")
        const depositStatus = `NAPTIEN${Math.floor(1000000000 + Math.random() * 9000000000)}`;
        
        setSepayContent(depositStatus);
        setPopupSepay(true);
    }

    // CHECK BANKING 
    // useEffect(() => {
    //     if (!popupSepay) return;
    //     const checkPayment = async() => {
    //         try {

    //         } catch {

    //         }
    //     }
    // })

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {/* KHUNG LOADING */}
                {/* <div className="bg-gradient-to-br from-[#C97474] to-[#b56363] p-5 rounded-2xl skeleton">
                    <div className="h-3 w-24 bg-white/20 rounded"></div>
                    <div className="h-8 w-40 bg-white/25 rounded mt-3"></div>
                    <div className="h-3 w-32 bg-white/20 rounded mt-3"></div>
                </div> 
                */}

                <div className="bg-gradient-to-br from-[#C97474] to-[#b56363] p-5 rounded-2xl text-white shadow-md shadow-rose-900/5 flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute -right-4 -bottom-4 text-white/10 text-7xl font-black transform -rotate-12 transition-transform duration-500 group-hover:scale-110">
                        <i className="fa-solid fa-wallet"></i>
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-white/80">Số dư khả dụng</span>
                    <span id="available-balance" className="text-2xl md:text-3xl font-black mt-3">1.250.000đ</span>
                    <span className="text-[10px] text-rose-100 font-medium mt-2 flex items-center gap-1"><i className="fa-solid fa-shield-check"></i> Sẵn sàng thanh toán lớp học</span>
                </div>

                {/* KHUNG LOADING 2 */}
                {/* <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] relative overflow-hidden animate-pulse">
                    <div className="h-3 w-40 bg-gray-200 rounded"></div>
                    <div className="h-8 w-32 bg-gray-300 rounded mt-3"></div>
                    <div className="h-3 w-44 bg-amber-100 rounded mt-3"></div>
                </div> */}

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col justify-between relative overflow-hidden group">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Số dư tạm giữ (Đóng băng)</span>
                    <span id="frozen-balance" className="text-2xl md:text-3xl font-black text-[#3D3333] mt-3">600.000đ</span>
                    <span className="text-[10px] text-amber-500 font-bold mt-2 flex items-center gap-1" title="Hệ thống giữ để đảm bảo gia sư dạy xong mới giải ngân">
                        <i className="fa-solid fa-clock"></i> Đang giữ cho lịch học hôm nay
                    </span>
                </div>

                {/* <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] relative overflow-hidden skeleton">
                    <div className="h-3 w-32 bg-gray-200 rounded"></div>
                    <div className="h-8 w-28 bg-emerald-100 rounded mt-3"></div>
                    <div className="h-3 w-40 bg-gray-100 rounded mt-3"></div>
                </div> */}

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col justify-between">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Điểm thưởng tích lũy</span>
                    <span className="text-2xl md:text-3xl font-black text-emerald-600 mt-3">4,500 <span className="text-xs font-bold text-gray-400">Xu</span></span>
                    <span className="text-[10px] text-gray-400 font-medium mt-2">Dùng để đổi mã giảm giá học phí</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
    
                <div className="lg:col-span-4 flex flex-col gap-6">
                    
                    <div className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100 flex flex-col gap-4">
                        <h3 className="font-extrabold text-[#3D3333] text-sm flex items-center gap-2 pb-3 border-b border-gray-50">
                            <i className="fa-solid fa-money-bill-transfer text-[#C97474]"></i> Giao dịch nhanh
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={(e) => {e.preventDefault(), setPopupVeriPass(prev => !prev), setPendingActivate("deposit")}} id="btn-deposit" className="relative bg-[#C97474] text-white font-extrabold text-xs py-3.5 px-6  border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-75 hover:bg-[#b56363] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none flex flex-col items-center justify-center gap-2 select-none">
                                <i className="fa-solid fa-arrow-down-long text-base"></i> 
                                <span className="tracking-wider">NẠP TIỀN</span>
                            </button>

                            <button id="btn-withdraw" onClick={(e) => {e.preventDefault(), setPopupVeriPass(prev => !prev), setPendingActivate("withdaw")}}
                                    className="relative bg-[#F6F1F1] text-[#5A4B4A] font-extrabold text-xs py-3.5 px-6 
                                        border-4 border-black rounded-none
                                        shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
                                        transition-all duration-75
                                        hover:bg-gray-200 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                                        active:translate-x-[4px] active:translate-y-[4px] active:shadow-none
                                        flex flex-col items-center justify-center gap-2 select-none">
                                <i className="fa-solid fa-arrow-up-long text-base"></i> 
                                <span className="tracking-wider">RÚT TIỀN</span>
                            </button>
                        </div>
                    </div>

                    <div onClick={(e) => {e.preventDefault(); setPopupAddBank(prev => !prev)}} className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100 flex flex-col gap-4">            
                        <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                            <h3 className="font-extrabold text-[#3D3333] text-sm flex items-center gap-2">
                                <i className="fa-solid fa-building-columns text-gray-400"></i> Ngân hàng liên kết
                            </h3>
                            <button id="btn-add-bank" className="text-[11px] font-black text-[#C97474] hover:underline">+ Thêm</button>
                        </div>
                        <div id="bank-info-card" className="flex items-center justify-between p-3 bg-[#F6F1F1] rounded-xl border border-gray-200 cursor-pointer hover:border-[#C97474]/50 transition group">
                            <div className="flex items-center gap-3">
                                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00287A] to-[#000820] shadow-[0_8px_16px_-6px_rgba(0,20,60,0.8)] border border-blue-300/20 flex flex-col items-center justify-center overflow-hidden group select-none transition-transform duration-300 hover:-translate-y-1 cursor-pointer">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/25/Logo_MB_new.png" alt="MBBank" className="w-30 h-30 object-contain" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-[#3D3333] group-hover:text-[#C97474] transition">MB BANK</p>
                                    <p className="text-[10px] font-medium text-gray-400">**** **** 2626</p>
                                </div>
                            </div>
                            <span className="text-[10px] font-bold text-gray-500 bg-gray-200 px-2 py-0.5 rounded shadow-sm">Mặc định</span>
                        </div>
                    </div>

                    
                    <div className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100 flex flex-col gap-3">
                        <h3 className="font-extrabold text-[#3D3333] text-sm flex items-center gap-2 pb-3 border-b border-gray-50">
                            <i className="fa-solid fa-gear text-gray-400"></i> Tiện ích thông minh
                        </h3>
                        <div className="flex items-center justify-between py-1">
                            <div>
                                <p className="text-xs font-bold text-[#3D3333]">Tự động trả học phí</p>
                                <p className="text-[10px] text-gray-400 font-medium">Thanh toán ngay khi buổi học kết thúc</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" id="toggle-autopay" checked className="sr-only peer"/>
                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#C97474]"></div>
                            </label>
                        </div>
                    </div>

                </div>

                <div className="lg:col-span-8 flex flex-col gap-4">
                    
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-wrap items-center justify-between gap-3">
                        <div id="filter-container" className="flex flex-wrap gap-1.5">
                            <button data-filter="all" className="filter-btn px-3 py-1.5 text-xs font-bold bg-[#C97474] text-white rounded-lg shadow-sm transition">Tất cả</button>
                            <button data-filter="deposit" className="filter-btn px-3 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-50 rounded-lg transition">Nạp tiền</button>
                            <button data-filter="withdraw" className="filter-btn px-3 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-50 rounded-lg transition">Rút tiền</button>
                            <button data-filter="payment" className="filter-btn px-3 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-50 rounded-lg transition">Học phí</button>
                        </div>
                        <span className="text-[11px] font-bold text-gray-400" id="current-month"><i className="fa-solid fa-calendar-days"></i> Tháng 6 / 2026</span>
                    </div>

                    <div id="transaction-list" className="flex flex-col gap-3">
                        
                        <div className="transaction-item bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex items-center justify-between gap-4" data-type="payment">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-sm">
                                    <i className="fa-solid fa-book-open"></i>
                                </div>
                                <div>
                                    <h4 className="font-extrabold text-xs md:text-sm text-[#3D3333]">Thanh toán học phí lớp Tiếng Anh</h4>
                                    <p className="text-[10px] font-bold text-gray-400 mt-0.5">Gia sư: Trần Hoàng Bách • Mã #GS1024</p>
                                    <p className="text-[9px] text-gray-400 font-medium mt-0.5">Hôm nay, 21:05</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs md:text-sm font-black text-[#3D3333]">-600.000đ</p>
                                <span className="inline-block text-[9px] font-black tracking-wide text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded mt-1 uppercase">Thành công</span>
                            </div>
                        </div>

                        <div className="transaction-item bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex items-center justify-between gap-4" data-type="deposit">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">
                                    <i className="fa-solid fa-wallet"></i>
                                </div>
                                <div>
                                    <h4 className="font-extrabold text-xs md:text-sm text-[#3D3333]">Nạp tiền từ Mobile Banking</h4>
                                    <p className="text-[10px] font-bold text-gray-400 mt-0.5">Ngân hàng liên kết MB Bank</p>
                                    <p className="text-[9px] text-gray-400 font-medium mt-0.5">12 Tháng 6, 2026 • 09:15</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs md:text-sm font-black text-emerald-600">+1.000.000đ</p>
                                <span className="inline-block text-[9px] font-black tracking-wide text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded mt-1 uppercase">Thành công</span>
                            </div>
                        </div>

                        <div className="transaction-item bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex items-center justify-between gap-4" data-type="deposit">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-sm">
                                    <i className="fa-solid fa-rotate-left"></i>
                                </div>
                                <div>
                                    <h4 className="font-extrabold text-xs md:text-sm text-[#3D3333]">Hoàn tiền hủy lịch học Vật Lý</h4>
                                    <p className="text-[10px] font-bold text-gray-400 mt-0.5">Lớp hủy bởi gia sư Lê Thị Thu Thảo • Mã #GS0982</p>
                                    <p className="text-[9px] text-gray-400 font-medium mt-0.5">05 Tháng 6, 2026 • 14:30</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs md:text-sm font-black text-emerald-600">+400.000đ</p>
                                <span className="inline-block text-[9px] font-black tracking-wide text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded mt-1 uppercase">Đã hoàn ví</span>
                            </div>
                        </div>

                        <div className="transaction-item bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex items-center justify-between gap-4 opacity-80" data-type="withdraw">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center text-sm">
                                    <i className="fa-solid fa-building-columns"></i>
                                </div>
                                <div>
                                    <h4 className="font-extrabold text-xs md:text-sm text-[#3D3333]">Rút tiền về tài khoản ngân hàng</h4>
                                    <p className="text-[10px] font-bold text-gray-400 mt-0.5">Yêu cầu chuyển về ngân hàng MB Bank</p>
                                    <p className="text-[9px] text-gray-400 font-medium mt-0.5">01 Tháng 6, 2026 • 18:00</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs md:text-sm font-black text-gray-500">-500.000đ</p>
                                <span className="inline-block text-[9px] font-black tracking-wide text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded mt-1 uppercase animate-pulse">Đang xử lý</span>
                            </div>
                        </div>

                    </div>
                </div>
            
            </div>

            {/* POPUP XÁC MINH MẬT KHẨU  */}
            {popupVeriPass && (
                <div id="modal-verify-password" className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#3D3333]/40 backdrop-blur-sm transition-opacity duration-300 ${popupVeriPass ? "block opacity-100" : "hidden opacity-0"}`}>
                    <div className="bg-white rounded-3xl p-6 w-[90%] max-w-sm shadow-2xl transform scale-95 transition-transform duration-300">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="font-black text-[#3D3333] text-base"><i className="fa-solid fa-shield text-[#C97474] mr-2"></i> Xác thực tài khoản</h3>
                            <button className="close-modal text-gray-400 hover:text-rose-500 transition" onClick={() => setPopupVeriPass(prev => !prev)}><i className="fa-solid fa-xmark text-xl"></i></button>
                        </div>
                        <div className="mb-5">
                            <label className="block text-xs font-bold text-gray-500 mb-2">Nhập mật khẩu của bạn</label>
                            <div className="relative">
                                <input type="password" id="sepay-password" className="w-full bg-[#F6F1F1] text-[#3D3333] font-bold text-sm rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#C97474]/50 transition" placeholder="Nhập mật khẩu giao dịch"/>
                            </div>
                            <p className="text-[10px] text-gray-400 font-medium mt-2"><i className="fa-solid fa-circle-info text-blue-400"></i> Vui lòng điền mật khẩu tài khoản để tiếp tục giao dịch.</p>
                        </div>
                        <button onClick={(e) => {e.preventDefault(); 
                                                    if (pendingActivate === "deposit"){
                                                        setPopupDesposit(true);
                                                    
                                                    } else {
                                                        setPopupWithdraw(true);
                                                    } 
                                                    setPopupVeriPass(prev => !prev)
                                                    }} id="confirm-password" className="w-full bg-[#3D3333] text-white font-extrabold text-sm py-3.5 rounded-xl hover:bg-black active:scale-[0.98] transition shadow-md shadow-gray-900/20">
                            Tiếp tục
                        </button>
                    </div>
                </div>
            )}
            

            {/* POPUP VERI OTP */}
            {popupVeriOtp && (
                <div id="modal-verify-otp" className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#3D3333]/40 backdrop-blur-sm transition-opacity duration-300 ${popupVeriOtp ? "block opacity-100" : "hidden opacity-0"}`}>
                    <div className="bg-white rounded-3xl p-6 w-[90%] max-w-sm shadow-2xl transform scale-95 transition-transform duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-black text-[#3D3333] text-base"><i className="fa-solid fa-key text-emerald-600 mr-2"></i> Xác thực mã OTP</h3>
                            <button onClick={() => {setPopupVeriOtp(prev => !prev)}} className="close-modal text-gray-400 hover:text-rose-500 transition"><i className="fa-solid fa-xmark text-xl"></i></button>
                        </div>
                        <div className="mb-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
                            <span className="text-xs font-bold text-gray-500 block">Số tiền giao dịch:</span>
                            <span className="text-lg font-black text-emerald-600" id="otp-tx-amount">0đ</span>
                        </div>
                        <div className="mb-5">
                            <label className="block text-xs font-bold text-gray-500 mb-2 text-center">Nhập mã OTP gồm 6 chữ số gửi đến điện thoại</label>
                            <input type="text" id="otp-code" maxLength={6} className="w-full bg-[#F6F1F1] text-[#3D3333] font-black text-center text-2xl tracking-[0.4em] rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition" placeholder="******"/>
                            <p className="text-[10px] text-gray-400 font-medium mt-2.5 text-center"><i className="fa-solid fa-circle-info text-blue-400"></i> Mã OTP dùng để test giả lập là: <span className="font-bold text-[#3D3333]">123456</span></p>
                        </div>
                        <button id="confirm-otp" className="w-full bg-emerald-600 text-white font-extrabold text-sm py-3.5 rounded-xl hover:bg-emerald-700 active:scale-[0.98] transition shadow-md shadow-emerald-900/20">
                            Xác nhận giao dịch
                        </button>
                    </div>
                </div>
            )}

            {/* POPUP NẠP TIỀN */}
            {popupDesposit && (
                <div id="modal-deposit" className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#3D3333]/40 backdrop-blur-sm transition-opacity duration-300 ${popupDesposit ? "block opacity-100" : "hidden opacity-0"}`}>
                    <div className="bg-white rounded-3xl p-6 w-[90%] max-w-sm shadow-2xl transform scale-95 transition-transform duration-300">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="font-black text-[#3D3333] text-base"><i className="fa-solid fa-arrow-down-long text-[#C97474] mr-2"></i> Nạp tiền vào ví</h3>
                            <button onClick={() => setPopupDesposit(false)} className="close-modal text-gray-400 hover:text-rose-500 transition"><i className="fa-solid fa-xmark text-xl"></i></button>
                        </div>
                        <div className="mb-5">
                            <label className="block text-xs font-bold text-gray-500 mb-2">Số tiền muốn nạp (VNĐ)</label>
                            <div className="relative">
                                <input type="text" value={amount} onChange={(e) => {const value = e.target.value.replace(/\D/g, ""); setAmount(value ? Number(value).toLocaleString("vi-VN") : "")}} id="deposit-amount" className="w-full bg-[#F6F1F1] text-[#3D3333] font-black text-xl rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#C97474]/50 transition" placeholder="0"/>
                                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-bold text-sm">VND</span>
                            </div>
                            <div className="flex gap-2 mt-3">
                                <button onClick={() => {setAmount((100000).toLocaleString("vi-VN"))}} className="quick-deposit-btn flex-1 py-1.5 bg-gray-100 hover:bg-[#C97474] hover:text-white rounded-lg text-xs font-bold text-gray-500 transition" data-val="100000">100k</button>
                                <button onClick={() => {setAmount((200000).toLocaleString("vi-VN"))}} className="quick-deposit-btn flex-1 py-1.5 bg-gray-100 hover:bg-[#C97474] hover:text-white rounded-lg text-xs font-bold text-gray-500 transition" data-val="200000">200k</button>
                                <button onClick={() => {setAmount((500000).toLocaleString("vi-VN"))}} className="quick-deposit-btn flex-1 py-1.5 bg-gray-100 hover:bg-[#C97474] hover:text-white rounded-lg text-xs font-bold text-gray-500 transition" data-val="500000">500k</button>
                            </div>
                        </div>
                        <button onClick={sepayRequests} id="confirm-deposit" className="w-full bg-[#C97474] text-white font-extrabold text-sm py-3.5 rounded-xl hover:bg-[#b56363] active:scale-[0.98] transition shadow-md shadow-rose-900/20">
                            Xác nhận nạp
                        </button>
                    </div>
                </div>
            )}
            
            {/* POPUP RÚT TIỀN */}
            {popupWithdraw && (
                <div id="modal-withdraw" className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#3D3333]/40 backdrop-blur-sm transition-opacity duration-300 ${popupWithdraw ? "block opacity-100": "hidden opacity-0"}`}>
                    <div className="bg-white rounded-3xl p-6 w-[90%] max-w-sm shadow-2xl transform scale-95 transition-transform duration-300">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="font-black text-[#3D3333] text-base"><i className="fa-solid fa-arrow-up-long text-gray-500 mr-2"></i> Rút tiền về ngân hàng</h3>
                            <button onClick={() => {setPopupWithdraw(prev => !prev)}} className="close-modal text-gray-400 hover:text-rose-500 transition"><i className="fa-solid fa-xmark text-xl"></i></button>
                        </div>
                        <div className="mb-4 p-3 bg-rose-50 rounded-xl border border-rose-100 flex justify-between items-center">
                            <span className="text-[11px] font-bold text-gray-500">Số dư khả dụng:</span>
                            <span className="text-sm font-black text-[#C97474]" id="modal-available-balance">1.250.000đ</span>
                        </div>
                        <div className="mb-5">
                            <label className="block text-xs font-bold text-gray-500 mb-2">Số tiền muốn rút (VNĐ)</label>
                            <div className="relative">
                                <input type="text" id="withdraw-amount" className="w-full bg-[#F6F1F1] text-[#3D3333] font-black text-xl rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-gray-300 transition" placeholder="0"/>
                                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-bold text-sm">VND</span>
                            </div>
                        </div>
                        <div className="mb-5">
                            <label className="block text-xs font-bold text-gray-500 mb-2">Rút về tài khoản</label>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="w-12 h-12 rounded-xl bg-[#002B7F] flex flex-col items-center justify-center text-white relative shadow-lg overflow-hidden border border-blue-900/30">
                                    <span className="text-base font-black tracking-tight leading-none mb-0.5" style={{ fontFamily: "'Arial Black', 'Inter', sans-serif",}} > MB </span>
                                    
                                    <div className="flex gap-[1.5px] items-center justify-center w-full opacity-90 mt-0.5">
                                        <span className="w-1.5 h-[3px] bg-[#EE0033] rounded-full transform -rotate-12"></span>
                                        <span className="w-1.5 h-[3px] bg-[#EE0033] rounded-full transform -rotate-12"></span>
                                        <span className="w-1.5 h-[4px] bg-[#EE0033] rounded-full transform -rotate-12 scale-110"></span>
                                        <span className="w-1.5 h-[3px] bg-[#EE0033] rounded-full transform -rotate-12"></span>
                                        <span className="w-1.5 h-[3px] bg-[#EE0033] rounded-full transform -rotate-12"></span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-black text-[#3D3333]">MB BANK (NGUYEN VAN A)</p>
                                    <p className="text-[10px] font-medium text-gray-400">**** **** 2626</p>
                                </div>
                            </div>
                        </div>
                        <button onClick={(e) => {e.preventDefault(); setPopupVeriOtp(prev => !prev); setPopupWithdraw(prev => !prev)}} id="confirm-withdraw" className="w-full bg-[#3D3333] text-white font-extrabold text-sm py-3.5 rounded-xl hover:bg-black active:scale-[0.98] transition shadow-md shadow-gray-900/20">
                            Tạo lệnh rút tiền
                        </button>
                    </div>
                </div>
            )}

            {/* POPUP THÊM NGÂN HÀNG */}
            {popupAddBank && (
                <div id="modal-add-bank" className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#3D3333]/40 backdrop-blur-sm hidden opacity-0 transition-opacity duration-300">
                    <div className="bg-white rounded-3xl p-6 w-[90%] max-w-sm shadow-2xl transform scale-95 transition-transform duration-300">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="font-black text-[#3D3333] text-base"><i className="fa-solid fa-building-columns text-gray-500 mr-2"></i> Liên kết ngân hàng</h3>
                            <button className="close-modal text-gray-400 hover:text-rose-500 transition"><i className="fa-solid fa-xmark text-xl"></i></button>
                        </div>
                        <div className="flex flex-col gap-4 mb-6">
                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Chọn ngân hàng</label>
                                <select className="w-full bg-[#F6F1F1] text-sm font-bold text-[#3D3333] rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#C97474]/50 appearance-none">
                                    <option>Vietcombank - NHTMCP Ngoại Thương</option>
                                    <option>Techcombank - NHTMCP Kỹ Thương</option>
                                    <option>MB Bank - Ngân hàng Quân Đội</option>
                                    <option>TPBank - NHTMCP Tiên Phong</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Số tài khoản</label>
                                <input type="text" className="w-full bg-[#F6F1F1] text-sm font-bold text-[#3D3333] rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#C97474]/50" placeholder="Nhập số tài khoản"/>
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Tên chủ tài khoản</label>
                                <input type="text" className="w-full bg-[#F6F1F1] text-sm font-bold text-[#3D3333] rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#C97474]/50 uppercase placeholder:normal-case" placeholder="NGUYEN VAN A"/>
                            </div>
                            <p className="text-[10px] text-gray-400 font-medium"><i className="fa-solid fa-circle-info text-blue-400"></i> Tên chủ tài khoản phải trùng khớp với thông tin định danh trên hệ thống.</p>
                        </div>
                        <button id="confirm-add-bank" className="w-full bg-[#C97474] text-white font-extrabold text-sm py-3.5 rounded-xl hover:bg-[#b56363] active:scale-[0.98] transition shadow-md shadow-rose-900/20">
                            Xác nhận liên kết
                        </button>
                    </div>
                </div>
            )}

            {/* SHOW NGÂN HÀNG */}
            <div id="modal-bank-details" className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#3D3333]/40 backdrop-blur-sm hidden opacity-0 transition-opacity duration-300">
                <div className="bg-white rounded-3xl p-6 w-[90%] max-w-sm shadow-2xl transform scale-95 transition-transform duration-300">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="font-black text-[#3D3333] text-base"><i className="fa-solid fa-building-columns text-blue-600 mr-2"></i> Chi tiết ngân hàng</h3>
                        <button className="close-modal text-gray-400 hover:text-rose-500 transition"><i className="fa-solid fa-xmark text-xl"></i></button>
                    </div>
                    
                    <div id="bank-card-view" className="bg-gradient-to-br from-[#1E1E1E] via-[#2D2D2D] to-[#0A0A0A] rounded-2xl p-5 text-white shadow-lg shadow-black/40 mb-5 relative overflow-hidden border border-neutral-800">
                
                        <div className="absolute right-0 bottom-0 text-neutral-700/10 text-[180px] font-black transform translate-x-10 translate-y-12 pointer-events-none select-none z-0">
                            <i className="fa-solid fa-dragon"></i>
                        </div>
                        
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.03)_0%,transparent_50%)] z-0"></div>

                        <div className="flex justify-between items-center mb-6 relative z-10">
                            <div className="flex items-center gap-1.5">
                                <i className="fa-solid fa-building-columns text-amber-500 text-xs"></i>
                                <span className="text-xs md:text-sm font-black tracking-[0.15em] bg-gradient-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent">MBBANK</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] font-extrabold bg-gradient-to-r from-amber-400 to-amber-600 text-neutral-950 px-2 py-0.5 rounded shadow-sm uppercase tracking-wide">Mặc định</span>
                                <button id="btn-edit-bank" className="text-white/60 hover:text-white bg-white/5 hover:bg-white/15 w-6 h-6 rounded-full flex items-center justify-center transition border border-white/10" title="Chỉnh sửa">
                                    <i className="fa-solid fa-pen text-[10px]"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div className="mb-5 relative z-10">
                            <p className="text-[9px] text-neutral-400 mb-1 uppercase tracking-[0.12em] font-medium">Số tài khoản</p>
                            <p id="display-account-number" className="text-lg md:text-xl font-mono font-bold tracking-[0.18em] bg-gradient-to-r from-neutral-100 to-neutral-300 bg-clip-text text-transparent">0987 6543 2626</p>
                        </div>
                        
                        <div className="relative z-10 flex justify-between items-end">
                            <div>
                                <p className="text-[9px] text-neutral-400 mb-1 uppercase tracking-[0.12em] font-medium">Tên chủ tài khoản</p>
                                <p id="display-account-name" className="text-sm font-black uppercase tracking-widest bg-gradient-to-r from-amber-100 via-neutral-200 to-neutral-400 bg-clip-text text-transparent">NGUYEN VAN A</p>
                            </div>
                            <div className="w-8 h-8 flex items-center justify-center opacity-90 filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] transition hover:scale-110 duration-300" title="Premium Security">
                                <svg height="100%"viewBox="900 600 1100 1000"width="100%"xmlns="http://www.w3.org/2000/svg"><defs><radialGradient cx="1095"cy="690.75"fx="1095"fy="690.75"gradientUnits="userSpaceOnUse"id="dragonGradient"r="2477.91"><stop offset="0"stop-color="#000000"/><stop offset="1"stop-color="#fe1400"/></radialGradient></defs><g fill="url(#dragonGradient)"><path d="M1014.941 869.535l.153.164c1.125 2.082 1.699 5.367 1.715 9.855-.172 2.277-.364 3.922-.575 4.933-.14.727-.746 2.614-1.808 5.66l-12.332 14.465c-.489-1.886-.895-5.058-1.223-9.515-.031-1.813.285-3.786.949-5.922.625-1.699 1.368-3.266 2.219-4.703l7.594-9.368c.226-.226 1.328-2.085 3.308-5.57M1049.473 799.352l.324 4.168.25 12.386c-3.863 10.996-11.726 21.992-19.703 31.602-7.785 8.148-22.395 19.41-43.828 33.789-1.762 1.562-4.098 5.211-7.016 10.945-1.871 4.391-3.218 8.602-4.047 12.629-1.898 16.172-3.203 26.359-3.914 30.551-1.777 9.836-3.57 17.594-5.367 23.273-1.371 4.836-4.191 12.215-8.469 22.129l-18.32 35.742c-2.535 6.36-3.754 11.168-3.656 14.434 2.129 10.937 6.562 19.687 13.297 26.25 9.496 8.058 15.906 11.359 16.664 15.195 2.188 2.41 7.938 4.46 14.282 6.16.344-.286.465-1.262.367-2.93-.1164-6.852-1.812-12.328-1.941-16.438-.063-4.851.105-9.171.512-12.953 2.144-13.175 5.425-22.89 9.84-29.14 3.324-5.563 7.304-10.797 11.941-15.703 12.949-8.973 24.152-17.418 33.605-25.336 10.149-9.465 16.536-16.993 19.157-22.586-5.5-4.961-8.489-10.344-8.961-16.153.523-4.613 1.332-8.683 2.425-12.203 5.95-16.633 10.192-30.429 12.727-41.387 2.434-10.14 3.149-18.562 2.145-25.257-1.039-8.129-3.813-16.383-8.321-24.758-1.785-3.52-7.582-10.668-17.39-21.445z"/><path d="M1086.281 890.32l-.801.426-2.203 1.496c-3.203 4.352-5.988 8.704-9.351 15.919-2.211 5.164-4.117 10.804-5.723 16.921-.058.614.137 1.235.586 1.868 3.09 1.453 5.789 4.113 8.106 7.98.57 1.649.859 3.375.867 5.176.16 1.312-.274 3.684-1.309 7.121-.758 2.27-2.957 5.016-6.597 8.242l-17.926 12.414c4.433 9.149 6.816 15.391 7.144 18.727.993 5.066 1.211 10.902.653 17.512-.102 1.816-.422 4.023-.961 6.621-.285 1.726-1.301 5.582-3.047 11.558l-9.375 23.555c-.606 1.715-.824 2.832-.656 3.351 1.433 3.067 3.664 5.641 6.695 7.723 5.922 3.656 11.059 5.981 15.406 6.977 14.285 3.707 25.375 4.062 33.266 1.062.09-.461-.028-.914-.348-1.363-4.23-5.613-6.941-9.809-8.125-12.578-2.047-5.942-2.82-10.375-2.324-13.293 1.144-5.781 3.32-11.922 6.527-18.41.813-1.653 4.625-6.883 11.446-15.692l2.156-3.429c5.441-8.727 8.68-14.754 9.711-18.079.179-.496.14-.765-.117-.804-3.762 1.035-6.438 1.453-8.028 1.258-1.879-.063-3.57-.469-5.121-1.219 2.891-5.656 5.922-12.75 9.094-21.274 1.527-4.425 2.344-8.074 2.449-10.949-.051-.676-.695-1.633-1.933-2.879-4.497-3.699-9.735-8.609-15.723-14.726-2.438-2.543-5.41-6.246-8.914-11.106-3.071-5.187-5.992-13.773-8.77-25.754z"/><path d="M1099.52 822.562l-1.559 3.067-1.883 4.566c-1.098 6.465-2.196 12.93-2.508 21.297-.492 6.989.156 18.641 1.949 34.953 2.028 11.34 8.801 25 20.317 40.985 4.148 4.328 6.339 6.336 6.582 6.023 7.957-11.668 19.316-15.508 34.082-11.519 4.656 1.336 8.929 3.722 12.82 7.168 1.945 1.722 3.793 3.711 5.543 5.961.996.797 3.41 4.765 7.234 11.914.387-3.93-.146-7.992-.794-12.192 0-1.008-.778-4.234-2.336-9.675-1.832-6.145-4.985-12.356-9.461-18.629-3.992-4.993-6.934-8.114-8.828-9.36-1.446-1.078-3.492-2.398-6.141-3.968-8.996-4.274-14.828-7.336-17.496-9.18-3.172-1.906-7.586-5.77-13.234-11.586-10.176-10.902-18.77-25.356-25.785-43.36z"/><path d="M1280.574 804.516l-1.664-.289c-23.308-4.567-44.355-4.2-63.137 1.113-4.062.648-11.375 3.805-21.945 9.465l-37.414 27.281c-5.414 1.852-11.336 2.848-17.766 2.992l-11.101-.164 2.012 5.125c4.546 5.113 9.092 10.226 16.171 15.324 3.539 2.551 7.711 5.098 12.515 7.641 4.805 2.547 10.242 5.086 16.313 7.621l9.582 3.804c.699.184 2.136-.496 4.32-2.039 8.172-6.957 13.328-11.172 15.461-12.636 2.402-1.77 5.953-3.852 10.652-6.25 13.891-6.418 26.758-10.829 38.606-13.223 13.461-2.824 28.875-4.965 46.242-6.414 8.684-.723 17.855-1.277 27.516-1.656 25.004-.649 40.589-.832 46.761-.551-5.386-4.016-11.941-7.457-19.664-10.332-7.582-3.11-19.332-7.395-35.25-12.86-7.086-2.558-18.308-5.171-33.664-7.839z"/><path d="M1089.402 632.746l-1.707 10.731c-2.316 13.816-4.785 25.656-7.406 35.511l-2.996 7.024c-1.348 4.433-2.738 8.375-4.164 11.82l-6.473 14.012c-1.437 3.074-4.594 8.707-9.472 16.902l-31.231 45.617c-.391.485-1.492 2.383-3.297 5.699-4.687 8.778-8.109 19.223-10.269 31.34-1.699 11.246-1.211 22.434 1.468 33.555l10.536-28.402c7.722-13.2 15.113-21.606 22.168-25.227 6.175-3.437 13.781-2.453 22.812 2.961 2.606 1.867 4.281 3.547 5.024 5.039 2.187 3.36 5.605 9.883 10.25 19.567.148.308.382.492.707.546 3.75-4.425 7.804-11.636 12.168-21.636 4.585-10.133 7.98-21.692 10.191-34.672 2.711-14.129 3.793-26.688 3.246-37.684-2.055-21.582-4.543-37.972-7.469-49.168-4.183-15.914-6.918-25.09-8.207-27.523-2.105-5.653-4.398-10.988-6.879-16.012z"/><path d="M1217.637 694.48l-4.313 8.012c-11.012 20.238-21.961 34.809-32.855 43.715-3.262 2.75-7.801 5.797-13.621 9.137-24.582 10.781-38.078 17.058-40.485 18.836-6.836 3.812-13.043 10.07-18.629 18.769l-1.656 3.75c-.918 2.555-1.469 5.227-1.648 8.012-.18 2.785.008 5.687.566 8.703.559 3.016 1.488 6.148 2.785 9.391l7.114 9.496 9.531-.629c6.254-.715 12.308-2.02 18.156-3.91 11.699-3.785 22.586-9.93 32.664-18.43l7.406-6.816c6.364-6.707 9.473-10.27 9.332-10.688 4.395-6.308 8.418-14.621 12.071-24.941 4.23-12.34 8.07-27.344 11.519-45.024l1.117-6.824c.625-4.324 1.02-8.199 1.176-11.625.16-3.426.082-6.406-.23-8.934z"/><path d="M1370.215 749.797l-9.375-1.332c-18.703-2.055-37.152-.492-55.352 4.691-6.918 1.024-24.152 8.52-51.711 22.48 18.461-2.106 39.051-.098 61.766 6.019 18 5.321 35.359 13.813 52.074 25.481 16.965 11.984 31.242 25.855 42.844 41.609 22.332 36.32 37.977 61.016 44.93 74.082 4.05 6.449 8.968 12.258 14.75 17.434 12.41 12.496 23.242 21.383 32.496 26.664 11.801 6.078 24.664 10.363 38.586 12.859l11.285 1.485c7.597.687 15.344.761 23.234.23 7.895-.531 15.934-1.672 24.125-3.422 3.91-.113 16.528-4.105 37.852-11.976 17.793-7.301 26.519-12.235 26.172-14.805-.188-.485-.789-.867-1.801-1.141-10.656-2.25-20.727-4.781-30.207-7.601-9.481-2.817-18.375-5.918-26.68-9.309l-12.019-5.293c-7.715-3.676-14.844-7.633-21.387-11.875-14-9.82-23.809-18.105-29.43-24.855l-59.547-74.868c-13.175-13.886-22.265-22.722-27.261-26.507-4.219-5.235-19.059-14.082-44.524-26.539-14.414-6.555-28.691-11.055-42.82-13.512z"/><path d="M1321.242 659.812l-.054-.007c-17.793 8.457-33.547 19.445-47.266 32.976-6.965 6.781-13.527 14.211-19.684 22.293l-8.937 12.614c-5.758 8.73-11.11 18.117-16.063 28.148 17.059-8.695 26.168-13.156 27.332-13.391 5.266-2.183 10.782-4.05 16.551-5.593 1.727-.911 11.789-2.762 30.188-5.555 12.695-1.859 22.32-2.801 28.871-2.82 3.961-.61 7.027-1.266 9.199-1.973 9.719-2.781 17.012-6.934 21.867-12.461 7.578-8.508 15.262-22.074 23.055-40.699-6.961 5.207-13.578 8.789-19.86 10.734-8.117 2.367-12.82 3.613-14.109 3.734-12.359.825-19.414 1.454-21.164 1.891-5.629 1.09-11.613 2.809-17.957 5.164-6.988 2.621-14.406 7.02-22.246 13.195 2.289-4.906 5.543-10.784 9.766-17.534 8.063-12.445 14.86-22.324 20.391-29.637.43-.601.469-.976.121-1.129z"/><path d="M1540.336 640.434l-1.086-.176c-12.895-2.055-31.211-.418-54.953 4.906-6.567 1.652-12.84 3.637-18.817 5.949-14.429 6.356-22.73 10.563-24.91 12.625-13.527 9.313-20.968 14.942-22.328 16.895-4.121 3.808-7.68 7.656-10.68 11.539-6.515 9.773-9.75 15.683-9.707 17.726l-5.55 22.481 1.257-1.84c6.196-3.578 12.392-7.156 23.521-12.469 4.734-1.894 9.871-3.468 15.414-4.718 10.621-2.5 23.781-3.696 39.48-3.578 4.196-.141 14.828 1.523 31.903 4.992 7.539 1.679 26.625 7.043 57.257 16.086 2.235.578 6.036 1.379 11.407 2.402 15.019 2.902 29.254 4.305 42.695 4.211 14.969-.523 27.453-2.105 37.453-4.75 2.871-.305 11.008-3 24.418-8.082 5.309-2.242 10.539-4.777 15.691-7.613.153-.582-.574-.965-2.175-1.157-13.555-.195-24.52-.863-32.903-2-1.898-.207-8.015-1.824-18.355-4.847-15.86-6.547-34.457-15.981-55.793-28.301-9.496-3.719-16.867-6.039-22.117-6.965-22.176-4.797-45.407-5.09-69.688-.875 2.242-3.57 4.981-6.902 8.215-10 1-.152 6.977-4.261 17.938-10.632 9.465-4.766 20.925-8.582 34.382-11.441-.007-.739-1.933-1.489-5.769-2.254z"/><path d="M1669.34 760.609l-1.735-.281c-7.953-1.019-14.363-1.062-19.226-.121-9.481 3.727-19.559 9.813-30.234 18.258-3.446 1.558-6.833 2.285-10.168 2.176-3.625-.082-8.883-1.633-15.782-4.645-29.062-16.684-46.429-26.168-52.105-28.445-10.684-4.727-20.902-7.918-30.664-9.574-13.684-2.379-26.727-2.336-39.133.121-2.699-.321-16.254 4.355-40.664 14.027 10.945 1.445 20.387 3.449 28.324 6.004 4.223 1.309 8.328 2.789 12.316 4.441 9.753 4.434 15.461 7.297 17.126 8.594 13.054 8.117 24.687 16.445 34.902 24.977l62.98 57.375c2.813 2.804 9.7 8.113 20.653 15.925 24.472 16.684 48.265 27.266 71.382 31.747 19.661 3.878 39.661 1.378 60-7.5 19.395-8.985 31.946-21.266 37.641-36.852-.234-.57-.793-.77-1.676-.594-13.851 4.52-24.316 7.164-31.39 7.934-8.817 1.215-18.516.984-29.098-1.313-2.152-.062-8.277-1.742-18.383-5.039-4-1.492-7.949-3.234-11.84-5.222-7.785-3.981-15.351-8.953-22.695-14.922-8.996-9.75-10.715-17.727-5.156-23.934 2.777-4.808 11.133-7.226 25.062-7.258 9.75 1.032 18.828 4.883 27.235 11.547 2.398 1.871 4.926 4.766 7.582 8.684 2.394 3.348 5.011 8.777 7.847 16.281.332.547.582.586.743.121 3.07-23.062-.696-41.918-11.297-56.57l-5.871-6.977c-5.871-4.414-10.922-8.367-16.735-11.847-5.07-3.235-12.242-5.813-21.519-7.735z"/><path d="M1465.582 954.969l1.813 14.996c6.386 39.66 25.179 76.633 56.378 110.914 29.348 34.937 63.375 59.297 102.082 73.082 28.157 9.301 41.547 12.004 40.176 8.109-21.301-13.129-37.472-26.547-48.523-40.25-5.528-6.851-9.774-13.773-12.738-20.769-2.961-6.996-4.645-14.067-5.051-21.207l.359-10.762c5.192-10.547 8.555-16.176 10.082-16.894 2.551-2.887 5.305-5.196 8.262-6.922 5.531-3.508 12.656-4.59 21.375-3.242 7.969 1.946 14.75 6.559 20.344 13.84 1.238 1.864 2.238 4.223 3.004 7.078 1.511 6.793 2.289 12.426 2.324 16.903.332.937.687 1.304 1.066 1.105 10.52-14.324 14.496-28.148 11.934-41.469-2.457-10.062-6.164-17.644-11.129-22.742-.719-1.176-3.758-3.648-9.117-7.426-4.493-2.777-9.575-4.859-15.246-6.242-7.883-2.008-16.012-2.445-24.379-1.312l-46.383 11.601c-4.914.586-7.805.864-8.676.832-5.57.282-10.723-.004-15.449-.824-7.645-1-14.504-2.828-20.586-5.484-10.305-4.305-22.395-11.43-36.27-21.383z"/><path d="M1809.547 892.863l-20.867 11.563c-26.278 16.074-46.352 35.074-60.231 56.351l-9.246 16.449-6.922 17.426-4.597 18.402-2.274 19.375c-.531 15.61 2.223 37.524 8.27 65.747 2.793 10.933 13.699 37.086 55.137 78.461 4.555 13.907 7.434 26.426 8.711 37.555 1.864 14.309 2.161 28.809.891 43.5-1.141 14.735-2.164 22.129-3.582 29.571l-2.418 11.199c-1.809 7.492-4.008 15.027-6.598 22.613 17.902-15.187 32.563-32.453 44.074-51.785 12.461-22.195 19.586-40.746 21.383-55.648 1.808-15.969 2.027-29.817.664-41.539l-4.664-26.364c-11.153-43.082-17.114-67.441-17.887-73.074-3.199-18.773-4.86-37.332-4.985-55.676.2-12.265.582-19.945 1.157-23.039 1.175-11.039 3.242-23.144 6.191-36.32l2.379-10.082z"/><path d="M1449.262 1088.234l-3.477-.55c-10.219-2.235-26.41-1.258-48.578 2.933-12.988 2.574-21.551 6.496-25.684 11.77.637.633 1.45 1.086 2.446 1.355 13.711 2.547 25.031 5.301 33.961 8.262 13.433 5.406 21.691 9.262 24.773 11.57 9.891 8.235 16.754 14.524 20.594 18.871 31.308 44.395 56.191 74.727 74.648 90.996 4.375 3.825 8.922 7.383 13.637 10.676 4.719 3.297 9.606 6.324 14.668 9.086l7.719 3.945 9.336 4.786c15.285 3.937 27.52 4.133 42.758 3.481 49.293 7.984 86.047-.00 110.262-23.953 3.812-3.973 6.707-8.332 8.683-13.082 2.137-1.887 3.036-9.883 2.7-24.012-1.192-10.543-6.778-25.195-16.758-43.957-.715 8.238-2.367 15.426-4.953 21.559l-4.59 8.414c-4.527 5.082-8.992 9.113-14.399 12.094l-8.808 3.683c-6.344 1.93-13.629 2.809-21.848 2.633l-13.035-1.047c-4.508-.953-8.91-2.098-13.211-3.426-17.683-5.715-32.726-13.668-45.133-23.859-9.789-7.594-16.465-13.035-20.031-16.332-19.551-20.43-34.488-35.371-44.812-44.828-3.5-3.77-11.719-10.168-24.653-19.207-4.207-3.043-9.109-5.871-11.723-8.484-8.939-3.336-18.029-5.852-27.275-7.54z"/><path d="M1824.289 1299.469l-.234-.016c-.637.039-1.383.645-2.235 1.824-3.57 13.7-9.781 29.864-18.64 48.489-5.102 9.593-10.309 16.523-15.621 20.781-13.844 9.808-33.223 14.207-58.141 13.203-14.57-.2082-23.582-2.466-27.039-4.899-6.176-2.758-12.242-6.34-18.195-10.743-14.692-12.445-23.372-20.902-26.039-25.367l-42.293-58.711-3.914 6.828c-9.708 18.016-11.348 45.008-4.922 80.977 2.113 8.644 5.746 19.039 10.89 31.184l36.828 73.777c5.907 15.289 9.629 29.051 11.172 41.277 1.789 17.668 1.403 32.563-1.156 44.696-1.199 6.816-2.863 13.695-4.992 20.632-6.133 17.453-10.371 27.996-12.711 31.629 62.765-49.976 105.262-93.168 127.476-129.574 19.457-33.066 34.184-67.844 44.184-104.336 2.941-11.496 5.102-22.734 6.473-33.719l1.468-15.985c.942-18.387.157-28.308-2.359-29.773z"/><path d="M1882.766 761.723l.882 9.316c.942 12.477.918 25.164-.066 38.063-.492 6.445-1.227 12.949-2.199 19.504-.106 1.942-2.188 13.16-6.258 33.652l-2.648 12.019-3.993 15.446c-.843 3.617-7.617 25.472-20.324 65.554-2.84 10.035-4.742 16.965-5.699 20.793-5.481 21.141-9 38.051-10.559 50.727-2.488 16.863-3.957 32.93-4.41 48.199.028 11.668.969 27.055 2.824 46.168 3.266 31.981 7.614 65.703 13.047 101.172 4.485 28.016 8.16 42.859 11.02 44.539l9.137-41.777c-.149-6.461-.102-12.797.14-19.012-.121-3.262.672-12.297 2.387-27.105 1.246-10.289 4.062-22.844 8.445-37.672 2.485-8.329 5.531-16.743 9.145-25.25 18.929-39.297 30.054-62.926 33.371-70.879 6.777-15.235 12.668-29.36 17.672-42.368 6.402-18.398 10.687-34.898 12.851-49.5 3.817-34.371 1.313-65.195-7.508-92.472-13.976-33.981-33.062-67.02-57.257-99.117z"/><path d="M1396.922 1118.164l-2.535-.309c-2.149-.503-8.321-.023-18.52 1.442-8.25 1.539-13.512 2.621-15.781 3.246l-5.449 1.82c-14.231 5.137-26.075 14.5-35.532 24.098-8.917 10.504-14.445 17.93-16.585 22.285-3.133 5-6.106 11.649-8.918 19.938-2.395 6.961-3.985 14.8-4.766 23.519-.203 4.945-.047 10.59.469 16.93.043 1.539.402 2.472 1.082 2.793l6.758-.176c6.063-9.848 9.688-15.414 10.867-16.699 2.301-2.828 3.485-4.113 3.547-3.856 3.727-2.566 6.34-4.047 7.836-4.437 1.449-.754 5.168-1.274 11.156-1.563.86-.273 1.617-.773 2.266-1.504 2.613-7.035 5.488-13.742 8.625-20.125l4.902-9.324c6.801-12.109 14.645-22.906 23.539-32.3984.446-4.746 9.153-9.164 14.125-13.254l23.028-32.141c-1.371-.668-2.719-1.094-4.051-1.285z"/><path d="M1422.73 1130.707l-9.406 1.617c-6.144 1.395-12.027 3.418-17.66 6.078l-8.25 4.457-7.867 5.407-7.485 6.351-7.097 7.301-6.711 8.25c-5.231 7.359-8.438 12.258-9.617 14.691l-2.875 5.789c-1.778 3.954-3.274 8.098-4.492 12.434-1.219 4.336-2.157 8.863-2.817 13.586l-.785 7.223-.363 7.507.054 7.801c.094.153.188.219.282.192 3.039-6.141 5.375-10.321 7.011-12.543.95-1.555 2.762-3.434 5.438-5.637 2.918-2.938 9.105-5.008 18.57-6.211 1.195-.477 2.27-1.281 3.219-2.402.691-.719 1.711-2.516 3.055-5.3994-3.789-11.121 7.371-20.465 10.738-28.027 5.207-10.84 8.332-16.82 9.375-17.945 3.41-5.399 7.668-11.016 12.781-16.852l14.902-13.668z"/><path d="M1370.18 1094.438l-8.75-.301c-5.852.047-11.746.597-17.68 1.652-5.938 1.055-11.91 2.613-17.926 4.676l-9.054 3.465c-6.059 2.566-12.157 5.632-18.297 9.199l-9.239 5.73c-3.746 2.782-7.265 5.633-10.55 8.547l-7.008 6.668c-14.032 15.551-21.922 25.813-23.801 30.781 7.676-1.656 15.09-2.246 22.234-1.777 3.715.418 9.992 2.324 18.824 5.711.996-2.035 4.558-7.312 10.7-15.84 5.043-6.629 10.476-12.715 16.297-18.25 2.91-2.769 5.918-5.402 9.019-7.898l45.102-32.363z"/><path d="M1436.359 1144.887l-.363-.051c-2.285.035-5.273 1.004-8.957 2.902-7.266 3.934-12.676 7.399-16.234 10.395-1.223 1.086-1.715 1.871-1.477 2.363.574 1.25 1.828 2.934 3.766 5.047l10.984 11.906 11.027 10.739 11.075 9.566 11.121 8.402 11.168 7.235 11.219 6.066 11.261 4.898 11.309 3.727 12.609 2.773-12.254-8.304c-11.058-10.715-19.402-19.199-25.031-25.453-2.621-2.723-6.301-7.352-11.039-13.887.059.43-6.172-9.254-18.684-29.043-3.66-5.051-7.492-8.145-11.5-9.281z"/><path d="M1509.496 1299.918l-4.648-.699c-13.2-1.715-32.887-2.254-59.059-1.614-9.594.657-19.187 1.946-28.785 3.856l-14.399 3.336c-28.804 7.609-57.636 20.848-86.492 39.715 18.016-1.137 45.024 1.09 81.028 6.683 7.183 1.25 14.257 2.985 21.23 5.203 5.285 1.395 13.836 4.93 25.645 10.614 4.484 2.191 9.257 4.843 14.02 7.5z"/></g></svg>
                            </div>
                        </div>
                    </div>

                    <div id="bank-card-edit-form" className="hidden flex flex-col gap-3 mb-5 p-4 border border-blue-100 rounded-2xl bg-blue-50/30">
                        <div>
                            <label className="text-[11px] font-bold text-gray-400 block mb-1">Số tài khoản</label>
                            <input type="text" id="input-account-number" value="0987 6543 2626" className="w-full text-sm font-mono font-bold border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 outline-none transition"/>
                        </div>
                        <div>
                            <label className="text-[11px] font-bold text-gray-400 block mb-1">Tên chủ tài khoản</label>
                            <input type="text" id="input-account-name" value="NGUYEN VAN A" className="w-full text-sm font-bold uppercase border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 outline-none transition"/>
                        </div>
                        <div>
                            <label className="text-[11px] font-bold text-gray-400 block mb-1">Chi nhánh</label>
                            <input type="text" id="input-branch" value="Hồ Chí Minh" className="w-full text-xs font-bold border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 outline-none transition"/>
                        </div>
                    </div>

                    <div id="bank-info-meta" className="flex flex-col gap-3 mb-6">
                        <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                            <span className="text-[11px] font-bold text-gray-400">Chi nhánh</span>
                            <span id="display-branch" className="text-xs font-bold text-[#3D3333]">Hồ Chí Minh</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                            <span className="text-[11px] font-bold text-gray-400">Trạng thái</span>
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Đang hoạt động</span>
                        </div>
                    </div>

                    <div id="group-actions-default" className="flex gap-3">
                        <button id="btn-unlink-bank" className="flex-1 bg-[#F6F1F1] text-gray-500 font-extrabold text-xs py-3.5 rounded-xl hover:bg-rose-50 hover:text-rose-500 active:scale-[0.98] transition">
                            Hủy liên kết
                        </button>
                        <button className="close-modal flex-1 bg-[#3D3333] text-white font-extrabold text-xs py-3.5 rounded-xl hover:bg-black active:scale-[0.98] transition shadow-md shadow-gray-900/20">
                            Đóng
                        </button>
                    </div>

                    <div id="group-actions-editing" className="flex gap-3 hidden">
                        <button id="btn-cancel-edit" className="flex-1 bg-[#F6F1F1] text-gray-500 font-extrabold text-xs py-3.5 rounded-xl hover:bg-gray-200 active:scale-[0.98] transition">
                            Hủy bỏ
                        </button>
                        <button id="btn-save-bank" className="flex-1 bg-blue-600 text-white font-extrabold text-xs py-3.5 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition shadow-md shadow-blue-600/20">
                            Lưu thay đổi
                        </button>
                    </div>
                </div>
            </div>

            {/* POPUP SHOW CHUYỂN KHOẢN */}
            {popupSepay && (
                <div id="sepay-modal" className={`fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center transition-all duration-300 ${popupSepay ? "block" : "hidden"}`}>
                    <div className="bg-white rounded-3xl p-6 w-[90%] max-w-sm shadow-2xl transform scale-95 transition-transform duration-300 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-black text-base text-emerald-600"><i className="fa-solid fa-qrcode mr-2"></i> Quét mã QR để nạp tiền</h3>
                            <button className="close-modal text-gray-400 hover:text-rose-500 transition" onClick={() => setPopupSepay(false)}><i className="fa-solid fa-xmark text-xl"></i></button> 
                        </div>
                        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-4 flex flex-col items-center justify-center mb-4">
                            <div id="qrBox" className="w-36 h-36 bg-white border border-gray-100 rounded-xl shadow-inner flex flex-col items-center justify-center relative overflow-hidden mb-2">
                                <a id="qrLink" href="#" target="_blank" className="flex items-center justify-center w-full h-full relative z-10 pointer-events-none">
                                    <img src={`https://img.vietqr.io/image/MB-0359832905-compact.png?amount=${amount}&addInfo=${sepayContent}}`} alt="Mã QR thanh toán" className="w-full h-full object-contain"/>
                                </a>

                                <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent animate-pulse"></div>
                            </div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Mở App ngân hàng quét QR tự động điền</p>
                        </div>
                        <div className="flex flex-col gap-2.5 bg-[#F6F1F1] rounded-2xl p-4 text-xs mb-5">
                            <div className="flex justify-between items-center border-b border-gray-200/60 pb-1.5">
                                <span className="font-bold text-gray-400">Ngân hàng:</span>
                                <span className="font-black text-[#3D3333]">MBBANK</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-200/60 pb-1.5">
                                <span className="font-bold text-gray-400">Số tài khoản:</span>
                                <span className="font-mono font-black text-[#3D3333] text-sm">0359832905</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-200/60 pb-1.5">
                                <span className="font-bold text-gray-400">Chủ tài khoản:</span>
                                <span className="font-black text-[#3D3333] uppercase">DAO CAO NGUYEN</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-200/60 pb-1.5">
                                <span className="font-bold text-gray-400" >Số tiền:</span>
                                <span id="sepay-render-amount" className="font-black text-rose-600 text-sm">{amount || "000.000"}đ</span>
                            </div>
                            <div className="flex flex-col gap-1 pt-0.5">
                                <span className="font-bold text-gray-400">Nội dung chuyển khoản bắt buộc:</span>
                                <div className="flex items-center justify-between bg-white border border-emerald-200 px-3 py-2 rounded-xl mt-1">
                                    <span id="sepay-render-content" className="font-mono font-black text-emerald-600 text-sm tracking-wide">{sepayContent || ""}</span>
                                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded cursor-pointer hover:bg-emerald-100 transition" onClick={() => navigator.clipboard.writeText(document.getElementById("sepay-render-content")?.textContent || "").then(() => alert("Đã sao chép nội dung!")).catch(() => alert("Sao chép thất bại!"))}>Copy</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-center text-gray-500 text-xs font-semibold py-3.5 italic">
                            Chuyển khoản sẽ tự động duyệt trong vài phút tới, vui lòng không đóng thẻ này ...
                        </p>
                    </div>
                </div>
            )}
            
        </div>  
    );
}