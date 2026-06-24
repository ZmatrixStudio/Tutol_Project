import React, { useEffect, useState } from "react";
import { loginAPI } from "../../Services/LoginServices";
import { useAuth } from "../../Context/AuthContext";
   
import "./Login.css";

import laImage from "../../assets/login/la.png"; 
import rocketImage from "../../assets/login/rocket.png";
import InputField from '../../components/InputField';
import ButtonContinue from '../../components/ButtonContinue';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isEmailFocused, setIsEmailFocused] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [status, setStatus] = useState<'error' | 'success'>('error');
    const [toastKey, setToastKey] = useState(0); // Dùng để reset animation

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
        <div className="container">
            <div className="left-btn">
                {windowWidth >= 1200 && (
                    <>
                        <div className="welcome-container">
                            <h1 className="title-welcome">Welcome To The</h1>
                            <div className="badge badge-tutoring">Tutoring</div>
                            <div className="badge badge-website">Website</div>
                        </div>
                        <img 
                            className="svg-move-up" 
                            width="465" 
                            height="650" 
                            src={rocketImage} 
                            alt="Rocket" 
                        />
                    </>
                )}
            </div>
            <div className="right-btn">
                <form onSubmit={loginSubmit}>
                    <div className="login-title-wrapper">
                        <h1 className="login-title">Đăng Nhập</h1>
                        <div className="login-line"></div>
                    </div>

                    <div key={toastKey} className={`error-toast ${status} ${errorMessage ? "show" : ""}`}>
                        {errorMessage}
                        <div className="progress-bar"></div>
                    </div>

                    <InputField
                        id="email"
                        type="email"
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        isFocused={isEmailFocused}
                        setIsFocused={setIsEmailFocused}
                        placeholder="Example@gmail.com"
                        icon="fa-regular fa-envelope icon"
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
                        icon="fa fa-lock icon"
                        placeholder="Example1@"
                        showToggle={true}
                        showPassword={showPassword}
                        onTogglePassword={handleTogglePassword}
                    />

                    <div className="btn-forgot-password" id="continue-forgot-password">
                        <span>Quên mật khẩu ?</span>
                    </div>

                    <ButtonContinue type="submit" text="Tiếp Tục"/>

                    <div className="btn-register" id="continue-register">
                        <span>Tạo Tài Khoản Mới</span>
                    </div>

                    <div className="divider">
                        <span>KHÁC</span>
                    </div>

                    <div className="social-group">
                        <div className="btn-social btn-google" id="google">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" />
                            <span>Google</span>
                        </div>
                        <div className="btn-social btn-facebook" id="facebook">
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