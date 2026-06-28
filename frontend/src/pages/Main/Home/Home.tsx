import { useEffect } from "react";

export default function HomePage() {
  useEffect(() => { document.title = "Trang chủ - Tìm gia sư ngay" }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#C97474]">
        Trang Chủ
      </h1>

      <p className="mt-4 text-gray-600">
        Chào mừng bạn đến với hệ thống Tìm Gia Sư Ngay.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <h3 className="font-bold text-lg">Tìm Gia Sư</h3>
          <p className="text-gray-500 mt-2">
            Kết nối với gia sư phù hợp.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <h3 className="font-bold text-lg">Lớp Học</h3>
          <p className="text-gray-500 mt-2">
            Quản lý các lớp học đang tham gia.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <h3 className="font-bold text-lg">Ví Tiền</h3>
          <p className="text-gray-500 mt-2">
            Theo dõi số dư và giao dịch.
          </p>
        </div>
      </div>
    </div>
  );
}