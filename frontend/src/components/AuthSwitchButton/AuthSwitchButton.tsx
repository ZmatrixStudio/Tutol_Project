import styles from "./AuthSwitchButton.module.css";

interface AuthSwitchButtonProps {
    text: string;
    onClick?: () => void;
    id?: string;
}

function AuthSwitchButton({
    text,
    onClick,
    id,
}: AuthSwitchButtonProps) {
    return (
        <div
            className={styles.authSwitchBtn}
            id={id}
            onClick={onClick}
        >
            <span>{text}</span>
        </div>
    );
}

export default AuthSwitchButton;