import { useNavigate } from "react-router-dom";
import laImage from "../../assets/la.png"; 
import InputField from '../../components/InputField/InputField';
import ButtonContinue from '../../components/ButtonContinue/ButtonContinue';
import AuthSwitchButton from '../../components/AuthSwitchButton/AuthSwitchButton';
import { useEffect, useState } from "react";

import styles from "./Register.module.css";

function Register() {
    const navigate = useNavigate();
    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState("");
    
    const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);
    const [isLastNameFocused, setIsLastNameFocused] = useState(false);
    const [isFirstNameFocused, setIsFirstNameFocused] = useState(false);
    const [isEmailFocused, setIsEmailFocused] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    
    const [status, setStatus] = useState<'error' | 'success'>('error');
    const [toastKey, setToastKey] = useState(0); 
    
    const handleTogglePassword = () => { setShowPassword((prev) => !prev) };

    useEffect(() => {
            document.title = "Đăng Kí - Tạo Tài Khoản Mới";
    }, []);

    if (false) {
        if (password !== confirmPassword) {
            setStatus('error');
            setErrorMessage("Mật khẩu nhập lại không khớp !");
            setToastKey(prev => prev + 1);
            return;
        }
        setStatus('success');
        setErrorMessage("Đăng nhập thành công!");
        setToastKey(prev => prev + 1);
    }

    return (
        <div className={styles.container}>
            <div className={styles.mainBtn}>
                <div className={styles.loginTitleWrapper}>
                    <h1 className={styles.loginTitle}>Đăng Kí</h1>
                    <div className={styles.loginLine}></div>
                </div>

                <div key={toastKey} className={`error-toast ${status} ${errorMessage ? "show" : ""}`}>
                    {errorMessage}
                    <div className="progress-bar"></div>
                </div>

                <div className={styles.nameBtn}>
                    <InputField id="lastName" type="lastName" label="Họ" value={lastName} onChange={(e) => setLastName(e.target.value)} isFocused={isLastNameFocused} setIsFocused={setIsLastNameFocused} placeholder="Nhập họ" icon="fa-solid fa-signature"/>
                    <InputField id="firstName" type="firstName" label="Tên" value={firstName} onChange={(e) => setFirstName(e.target.value)} isFocused={isFirstNameFocused} setIsFocused={setIsFirstNameFocused} placeholder="Nhập tên" icon="fa-regular fa-user"/>
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

                <InputField
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    label="Nhập Lại Mật Khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    isFocused={isConfirmPasswordFocused}
                    setIsFocused={setIsConfirmPasswordFocused}
                    icon="fa fa-lock"
                    placeholder="Nhập lại mật khẩu"
                    showToggle={true}
                    showPassword={showPassword}
                    onTogglePassword={handleTogglePassword}
                />

                <AuthSwitchButton text="Bạn đã có tài khoản ?" id="continue-login"  onClick={() => navigate("/login", { replace: true })} />

                <ButtonContinue type="submit" text="Tiếp Tục"/>
            </div>

            

        </div>
    );
}

export default Register;