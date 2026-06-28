import React, { useState } from "react";

export default function Chat(){
    const [openChatBot, setOpenChatBot] = useState(false);
    const [input, setInput] = useState("");
    const [msg, setMsg] = useState([{
        type: "Bot",
        text: "Tôi có thể giúp gì cho bạn?"
    }]);

    const submitChatBot = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = {
            type: "user",
            text: input
        }
        setMsg((prev) => [...prev, userMsg]);
        setInput("");
        setTimeout(() => {
            setMsg((prev) => [
                ...prev,
                {
                type: "bot",
                text: "Đội ngũ hỗ trợ đã ghi nhận yêu cầu của bạn ❤️",
                },
            ]);
            }, 1000);
    };

    return (
        <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end">
        
            {openChatBot && (
            <div id="liveChatWindow" className="w-[320px] sm:w-[360px] h-[450px] bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-gray-100 flex flex-col overflow-hidden mb-3 transition-all duration-300 origin-bottom-right scale-95">
                
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
                    <button onClick={() => setOpenChatBot(prev => !prev)} id="closeChatBtn" className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center transition focus:outline-none">
                        <i className="fa-solid fa-xmark text-base"></i>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 bg-gray-50/60 flex flex-col gap-3" id="chatMessageContainer">
                    {msg.map((m, index) => (
                        <div
                            key={index}
                            className={`flex ${
                                m.type === "user" ? "justify-end" : "justify-start"
                            }`}
                        >
                            {m.type === "bot" ? (
                                <>
                                    <div className="w-7 h-7 rounded-lg bg-[#C97474]/10 text-[#C97474] flex items-center justify-center flex-shrink-0 text-xs font-bold mr-2">
                                        ZS
                                    </div>

                                    <div>
                                        <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm">
                                            <p className="text-xs font-medium text-[#3D3333] leading-relaxed">
                                                {m.text}
                                            </p>
                                        </div>

                                        <span className="text-[9px] text-gray-400 font-medium mt-1 block px-1">
                                            Vừa xong
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <div>
                                    <div className="bg-[#C97474] text-white p-3 rounded-2xl rounded-tr-none shadow-sm">
                                        <p className="text-xs font-medium leading-relaxed">
                                            {m.text}
                                        </p>
                                    </div>

                                    <span className="text-[9px] text-gray-400 font-medium mt-1 block text-right px-1">
                                        Vừa xong
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <form id="chatForm" onSubmit={submitChatBot} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
                    <input 
                    type="text" 
                    id="chatInput" 
                    placeholder="Nhập tin nhắn..." 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    autoComplete="off" 
                    className="flex-1 bg-gray-50 border border-gray-200 text-xs font-semibold rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#C97474] focus:bg-white transition" 
                    />
                    <button type="submit" className="w-9 h-9 bg-[#C97474] text-white rounded-xl flex items-center justify-center hover:bg-[#b56363] active:scale-95 transition focus:outline-none flex-shrink-0">
                        <i className="fa-solid fa-paper-plane text-xs"></i>
                    </button>
                </form>
            </div>
            )}

            <button onClick={() => setOpenChatBot(prev => !prev)}  id="toggleChatBtn" className="w-12 h-12 md:w-14 md:h-14 bg-[#C97474] text-white rounded-2xl flex items-center justify-center shadow-[0_4px_24px_rgba(201,116,116,0.4)] hover:bg-[#b56363] hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none group relative">
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#C97474] rounded-full animate-ping"></span>
                <i className="fa-solid fa-comments text-lg md:text-xl group-hover:rotate-6 transition duration-300"></i>
            </button>
        </div>
    );
}