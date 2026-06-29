import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

export default function NavMobile(){
    const navigate = useNavigate();
    const location = useLocation();

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

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-t border-gray-100 shadow-[0_-4px_24px_rgba(0,0,0,0.04)] md:hidden">
            <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button key={item.path} onClick={() => navigate(item.path)} className="spa-nav-btn flex flex-col items-center justify-center gap-1 text-gray-400 flex-1 min-w-0 group">
                            <i className={`fa-solid ${item.icon} text-base text-gray-400 group-hover:text-[#C97474] transition duration-300`}></i>
                            <span className={`text-[10px] font-bold tracking-wide ${isActive ? "text-[#C97474]" : "text-gray-400"}`}>{item.label}</span>
                            {isActive && (
                                <motion.div
                                    layoutId="mobileUnderline"
                                    className="absolute bottom-0 w-8 h-1 bg-[#C97474] rounded-full"
                                    transition={{
                                        type: "spring",
                                        stiffness: 500,
                                        damping: 35,
                                    }}
                                />
                            )}
                        </button>
                    );
                    
                })}
                
            </div>
        </div>
    );
}