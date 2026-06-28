export default function Chat(){
    
    return (
        <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end">
        
            <div id="liveChatWindow" className="hidden w-[320px] sm:w-[360px] h-[450px] bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-gray-100 flex flex-col overflow-hidden mb-3 transition-all duration-300 origin-bottom-right scale-95 opacity-0">
                
                <div className="bg-[#C97474] p-4 text-white flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
                                <i className="fa-solid fa-graduation-cap text-base animate-pulse"></i>
                            </div>
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#C97474] rounded-full"></span>
                        </div>
                        <div>
                            <h4 className="text-xs font-black tracking-wider uppercase">Trợ lý Zmatrix</h4>
                            <p className="text-[10px] text-rose-100 font-semibold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Thường trả lời trong vài phút
                            </p>
                        </div>
                    </div>
                    <button id="closeChatBtn" className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center transition focus:outline-none">
                        <i className="fa-solid fa-minus text-sm"></i>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 bg-gray-50/60 flex flex-col gap-3" id="chatMessageContainer">
                    
                    <div className="flex gap-2.5 max-w-[85%]">
                        <div className="w-7 h-7 rounded-lg bg-[#C97474]/10 text-[#C97474] flex items-center justify-center flex-shrink-0 text-xs font-bold">
                            ZS
                        </div>
                        <div>
                            <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm">
                                <p className="text-xs font-medium text-[#3D3333] leading-relaxed">Xin chào! Cảm ơn bạn đã ghé thăm nền tảng **Tìm Gia Sư Ngay** 👋</p>
                            </div>
                            <span className="text-[9px] text-gray-400 font-medium mt-1 block px-1">Vừa xong</span>
                        </div>
                    </div>

                    <div className="flex gap-2.5 max-w-[85%]">
                        <div className="w-7 h-7 rounded-lg bg-[#C97474]/10 text-[#C97474] flex items-center justify-center flex-shrink-0 text-xs font-bold">
                            ZS
                        </div>
                        <div>
                            <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm">
                                <p className="text-xs font-medium text-[#3D3333] leading-relaxed">Bạn cần tư vấn tìm gia sư hay muốn đăng ký làm gia sư của Zmatrix ạ?</p>
                            </div>
                            <span className="text-[9px] text-gray-400 font-medium mt-1 block px-1">Vừa xong</span>
                        </div>
                    </div>

                    </div>

                <form id="chatForm" className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
                    <input 
                    type="text" 
                    id="chatInput" 
                    placeholder="Nhập tin nhắn..." 
                    autoComplete="off" 
                    className="flex-1 bg-gray-50 border border-gray-200 text-xs font-semibold rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#C97474] focus:bg-white transition" 
                    />
                    <button type="submit" className="w-9 h-9 bg-[#C97474] text-white rounded-xl flex items-center justify-center hover:bg-[#b56363] active:scale-95 transition focus:outline-none flex-shrink-0">
                        <i className="fa-solid fa-paper-plane text-xs"></i>
                    </button>
                </form>
            </div>

            <button id="toggleChatBtn" className="w-12 h-12 md:w-14 md:h-14 bg-[#C97474] text-white rounded-2xl flex items-center justify-center shadow-[0_4px_24px_rgba(201,116,116,0.4)] hover:bg-[#b56363] hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none group relative">
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#C97474] rounded-full animate-ping"></span>
                <i className="fa-solid fa-comments text-lg md:text-xl group-hover:rotate-6 transition duration-300"></i>
            </button>
        </div>
    );
}