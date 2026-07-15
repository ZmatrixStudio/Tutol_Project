export default function HomePage(){
    return (
        <div className="flex items-center justify-center p-6 lg:p-5">
            <div id="toast-container"></div>

            <div className="w-full lg:max-w-[1400px] bg-[#f9f8f6] rounded-[2rem] lg:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row relative">
            
                <div className="w-full lg:w-[50%] bg-[#f4f0ef] pt-6 pb-14 px-4 lg:p-12 relative flex flex-col lg:flex-row items-center justify-center gap-6 lg:border-r border-[#e6ded8] lg:-mt-[50px]">            
                
                    <div className="w-full lg:w-56 h-48 lg:h-80 bg-[#f0e9e4] rounded-3xl border border-[#e6ded8] p-3 relative shadow-inner">
                        <div id="drop-zone" className="w-full h-full border-2 border-dashed border-[#d4c5b9] rounded-2xl flex flex-col items-center justify-center relative overflow-hidden cursor-pointer transition-all duration-300 hover:bg-[#f5f1ed] hover:border-[#b3917a]">

                            <svg className="w-14 h-14 text-[#b3917a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 0115.9 6L16 6a5 5 0 011 9.9M12 12v8m0-8l-3 3m3-3l3 3"/>
                            </svg>

                            <p className="mt-4 text-sm font-semibold text-[#6b5a50]"> Kéo thả tệp vào đây </p>
                            <p className="mt-1 text-xs text-gray-500">hoặc nhấn để chọn</p>
                            <p className="mt-3 text-[11px] text-gray-400">PNG • JPG • JPEG • PDF • DOCX</p>

                            <input id="file-input" type="file" className="hidden" accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"/>
                        </div>

                        <div className="hidden lg:flex absolute -bottom-12 left-1/2 -translate-x-1/2 w-48 flex-col items-center gap-2">
                            <span className="text-xs text-gray-500 font-medium">Chưa tải lên tệp nào...</span>
                            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div className="w-0 h-full bg-[#c3b1a4] rounded-full transition-all" id="fake-progress"></div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center gap-6 absolute lg:static left-0 right-0 -bottom-1 lg:bottom-auto z-10 lg:flex-col lg:gap-5">
                        
                        <div className="flex flex-col items-center gap-2 group -mt-4 lg:mt-0">
                            <button className="tool-btn w-16 h-16 lg:w-20 lg:h-20 bg-white rounded-full lg:rounded-2xl shadow-lg flex items-center justify-center text-[#5c4f46] border border-gray-100 group-hover:bg-[#f0e9e4] group-hover:text-black transition-all transform group-hover:-translate-y-1">
                                <svg className="w-7 h-7 lg:w-8 lg:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                            </button>
                            <span className="text-[10px] -mt-2 lg:text-[13px] lg:mt-0 text-gray-800 font-medium tracking-tight">Chụp Ảnh</span>
                        </div>

                        <div className="flex flex-col items-center gap-2 group -mt-4 lg:mt-0">
                            <button className="tool-btn w-16 h-16 lg:w-20 lg:h-20 bg-white rounded-full lg:rounded-2xl shadow-lg flex items-center justify-center text-[#5c4f46] border border-gray-100 group-hover:bg-[#f0e9e4] group-hover:text-black transition-all transform group-hover:-translate-y-1">
                                <svg className="w-7 h-7 lg:w-8 lg:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                                </svg>
                            </button>
                            <span className="text-[10px] -mt-2 lg:text-[13px] lg:mt-0 text-gray-800 font-medium tracking-tight">Tải Lên Tệp</span>
                        </div>

                        <div className="flex flex-col items-center gap-2 group -mt-4 lg:mt-0">
                            <button className="tool-btn w-16 h-16 lg:w-20 lg:h-20 bg-white rounded-full lg:rounded-2xl shadow-lg flex items-center justify-center text-[#5c4f46] border border-gray-100 group-hover:bg-[#f0e9e4] group-hover:text-black transition-all transform group-hover:-translate-y-1">
                                <svg className="w-7 h-7 lg:w-8 lg:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                            </button>
                            <span className="text-[10px] -mt-2 lg:text-[13px] lg:mt-0 text-gray-800 font-medium tracking-tight">Xem Tài Liệu</span>
                        </div>

                    </div>
                </div>

                <div className="w-full lg:w-[50%] bg-white px-6 pt-2 pb-3 mt-[10px] lg:mt-0 lg:px-14 lg:pt-8 lg:pb-8 xl:px-16 xl:pt-10 xl:pb-10 flex flex-col justify-between pb-[25px] lg:pb-0">
                
                    <div className="w-full max-w-lg mx-auto lg:mx-0">

                        <h2 className="font-bold text-base lg:text-lg text-black mb-4">Chọn môn học</h2>
                        
                        <div className="grid grid-cols-4 lg:grid-cols-2 gap-3 lg:gap-5 mb-8" id="subject-container">
                            
                            <button className="subject-btn bg-[#ffe9cc] rounded-2xl lg:rounded-2xl flex flex-col items-center justify-center gap-2 lg:gap-3 w-full aspect-square lg:h-20 border-2 border-transparent hover:border-[#e3c49e] hover:shadow-xl transition-all duration-300 relative overflow-hidden group" data-subject="Toán Học">

                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition"></div>

                                <div className="text-[#8a6a43] z-10">
                                    <svg className="w-6 h-6 lg:w-12 lg:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2"
                                            d="M9 7h6m-3-3v6m-7 6h14M5 19h14m-7-5l-5 5m5-5l5 5">
                                        </path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2"
                                            d="M4 4l16 16">
                                        </path>
                                    </svg>
                                </div>

                                <span className="text-[10px] lg:text-[15px] text-gray-900 font-semibold z-10">
                                    Toán Học
                                </span>

                            </button>
                            
                            <button className="subject-btn bg-[#e5e7fa] rounded-2xl lg:rounded-2xl flex flex-col items-center justify-center gap-2 lg:gap-3 w-full aspect-square lg:h-20 border-2 border-transparent hover:border-[#b5bae3] hover:shadow-xl transition-all duration-300 relative overflow-hidden group" data-subject="Vật Lý">

                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition"></div>

                                <div className="text-[#6168a3] z-10">
                                    <svg className="w-6 h-6 lg:w-12 lg:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2"
                                            d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25-9 3.694-9 8.25 4.03 8.25 9 8.25z">
                                        </path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2"
                                            d="M12 20.25c2.485 0 4.5-3.694 4.5-8.25S14.485 3.75 12 3.75 7.5 7.444 7.5 12s2.015 8.25 4.5 8.25z">
                                        </path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2"
                                            d="M12 13.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z">
                                        </path>
                                    </svg>
                                </div>

                                <span className="text-[10px] lg:text-[15px] text-gray-900 font-semibold z-10">
                                    Vật Lý
                                </span>

                            </button>

                            <button className="subject-btn bg-[#f5dcf2] rounded-2xl lg:rounded-2xl flex flex-col items-center justify-center gap-2 lg:gap-3 w-full aspect-square lg:h-20 border-2 border-transparent hover:border-[#d9a8d4] hover:shadow-xl transition-all duration-300 relative overflow-hidden group" data-subject="Hóa Học">

                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition"></div>

                                <div className="text-[#a3619c] z-10">
                                    <svg className="w-6 h-6 lg:w-12 lg:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2"
                                            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z">
                                        </path>
                                    </svg>
                                </div>

                                <span className="text-[10px] lg:text-[15px] text-gray-900 font-semibold z-10">
                                    Hóa Học
                                </span>

                            </button>

                            <button className="subject-btn bg-[#d6eed3] rounded-2xl lg:rounded-2xl flex flex-col items-center justify-center gap-2 lg:gap-3 w-full aspect-square lg:h-20 border-2 border-transparent hover:border-[#a0cfa1] hover:shadow-xl transition-all duration-300 relative overflow-hidden group" data-subject="Sinh Học">

                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition"></div>

                                <div className="text-[#538a53] z-10">
                                    <svg className="w-6 h-6 lg:w-12 lg:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2"
                                            d="M14.752 11.168l-3.197-2.132A4 4 0 002 9.171V19a2 2 0 002 2h14a2 2 0 002-2v-9.832a4 4 0 00-5.248-3.838l-3.197 2.132z">
                                        </path>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2"
                                            d="M15 9l-6 4M9 9l6 4">
                                        </path>
                                    </svg>
                                </div>

                                <span className="text-[10px] lg:text-[15px] text-gray-900 font-semibold z-10">
                                    Sinh Học
                                </span>

                            </button>
                        </div>

                        <h2 className="hidden lg:block font-bold text-base text-black mb-2">Thêm ghi chú đề bài...</h2>

                        <textarea id="note-input" className="textarea-focus-ring w-full bg-[#f4f0ef] lg:bg-white border lg:border-gray-300 rounded-xl lg:rounded-2xl p-4 lg:p-5 h-32 lg:h-[178px] text-sm lg:text-base text-gray-800 focus:outline-none focus:bg-white resize-none mb-6 lg:mb-8 placeholder-gray-400 transition shadow-inner lg:shadow-sm" placeholder="Nhập thêm ghi chú đề bài ..."/>
                        <button id="btn-submit" className="w-full -mt-[10px] bg-gradient-to-r from-[#b3917a] to-[#a07c65] lg:from-[#9c7b65] lg:to-[#82614b] text-white font-bold text-[17px] lg:text-lg tracking-wider py-4 lg:py-5 rounded-xl lg:rounded-full hover:opacity-90 shadow-[0_8px_20px_rgba(156,123,101,0.3)] active:scale-[0.98] transition-all uppercase relative overflow-hidden">
                            <span className="relative z-10">TIẾP TỤC</span>

                            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine"></div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}