import { useNavigate } from "react-router-dom";

export default function Footer(){
    const navigate = useNavigate();
    return (
        <footer className="bg-white border-t border-gray-100 mt-12 py-6 text-center text-xs font-medium text-gray-400">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p>&copy; 2026 Tutol. Ứng dụng thuộc quyền sở hữu của team Zmatrix .</p>
                <div className="flex gap-4 text-gray-400">
                    <a onClick={() => navigate("/terms"  )} className="hover:text-[#C97474] transition">Điều khoản</a>
                    <a onClick={() => navigate("/privacy")} className="hover:text-[#C97474] transition">   Bảo mật</a>
                    <a onClick={() => navigate("/support")} className="hover:text-[#C97474] transition">    Hỗ trợ</a>
                </div>
            </div>
        </footer>
    );
}