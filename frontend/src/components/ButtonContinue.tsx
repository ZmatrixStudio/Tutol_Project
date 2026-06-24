

interface ButtonProps {
    type?: "button" | "submit";
    text: string;
    onClick?: () => void;
}

function ButtonContinue({ type = "button", text, onClick }: ButtonProps) {
    return (
        <button type={type} className="btn-continue" onClick={onClick} style={{ border: "none", width: "100%" }}>
            <div className="water-blob blob-1"></div>
            <div className="water-blob blob-2"></div>
            <div className="water-blob blob-3"></div>
            <div className="water-blob blob-4"></div>
            <div className="water-blob blob-5"></div>
            <div className="water-blob blob-6"></div>
            <div className="water-blob blob-7"></div>
            <span className="btn-text">{text}</span>
        </button>
    );
}

export default ButtonContinue;