import React, { useState, useRef, useEffect } from 'react';
import { renderAsync } from 'docx-preview';
import api from "../../../api/axios";
import { useAuth } from "../../../contexts/AuthContext";

// 1. INTERFACE CHO TỆP TẢI LÊN
interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: string;
  type: 'image' | 'pdf' | 'docx' | 'other';
  previewUrl?: string;

  status: "uploading" | "success" | "error" | "deleting";
  attachmentId?: number; // id database
}

// 2. COMPONENT HIỂN THỊ CHI TIẾT FILE DOCX
interface DocxViewerProps {
  file: File;
}

function DocxViewer({ file }: DocxViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && file) {
      containerRef.current.innerHTML = '';
      
      renderAsync(file, containerRef.current).catch((err) => {
        console.error('Lỗi khi đọc file docx:', err);
      });
    }
  }, [file]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full overflow-auto bg-white p-4 text-black text-left border rounded-lg shadow-inner" 
    />
  );
}

export default function HomePage(){
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [isListModalOpen, setIsListModalOpen] = useState<boolean>(false);
    const [selectedFileView, setSelectedFileView] = useState<UploadedFile | null>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const { accessToken } = useAuth();

    // Phân loại tệp
    const getFileType = (file: File): 'image' | 'pdf' | 'docx' | 'other' => {
        if (file.type.startsWith('image/')) return 'image';
        if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) return 'pdf';
        if (file.type.includes('word') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) return 'docx';
        return 'other';
    };

    // Thêm tệp vào mảng state
    const handleAddFiles = async (newFiles: FileList | File[]) => {
        const fileList = Array.from(newFiles);

        for (const file of fileList) {
            const type = getFileType(file);

            const uploadFile: UploadedFile = {
                id: Math.random().toString(36).substring(2, 9),
                file,
                name: file.name,
                size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
                type,
                previewUrl: URL.createObjectURL(file),
                status: "uploading",
                attachmentId: undefined,
            };

            // Hiển thị ngay lên giao diện
            setFiles(prev => [...prev, uploadFile]);

            try {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("ownerType", "UPLOAD_TEMP");

                const response = await api.post(
                    "/api/v1/files",
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                if (response.status != 200)

                console.log("Upload thành công:", response);

                // Ví dụ backend trả về id
                setFiles(prev =>
                    prev.map(item =>
                        item.id === uploadFile.id
                            ? { ...item, attachmentId: response.data.data.id, status: "success" }
                            : item
                    )
                );

            } catch (error) {
                console.error(`Upload ${file.name} thất bại`, error);

                // Có thể xóa file khỏi danh sách nếu upload lỗi
                setFiles(prev => prev.filter(item => item.id !== uploadFile.id));
            }
        }
    };

    // Xóa tệp
    const handleRemoveFile = async (id: string) => {
        try {
            const file = files.find(f => f.id === id);

            if (!file?.attachmentId) return;
            if (!file?.attachmentId || file.status === "deleting") return;

            setFiles(prev =>
                prev.map(item =>
                    item.id === id
                        ? { ...item, status: "deleting" }
                        : item
                )
            );

            const res = await api.delete(`/api/v1/files/${file.attachmentId}`, {headers: {Authorization: `Bearer ${accessToken}`},})
            if (res.status === 200) {
                setFiles((prev) => {
                    const target = prev.find((item) => item.id === id);
                    if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
                    return prev.filter((item) => item.id !== id);
                });
            } else {
                alert(res.data.message);
            }
            
        } catch (error) {
            alert(error);
        }
    };

    // Drag & Drop
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const handleDragLeave = () => setIsDragging(false);
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleAddFiles(e.dataTransfer.files);
        }
    };

    // Mở Popup xem file cụ thể
    const handleOpenPreview = (file: UploadedFile) => {
        setSelectedFileView(file);
    };

    // Giả lập gửi file lên Database
    const handleSubmitToDB = async () => {
        if (files.length === 0) {
        alert('Vui lòng chọn ít nhất 1 tệp trước khi gửi!');
        return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        files.forEach((item) => {
        formData.append('documents', item.file);
        });

        try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        alert('Đã tải tệp lên Database thành công!');
        setIsListModalOpen(false);
        } catch (error) {
        alert('Gửi tệp thất bại, vui lòng thử lại.');
        } finally {
        setIsSubmitting(false);
        }
    };

    const latestFile = files[files.length - 1];
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div id="toast-container"></div>

            <div className="w-full lg:max-w-[1400px] bg-[#f9f8f6] rounded-[2rem] lg:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row relative">
            
                <div className="w-full lg:w-[50%] bg-[#f4f0ef] pt-6 pb-14 px-4 lg:p-12 relative flex flex-col lg:flex-row items-center justify-center gap-6 lg:border-r border-[#e6ded8] lg:-mt-[50px]">
      
                    {/* Input ẩn để chọn tệp */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => e.target.files && handleAddFiles(e.target.files)}
                    />
                    <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => e.target.files && handleAddFiles(e.target.files)}
                    />

                    {/* KHUNG DROP ZONE */}
                    <div className="w-full lg:w-56 h-48 lg:h-80 bg-[#f0e9e4] rounded-3xl border border-[#e6ded8] p-3 relative shadow-inner">
                        <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`w-full h-full border-2 border-dashed rounded-2xl flex flex-col items-center justify-center relative overflow-hidden cursor-pointer transition-all duration-300 ${
                            isDragging ? 'bg-[#e8decb] border-[#b3917a]' : 'border-[#d4c5b9] hover:bg-[#f5f1ed] hover:border-[#b3917a]'
                        }`}
                        >
                        {latestFile ? (
                            <div className="flex flex-col items-center justify-center p-2 text-center w-full h-full">
                            {latestFile.type === 'image' && (
                                <img src={latestFile.previewUrl} alt={latestFile.name} className="w-full h-full object-cover rounded-xl" />
                            )}
                            {latestFile.type === 'pdf' && (
                                <div className="flex flex-col items-center gap-2">
                                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center font-bold text-xl shadow-sm">PDF</div>
                                <p className="text-xs font-semibold text-[#6b5a50] max-w-[150px] truncate">{latestFile.name}</p>
                                </div>
                            )}
                            {latestFile.type === 'docx' && (
                                <div className="flex flex-col items-center gap-2">
                                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-xl shadow-sm">DOC</div>
                                <p className="text-xs font-semibold text-[#6b5a50] max-w-[150px] truncate">{latestFile.name}</p>
                                </div>
                            )}
                            {latestFile.type === 'other' && (
                                <div className="flex flex-col items-center gap-2">
                                <div className="w-16 h-16 bg-gray-200 text-gray-700 rounded-2xl flex items-center justify-center font-bold text-xl shadow-sm">FILE</div>
                                <p className="text-xs font-semibold text-[#6b5a50] max-w-[150px] truncate">{latestFile.name}</p>
                                </div>
                            )}
                            </div>
                        ) : (
                            <>
                            <svg className="w-14 h-14 text-[#b3917a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 0115.9 6L16 6a5 5 0 011 9.9M12 12v8m0-8l-3 3m3-3l3 3" />
                            </svg>
                            <p className="mt-4 text-sm font-semibold text-[#6b5a50]">Kéo thả tệp vào đây</p>
                            <p className="mt-1 text-xs text-gray-500">hoặc nhấn để chọn</p>
                            <p className="mt-3 text-[11px] text-gray-400">PNG • JPG • PDF • DOCX</p>
                            </>
                        )}
                        </div>

                        <div className="hidden lg:flex absolute -bottom-12 left-1/2 -translate-x-1/2 w-48 flex-col items-center gap-2">
                        <span className="text-xs text-gray-500 font-medium truncate max-w-full">
                            {files.length > 0 ? `Đã tải lên ${files.length} tệp` : 'Chưa tải lên tệp nào...'}
                        </span>
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-[#c3b1a4] rounded-full transition-all duration-300" style={{ width: files.length > 0 ? '100%' : '0%' }}></div>
                        </div>
                        </div>
                    </div>

                    {/* NÚT THAO TÁC */}
                    <div className="flex justify-center gap-6 absolute lg:static left-0 right-0 -bottom-1 lg:bottom-auto z-10 lg:flex-col lg:gap-5">
                        <div className="flex flex-col items-center gap-2 group -mt-4 lg:mt-0">
                        <button onClick={() => cameraInputRef.current?.click()} className="tool-btn w-16 h-16 lg:w-20 lg:h-20 bg-white rounded-full lg:rounded-2xl shadow-lg flex items-center justify-center text-[#5c4f46] border border-gray-100 group-hover:bg-[#f0e9e4] group-hover:text-black transition-all">
                            <svg className="w-7 h-7 lg:w-8 lg:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </button>
                        <span className="text-[10px] -mt-2 lg:text-[13px] text-gray-800 font-medium">Chụp Ảnh</span>
                        </div>

                        <div className="flex flex-col items-center gap-2 group -mt-4 lg:mt-0">
                        <button onClick={() => fileInputRef.current?.click()} className="tool-btn w-16 h-16 lg:w-20 lg:h-20 bg-white rounded-full lg:rounded-2xl shadow-lg flex items-center justify-center text-[#5c4f46] border border-gray-100 group-hover:bg-[#f0e9e4] group-hover:text-black transition-all">
                            <svg className="w-7 h-7 lg:w-8 lg:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        </button>
                        <span className="text-[10px] -mt-2 lg:text-[13px] text-gray-800 font-medium">Tải Lên Tệp</span>
                        </div>

                        <div className="flex flex-col items-center gap-2 group -mt-4 lg:mt-0 relative">
                        <button onClick={() => setIsListModalOpen(true)} className="tool-btn w-16 h-16 lg:w-20 lg:h-20 bg-white rounded-full lg:rounded-2xl shadow-lg flex items-center justify-center text-[#5c4f46] border border-gray-100 group-hover:bg-[#f0e9e4] group-hover:text-black transition-all relative">
                            <svg className="w-7 h-7 lg:w-8 lg:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            {files.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-[#b3917a] text-white text-[11px] font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">{files.length}</span>
                            )}
                        </button>
                        <span className="text-[10px] -mt-2 lg:text-[13px] text-gray-800 font-medium">Xem Tài Liệu</span>
                        </div>
                    </div>

                    {/* POPUP 1: DANH SÁCH CÁC TỆP ĐÃ UPLOAD */}
                    {isListModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-[#e6ded8]">
                            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-[#f4f0ef]">
                            <div>
                                <h3 className="text-lg font-bold text-[#5c4f46]">Kiểm tra tài liệu đã tải ({files.length})</h3>
                                <p className="text-xs text-gray-500">Nhấn vào từng tệp để xem kỹ nội dung trước khi gửi</p>
                            </div>
                            <button onClick={() => setIsListModalOpen(false)} className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-500 hover:text-black transition-all">✕</button>
                            </div>

                            <div className="p-6 overflow-y-auto flex-1 bg-[#f9f7f6]">
                            {files.length === 0 ? (
                                <div className="text-center py-12 text-gray-400">
                                <p>Chưa có tài liệu nào trong hàng chờ.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {files.map((item) => (
                                    <div key={item.id} className="relative group aspect-square rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
                                    <button onClick={() => handleOpenPreview(item)} className="w-full flex-1 flex items-center justify-center relative overflow-hidden bg-gray-50">
                                        {item.type === 'image' && (
                                        <img src={item.previewUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                        )}
                                        {item.type === 'pdf' && (
                                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center font-bold text-lg">PDF</div>
                                        )}
                                        {item.type === 'docx' && (
                                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg">DOC</div>
                                        )}
                                        {item.type === 'other' && (
                                        <div className="w-12 h-12 bg-gray-200 text-gray-700 rounded-xl flex items-center justify-center font-bold text-lg">FILE</div>
                                        )}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition-opacity">Mở Xem</div>
                                    </button>

                                    <div className="p-2 bg-white border-t border-gray-100">
                                        <p className="text-[11px] font-semibold text-gray-800 truncate" title={item.name}>{item.name}</p>
                                        <span className="text-[10px] text-gray-400">{item.size}</span>
                                    </div>

                                    <button onClick={() => handleRemoveFile(item.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1.5 rounded-full bg-white/80 shadow-sm" title="Xóa tệp">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                    </div>
                                ))}
                                </div>
                            )}
                            </div>

                            <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50">
                            <button onClick={() => setIsListModalOpen(false)} className="px-5 py-2 text-gray-600 font-medium text-sm rounded-xl hover:bg-gray-200 transition-all">Đóng</button>
                            <button onClick={handleSubmitToDB} disabled={isSubmitting || files.length === 0} className="px-6 py-2 bg-[#b3917a] hover:bg-[#a17e68] text-white font-medium text-sm rounded-xl transition-all disabled:opacity-50">
                                {isSubmitting ? 'Đang gửi...' : 'Xác nhận gửi lên Database'}
                            </button>
                            </div>
                        </div>
                        </div>
                    )}

                    {/* POPUP 2: XEM NỘI DUNG TỆP (ẢNH, PDF HOẶC DOCX) */}
                    {selectedFileView && (
                        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setSelectedFileView(null)}>
                        <div className="relative bg-white rounded-3xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-[#f4f0ef]">
                            <div className="min-w-0">
                                <h3 className="text-sm font-bold text-[#5c4f46] truncate">{selectedFileView.name}</h3>
                                <span className="text-xs text-gray-500">{selectedFileView.size}</span>
                            </div>
                            <button onClick={() => setSelectedFileView(null)} className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-500 hover:text-black">✕</button>
                            </div>

                            {/* Khung hiển thị nội dung tùy theo loại file */}
                            <div className="p-4 flex-1 overflow-hidden bg-gray-900 flex items-center justify-center relative">
                            {/* Xem ẢNH */}
                            {selectedFileView.type === 'image' && (
                                <img src={selectedFileView.previewUrl} alt={selectedFileView.name} className="max-w-full max-h-full object-contain rounded-lg" />
                            )}

                            {/* Xem PDF */}
                            {selectedFileView.type === 'pdf' && (
                                <iframe src={selectedFileView.previewUrl} title={selectedFileView.name} className="w-full h-full rounded-lg border-0 bg-white" />
                            )}

                            {/* Xem DOCX trực tiếp từ RAM bằng DocxViewer */}
                            {selectedFileView.type === 'docx' && (
                                <div className="w-full h-full bg-white rounded-lg overflow-hidden">
                                <DocxViewer file={selectedFileView.file} />
                                </div>
                            )}

                            {/* Định dạng khác */}
                            {selectedFileView.type === 'other' && (
                                <div className="text-center text-white p-6">
                                <p className="text-base font-semibold">{selectedFileView.name}</p>
                                <p className="text-xs text-gray-400 mt-2">Định dạng file không hỗ trợ xem trước trực tiếp.</p>
                                </div>
                            )}
                            </div>

                            <div className="p-4 border-t border-gray-100 flex justify-end bg-white">
                            <button onClick={() => setSelectedFileView(null)} className="px-6 py-2 bg-[#b3917a] text-white font-medium text-sm rounded-xl">Hoàn tất kiểm tra</button>
                            </div>
                        </div>
                        </div>
                    )}

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