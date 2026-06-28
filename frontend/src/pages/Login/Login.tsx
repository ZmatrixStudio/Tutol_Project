import React, { useEffect, useState } from "react";
import { loginAPI } from "../../Services/LoginServices";
import { useAuth } from "../../Context/AuthContext";
   
import styles from './Login.module.css';

import laImage from "../../assets/la.png"; 
import rocketImage from "../../assets/rocket.png";
import InputField from '../../components/InputField/InputField';
import ButtonContinue from '../../components/ButtonContinue/ButtonContinue';
import AuthSwitchButton from "../../components/AuthSwitchButton/AuthSwitchButton";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isEmailFocused, setIsEmailFocused] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [status, setStatus] = useState<'error' | 'success'>('error');
    const [toastKey, setToastKey] = useState(0); 

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => {setErrorMessage("");}, 10000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    useEffect(() => {
        document.title = "Đăng Nhập - Chào mừng bạn đã trở lại";
    }, []);

    const handleTogglePassword = () => { setShowPassword((prev) => !prev) };

    const { setAccessToken } = useAuth();

    const loginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage("");

        try {
            const res = await loginAPI(email, password);
            setStatus('success');
            setErrorMessage("Đăng nhập thành công!");
            setAccessToken(res.accessToken);

        } catch (error) {
            console.log(error);
            setStatus('error');
            setErrorMessage("Sai tài khoản hoặc mật khẩu!");
        }
        setToastKey(prev => prev + 1); // Reset animation mỗi khi submit
    };

    return (
        <div className={styles.container}>
            <div className={styles.leftBtn}>
                {windowWidth >= 1200 && (
                    <>
                        <div className={styles.welcomeContainer}>
                            <h1 className={styles.titleWelcome}>Welcome To The</h1>
                            
                            <div className={`${styles.badge} ${styles.badgeTutoring}`}>
                                Tutoring
                            </div>
                            <div className={`${styles.badge} ${styles.badgeWebsite}`}>
                                Website
                            </div>
                        </div>

                        <img
                            className={styles.svgMoveUp}
                            width="465"
                            height="650"
                            src={rocketImage}
                            alt="Rocket"
                        />
                    </>
                )}
            </div>

            <div className={styles.rightBtn}>
                <form onSubmit={loginSubmit}>
                    <div className={styles.loginTitleWrapper}>
                        <h1 className={styles.loginTitle}>Đăng Nhập</h1>
                        <div className={styles.loginLine}></div>
                    </div>

                    <div
                        key={toastKey}
                        className={`${styles.errorToast} ${styles[status]} ${
                            errorMessage ? styles.show : ""
                        }`}
                    />

                    <InputField
                        id="email"
                        type="email"
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        isFocused={isEmailFocused}
                        setIsFocused={setIsEmailFocused}
                        placeholder="Example@gmail.com"
                        icon="fa-regular fa-envelope"
                        image={laImage}
                    />

                    <InputField
                        id="password"
                        type={showPassword ? "text" : "password"}
                        label="Mật Khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        isFocused={isPasswordFocused}
                        setIsFocused={setIsPasswordFocused}
                        icon="fa fa-lock"
                        placeholder="Example1@"
                        showToggle={true}
                        showPassword={showPassword}
                        onTogglePassword={handleTogglePassword}
                    />

                    <AuthSwitchButton text="Quên mật khẩu ?" id="continue-forgot-password"  onClick={() => navigate("/forgot-password")} />

                    <ButtonContinue type="submit" text="Tiếp Tục"/>

                    <div
                        className={styles.btnRegister}
                        id="continue-register"
                        onClick={() => navigate("/register")}
                    >
                        <span>Tạo Tài Khoản Mới</span>
                    </div>

                    <div className={styles.divider}>
                        <span>KHÁC</span>
                    </div>

                    <div className={styles.socialGroup}>
                        <div className={`${styles.btnSocial} ${styles.btnGoogle}`}>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" />
                            <span>Google</span>
                        </div>
                        <div className={`${styles.btnSocial} ${styles.btnFacebook}`}>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b9/2023_Facebook_icon.svg" alt="Facebook" />
                            <span>Facebook</span>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;