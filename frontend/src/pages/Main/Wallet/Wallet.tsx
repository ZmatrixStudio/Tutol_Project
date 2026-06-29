import { useEffect } from "react";

export default function WalletPage(){
    useEffect(() => {document.title = "Ví tiền của tôi"})
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-[#C97474] to-[#b56363] p-5 rounded-2xl text-white shadow-md shadow-rose-900/5 flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute -right-4 -bottom-4 text-white/10 text-7xl font-black transform -rotate-12 transition-transform duration-500 group-hover:scale-110">
                        <i className="fa-solid fa-wallet"></i>
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-white/80">Số dư khả dụng</span>
                    <span id="available-balance" className="text-2xl md:text-3xl font-black mt-3">1.250.000đ</span>
                    <span className="text-[10px] text-rose-100 font-medium mt-2 flex items-center gap-1"><i className="fa-solid fa-shield-check"></i> Sẵn sàng thanh toán lớp học</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col justify-between relative overflow-hidden group">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Số dư tạm giữ (Đóng băng)</span>
                    <span id="frozen-balance" className="text-2xl md:text-3xl font-black text-[#3D3333] mt-3">600.000đ</span>
                    <span className="text-[10px] text-amber-500 font-bold mt-2 flex items-center gap-1" title="Hệ thống giữ để đảm bảo gia sư dạy xong mới giải ngân">
                        <i className="fa-solid fa-clock"></i> Đang giữ cho lịch học hôm nay
                    </span>
                </div>
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
                            <button id="btn-deposit" 
                                    className="relative bg-[#C97474] text-white font-extrabold text-xs py-3.5 px-6 
                                        border-4 border-black rounded-none
                                        shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
                                        transition-all duration-75
                                        hover:bg-[#b56363] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                                        active:translate-x-[4px] active:translate-y-[4px] active:shadow-none
                                        flex flex-col items-center justify-center gap-2 select-none">
                                <i className="fa-solid fa-arrow-down-long text-base"></i> 
                                <span className="tracking-wider">NẠP TIỀN</span>
                            </button>

                            <button id="btn-withdraw" 
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

                    <div className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100 flex flex-col gap-4">            
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
        </div>

        
    );
}