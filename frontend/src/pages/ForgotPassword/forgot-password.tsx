import { useNavigate } from "react-router-dom";
import laImage from "../../assets/la.png";
import InputField from "../../components/InputField/InputField";
import ButtonContinue from "../../components/ButtonContinue/ButtonContinue";
import AuthSwitchButton from "../../components/AuthSwitchButton/AuthSwitchButton";
import { useEffect, useState } from "react";

import styles from "./forgot-password.module.css";
import axios from "axios";

function ForgotPassword() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");
    const [status, setStatus] = useState<"error" | "success">("error");
    const [toastKey, setToastKey] = useState(0);

    const [isEmailFocused, setIsEmailFocused] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);

    const [allowPassword, setAllowPassword] = useState(false);
    const [checkedEmail, setCheckedEmail] = useState("");

    const handleTogglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    useEffect(() => {
        document.title = "Quên mật khẩu";
    }, []);

    const checkEmailOnce = async () => {
        if (!email.trim()) return;

        if (checkedEmail === email) return;

        try {
            const res = await axios.post("/api/v1/check-email", {
                email,
            });

            if (res.status === 200) {
                setAllowPassword(true);

                setStatus("success");
                setErrorMessage("Email hợp lệ");
                setToastKey((prev) => prev + 1);
            }

            setCheckedEmail(email);
        } catch {
            setAllowPassword(false);

            setStatus("error");
            setErrorMessage("Email không tồn tại");
            setToastKey((prev) => prev + 1);
        }
    };

    const handleSubmit = async () => {
        if (!allowPassword) {
            setStatus("error");
            setErrorMessage("Vui lòng kiểm tra email trước");
            setToastKey((prev) => prev + 1);
            return;
        }

        if (password !== confirmPassword) {
            setStatus("error");
            setErrorMessage("Mật khẩu nhập lại không khớp");
            setToastKey((prev) => prev + 1);
            return;
        }

        // Gọi API reset password ở đây

        setStatus("success");
        setErrorMessage("Đổi mật khẩu thành công");
        setToastKey((prev) => prev + 1);
    };

    return (
        <div className={styles.container}>
            <div className={styles.mainBtn}>
                <div className={styles.loginTitleWrapper}>
                    <h1 className={styles.loginTitle}>Quên Mật Khẩu</h1>
                    <div className={styles.loginLine}></div>
                    <p className={styles.description}>
                        Vui lòng nhập email đã đăng ký với hệ thống. Chúng tôi sẽ gửi hướng dẫn giúp bạn đặt lại mật khẩu.
                    </p>
                </div>

                <div
                    key={toastKey}
                    className={`error-toast ${status} ${
                        errorMessage ? "show" : ""
                    }`}
                >
                    {errorMessage}
                    <div className="progress-bar"></div>
                </div>

                <InputField
                    id="email"
                    type="email"
                    label="Email"
                    value={email}
                    isFocused={isEmailFocused}
                    setIsFocused={setIsEmailFocused}
                    placeholder="Example@gmail.com"
                    icon="fa-regular fa-envelope"
                    image={laImage}
                    onChange={(e) => {
                        setEmail(e.target.value);

                        setCheckedEmail("");
                        setAllowPassword(false);

                        setPassword("");
                        setConfirmPassword("");
                    }}
                    onBlur={checkEmailOnce}
                />

                {allowPassword && (
                    <>
                        <InputField
                            id="password"
                            type={showPassword ? "text" : "password"}
                            label="Mật Khẩu Mới"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            isFocused={isPasswordFocused}
                            setIsFocused={setIsPasswordFocused}
                            icon="fa fa-lock"
                            placeholder="Nhập Mật Khẩu Mới"
                            showToggle={true}
                            showPassword={showPassword}
                            onTogglePassword={handleTogglePassword}
                        />

                        <InputField
                            id="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            label="Nhập Lại Mật Khẩu"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                            isFocused={isConfirmPasswordFocused}
                            setIsFocused={setIsConfirmPasswordFocused}
                            icon="fa fa-lock"
                            placeholder="Nhập Lại Mật Khẩu Mới"
                            showToggle={true}
                            showPassword={showPassword}
                            onTogglePassword={handleTogglePassword}
                        />
                    </>
                )}

                <AuthSwitchButton
                    text="Bạn đã có tài khoản ?"
                    id="continue-login"
                    onClick={() =>
                        navigate("/login", {
                            replace: true,
                        })
                    }
                />

                <ButtonContinue
                    type="button"
                    text="Tiếp Tục"
                    onClick={handleSubmit}
                />
            </div>
        </div>
    );
}

export default ForgotPassword;