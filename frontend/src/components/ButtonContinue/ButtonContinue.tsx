import styles from "./ButtonContinue.module.css";

interface ButtonProps {
    type?: "button" | "submit";
    text: string;
    onClick?: () => void;
}

function ButtonContinue({ type = "button", text, onClick }: ButtonProps) {
    return (
        <button type={type} className={styles.btnContinue} onClick={onClick} style={{ border: "none", width: "100%" }}>
            <div className={`${styles.waterBlob} ${styles.blob1}`}></div>
            <div className={`${styles.waterBlob} ${styles.blob2}`}></div>
            <div className={`${styles.waterBlob} ${styles.blob3}`}></div>
            <div className={`${styles.waterBlob} ${styles.blob4}`}></div>
            <div className={`${styles.waterBlob} ${styles.blob5}`}></div>
            <div className={`${styles.waterBlob} ${styles.blob6}`}></div>
            <div className={`${styles.waterBlob} ${styles.blob7}`}></div>
            <span className={styles.btnText}>{text}</span>
        </button>
    );
}

export default ButtonContinue;