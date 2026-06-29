import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

export default function Header(){
    const [showNoti, setShowNoti] = useState(false);
    const [showSetting, setShowSetting] = useState(false);
    const [hasUnread] = useState(true);

    const menuItems = [
        {
            path: "/home",
            label: "Trang Chủ",
            icon: "fa-house",
        },
        {
            path: "/history",
            label: "Lịch Sử",
            icon: "fa-clock-rotate-left",
        },
        {
            path: "/discussion",
            label: "Thảo Luận",
            icon: "fa-comments",
        },
        {
            path: "/wallet",
            label: "Ví Tiền",
            icon: "fa-wallet",
        },
    ];
    
    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {
        const handleClickOutside = () => { setShowNoti(false); setShowSetting(false); };
        document.addEventListener("click", handleClickOutside);
        return () => {document.removeEventListener("click", handleClickOutside);};
    }, []);


    return (
        <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.02)] border-b border-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                
                <h1 className="group-logo text-xl md:text-2xl font-black text-[#C97474] tracking-wider cursor-pointer hover:opacity-85 transition duration-300 flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#C97474] flex items-center justify-center text-white shadow-sm shadow-rose-200">
                        <i className="fa-solid fa-graduation-cap text-lg animate-wiggle-loop"></i>
                    </div>
                    
                    <span className="hidden sm:inline-block font-black text-lg md:text-xl" style={{ fontFamily: "Roboto, sans-serif" }}>TÌM GIA SƯ NGAY</span>
                </h1>

                <nav className="hidden md:flex items-center gap-1 text-sm font-bold text-[#5A4B4A]">
                    {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;

                    return (
                        <button key={item.path} onClick={() => navigate(item.path)} className="relative flex items-center gap-2 px-4 py-2 rounded-xl overflow-hidden">
                            {isActive && (
                                <motion.div layoutId="activeTab" className="absolute inset-0 bg-[#C97474]/10 rounded-xl" transition={{ type: "spring", stiffness: 400, damping: 30 }}/>
                            )}

                            <i className={`fa-solid ${item.icon} relative z-10 transition duration-300 ${ isActive ? "text-[#C97474]" : "text-gray-400"}`}/>

                            <span className={`relative z-10 transition duration-300 ${ isActive ? "text-[#C97474]" : "text-[#5A4B4A]" }`}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
                </nav>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <button onClick={(e) => {e.stopPropagation(); setShowSetting(false); setShowNoti(prev => !prev)}} id="notiBtn" className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-100 text-gray-500 hover:text-[#C97474] hover:bg-white transition duration-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C97474]/20">
                            <i className={`fa-solid fa-bell text-lg ${ hasUnread && !showNoti ? "animate-bell-swing" : "" }`}></i>
                            
                            {hasUnread && (
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                            )}
                        </button>

                        {showNoti && (
                        <div id="notiDropdown" className="notification-menu absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.08)] z-50 overflow-hidden">
                            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                                <h4 className="text-xs font-black text-[#3D3333] tracking-wide uppercase">Thông báo mới nhận</h4>
                                <button id="markAllRead" className="text-[10px] font-bold text-[#C97474] hover:underline focus:outline-none">Đánh dấu đã đọc</button>
                            </div>
                            
                            <div className="max-h-80 overflow-y-auto p-2 flex flex-col gap-1">
                                
                                <div className="flex gap-3 p-3 rounded-xl bg-[#C97474]/5 border border-[#C97474]/10 cursor-pointer hover:bg-[#C97474]/10 transition duration-200 relative group">
                                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 flex-shrink-0">
                                        <i className="fa-solid fa-circle-check text-sm"></i>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-[#3D3333] leading-snug break-words">Gia sư <span className="text-[#C97474]">Trần Hoàng Bách</span> đã chấp nhận yêu cầu kết nối học IELTS của bạn.</p>
                                        <span className="text-[10px] font-medium text-gray-400 mt-1 block">Vừa xong</span>
                                    </div>
                                    <span className="w-1.5 h-1.5 bg-[#C97474] rounded-full absolute right-3 top-1/2 -translate-y-1/2"></span>
                                </div>

                                <div className="flex gap-3 p-3 rounded-xl bg-[#C97474]/5 border border-[#C97474]/10 cursor-pointer hover:bg-[#C97474]/10 transition duration-200 relative group">
                                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 flex-shrink-0">
                                        <i className="fa-solid fa-wallet text-sm"></i>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-[#3D3333] leading-snug break-words">Tài khoản của bạn đã được cộng <span className="text-emerald-600">+500.000đ</span> từ ngân hàng.</p>
                                        <span className="text-[10px] font-medium text-gray-400 mt-1 block">25 phút trước</span>
                                    </div>
                                    <span className="w-1.5 h-1.5 bg-[#C97474] rounded-full absolute right-3 top-1/2 -translate-y-1/2"></span>
                                </div>

                                <div className="flex gap-3 p-3 rounded-xl bg-white hover:bg-gray-50 border border-transparent cursor-pointer transition duration-200 group">
                                    <div className="w-9 h-9 rounded-xl bg-rose-500/10 flex items-center justify-center text-[#C97474]/80 flex-shrink-0">
                                        <i className="fa-solid fa-heart text-sm"></i>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-gray-500 leading-snug break-words">Hệ thống gợi ý 3 gia sư Vật Lý mới phù hợp với lớp học của bạn.</p>
                                        <span className="text-[10px] font-medium text-gray-400 mt-1 block">2 giờ trước</span>
                                    </div>
                                </div>

                            </div>

                            <div className="p-2.5 bg-gray-50 border-t border-gray-100 text-center">
                                <a href="#notifications" className="block w-full py-2 text-xs font-bold text-gray-500 hover:text-[#C97474] transition">Xem tất cả thông báo</a>
                            </div>
                        </div>
                    )}
                    </div>
                    
                    <div className="relative">
                        <button onClick={(e) => {e.stopPropagation(); setShowNoti(false); setShowSetting(prev => !prev)}} id="avatarBtn" className="relative group overflow-hidden rounded-xl p-0.5 focus:outline-none ring-2 ring-transparent focus:ring-[#C97474] transition duration-300 shadow-sm flex items-center">
                            <img 
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
                            alt="Avatar" 
                            className="w-10 h-10 rounded-xl object-cover border-2 border-white group-hover:scale-105 transition duration-300" 
                            />
                        </button>

                        {showSetting && (
                        <div id="settingsDropdown" className="dropdown-menu absolute right-0 mt-3 w-64 bg-white rounded-2xl border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.08)] z-50 overflow-hidden">
                            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
                                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Avatar" className="w-9 h-9 rounded-lg object-cover"/>
                                <div className="min-w-0">
                                    <p className="text-xs font-black text-[#3D3333] truncate">Đào Cao Nguyên</p>
                                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Tài khoản Học Viên</span>
                                </div>
                            </div>
                            
                            <div className="p-2 flex flex-col gap-0.5">
                                <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-gray-500 hover:text-[#C97474] hover:bg-[#C97474]/5 rounded-xl transition duration-200">
                                    <i className="fa-regular fa-user text-sm w-4"></i> Hồ sơ cá nhân
                                </a>
                                <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-gray-500 hover:text-[#C97474] hover:bg-[#C97474]/5 rounded-xl transition duration-200">
                                    <i className="fa-solid fa-sliders text-sm w-4"></i> Cài đặt tài khoản
                                </a>
                                <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-gray-500 hover:text-[#C97474] hover:bg-[#C97474]/5 rounded-xl transition duration-200">
                                    <i className="fa-regular fa-calendar-minus text-sm w-4"></i> Lịch học của tôi
                                </a>
                                <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-gray-500 hover:text-[#C97474] hover:bg-[#C97474]/5 rounded-xl transition duration-200">
                                    <i className="fa-solid fa-shield-halved text-sm w-4"></i> Bảo mật & Mật khẩu
                                </a>
                                <hr className="border-gray-100 my-1"/>
                                <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition duration-200">
                                    <i className="fa-solid fa-arrow-right-from-bracket text-sm w-4"></i> Đăng xuất
                                </a>
                            </div>
                        </div>
                    )}
                    </div>
                </div>
            </div>
        </header>
    );
}