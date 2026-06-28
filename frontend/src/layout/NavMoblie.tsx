import { useNavigate } from "react-router-dom";

export default function NavMobile(){
    const navigate = useNavigate();
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-t border-gray-100 shadow-[0_-4px_24px_rgba(0,0,0,0.04)] md:hidden">
            <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
                <button onClick={() => navigate("/home")} className="spa-nav-btn flex flex-col items-center justify-center gap-1 text-[#C97474] flex-1 min-w-0">
                    <i className="fa-solid fa-house text-base"></i>
                    <span className="text-[10px] font-bold tracking-wide">Trang Chủ</span>
                </button>
                <button onClick={() => navigate("/history")}className="spa-nav-btn flex flex-col items-center justify-center gap-1 text-gray-400 flex-1 min-w-0 group">
                    <i className="fa-solid fa-clock-rotate-left text-base text-gray-400 group-hover:text-[#C97474] transition duration-300"></i>
                    <span className="text-[10px] font-bold tracking-wide">Lịch Sử</span>
                </button>
                <button onClick={() => navigate("/discussion")}className="spa-nav-btn flex flex-col items-center justify-center gap-1 text-gray-400 flex-1 min-w-0 group">
                    <i className="fa-solid fa-comments text-base text-gray-400 group-hover:text-[#C97474] transition duration-300"></i>
                    <span className="text-[10px] font-bold tracking-wide">Thảo Luận</span>
                </button>
                <button onClick={() => navigate("/wallet")}className="spa-nav-btn flex flex-col items-center justify-center gap-1 text-gray-400 flex-1 min-w-0 group">
                    <i className="fa-solid fa-wallet text-base text-gray-400 group-hover:text-[#C97474] transition duration-300"></i>
                    <span className="text-[10px] font-bold tracking-wide">Ví Tiền</span>
                </button>
            </div>
        </div>
    );
}