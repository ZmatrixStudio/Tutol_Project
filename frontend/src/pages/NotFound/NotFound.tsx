import { Link } from "react-router-dom";
import "./NotFound.css";
import { useEffect } from "react";

function NotFound() {
    useEffect(() => {
            document.title = "Not Found ";
        }, []);
  return (
    <div>
      <div className="wires-container">
        <div className="wire-left wire-swing">
          <svg fill="none" viewBox="0 0 40 150">
            <path
              d="M20 0 C20 50, 5 100, 25 145"
              strokeLinecap="round"
              strokeWidth="12"
              stroke="#c97474"
            />
            <path
              d="M25 145 L20 155 M25 145 L28 152 M25 145 L32 150"
              strokeLinecap="round"
              strokeWidth="3"
              stroke="#e2c7c7"
            />
          </svg>

          <div className="spark-box spark-animate">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />
            </svg>
          </div>
        </div>

        <div className="wire-right wire-swing">
          <svg fill="none" viewBox="0 0 40 120">
            <path
              d="M20 0 C20 40, 35 80, 15 115"
              strokeLinecap="round"
              strokeWidth="12"
              stroke="#c97474"
            />
            <path
              d="M15 115 L10 125 M15 115 L18 122 M15 115 L22 120"
              strokeLinecap="round"
              strokeWidth="3"
              stroke="#e2c7c7"
            />
          </svg>
        </div>
      </div>

      <div className="content-wrap animate-fade-in-up">
        <div className="emojis animate-bounce">🧌🦴</div>

        <h1 className="title-404 font-comic">404</h1>

        <h2 className="subtitle">Ối! Lạc về thời đồ đá rồi...</h2>

        <p className="description">
          Có vẻ như một anh bạn thời tiền sử nào đó đã vô tình lấy xương đập
          đứt cáp mạng của chúng ta. Trang bạn đang tìm kiếm hiện không tồn tại!
        </p>

        <Link className="btn-back" to="/">
          <svg
            fill="none"
            viewBox="0 0 24 24"
            className="btn-icon"
            stroke="currentColor"
          >
            <path
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>

          Quay lại thế giới hiện đại
        </Link>
      </div>
    </div>
  );
}

export default NotFound;