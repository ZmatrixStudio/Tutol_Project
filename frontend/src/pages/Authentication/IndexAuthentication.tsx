
import React, { useEffect, useState } from "react";
import { useNavigate} from 'react-router-dom';
import { loginFacebook } from "./OAuth/Facebook";
import { loginGoogle } from "./OAuth/Google";
import api from "../../api/axios";

type AuthState = "login" | "register" | "otp";

export default function IndexAuthentication(){
    const navigate = useNavigate();
    const [state, setState] = useState<AuthState>("login");

    const [emailForgot, setEmailForgot] = useState("");
    const [errorLog, setErrorLog] = useState("");
    const [forgotModal, setForgotModal] = useState(false);
    const [forgotStepEmail, setForgotStepEmail] = useState(true);
    const [forgotStepOtp, setforgotStepOtp] = useState(false);
    const [forgotStepReset, setForgotStepReset ] = useState(false);
    const [loading, setLoading] = useState(false);

    const [registerData, setRegisterData] = useState({ fullName: "", email: "", password: ""});
    const [NX1Data, setNX1Data] = useState("");

    useEffect(() => {document.title = "Chào mừng bạn đã quay trở lại"}, [])
    
    // CHECK MÃ OTP 
    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, prefix: string, index: number) => {
        const value = e.target.value.replace(/[^0-9]/g, "");
        e.target.value = value;

        if (value && index < 6) {
            document.getElementById(`${prefix}${index + 1}`)?.focus();
        }
    }

    // TỰ ĐỘNG NHẢY SANG Ô KHÁC
    const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, prefix: string, index: number) => {
        if (e.key === "Backspace" && !e.currentTarget.value && index > 1) {
            document.getElementById(`${prefix}${index - 1}`)?.focus();
        }
    }

    // LOGIN
    const loginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const formData = new FormData(e.currentTarget);

            const email = formData.get("email") as string;
            const password = formData.get("password") as string;

            const res = await api.post("/api/v1/auth/login", {email, password}, {withCredentials: true});
            
            if (res.status === 200){
                window.location.reload();
            }
        } catch (err: any) {
            if (err.response) {
                setErrorLog(err.response.data.message);
            } else {
                setErrorLog("Không thể kết nối tới server");
            }
            setTimeout(() => {setErrorLog("");}, 10000);
        }
    }

    // OAUTH 2.0 FACEBOOK
    const facebookLogin = async () => {
        try {
            const facebookData = await loginFacebook();
            console.log(facebookData)
        } catch (error) {
            alert(error)
        }
    }

    // OAUTH 2.0 GOOGLE
    const googleLogin = async () => {
        try {
            const googleData = await loginGoogle();

            console.log(googleData);

            const res = await api.post("/api/v1/oauth/google", {"token": googleData}, {withCredentials: true});
            if (res.status === 200){
                window.location.reload();
            }
            
        } catch (error) {
            alert(error);
        }
    }


    // FORGOT 
    const forgotSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const formDataForgot = new FormData(e.currentTarget);

            const passNew = formDataForgot.get("password") as string;
            const confirmPassword = formDataForgot.get("confirmPassword") as string;

            if (passNew != confirmPassword) {
                alert("Mật khẩu không khớp!!")
                return;
            }

            const resForgot = await api.post("/api/v1/auth/forgot", {
                "email": emailForgot, 
                "password": passNew,
                "NX1DEBUG": NX1Data
            })
            if (resForgot.status === 200){
                navigate("/")
            } 
        } catch (error) {
            alert(error);
        }
        
    }

    const verifyOtp = async(e: React.FormEvent, purpose:string) => {
        e.preventDefault();
        if (purpose != "FORGOT") return;
        let otp ="";
        for (let i = 1; i <= 6; i++) {
            const input = document.getElementById(`otp-forgot-${i}` ) as HTMLInputElement;
            if (!input || !input.value) {
                return; // chưa nhập đủ 6 số
            }
            otp += input.value;
        }
        try {
            setLoading(true);
            const response = await api.post("/api/v1/auth/email-identifier", {
                "email": emailForgot,
                "otp": otp,
                "state": sessionStorage.getItem("otpToken"),
                "purpose": purpose
            })
            if (response.status === 200){
                setNX1Data(response.data.NX1);

                setforgotStepOtp(false);
                setForgotStepReset(true);

                sessionStorage.removeItem("otpToken");
            }
            setLoading(false);
            
        } catch (error) {
            setLoading(false);
            alert(error);
            
        }
    }

    // OTP
    const getEmailByPurpose = (purpose: string) => {
        if (purpose === "REGISTER") {
            setState("otp");
            return registerData.email ;
        }
        if (purpose === "FORGOT"){
            setforgotStepOtp(true)
            return emailForgot;
        }
        return "";
    };
    const otpSubmit = async(e: React.FormEvent, purpose: string) => {
        e.preventDefault();
        if (!["REGISTER", "FORGOT"].includes(purpose)) {
            alert("Sai trạng thái");
            return;
        }
        const email = getEmailByPurpose(purpose);
        try {
            setLoading(true);
            const response = await api.post("/api/v1/auth/identifier", {
                "email" : email,
                "purpose": purpose
            });
            
            if (response.status === 200){
                sessionStorage.setItem("otpToken", response.data.otpToken);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            alert(error);
        }
    }

    const registerSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let otp ="";
        for (let i = 1; i <= 6; i++) {
            const input = document.getElementById(`otp-reg-${i}` ) as HTMLInputElement;
            if (!input || !input.value) {
                return; // chưa nhập đủ 6 số
            }
            otp += input.value;
        }
        try {
            const response = await api.post(`/api/v1/auth/register`, {
                "username" : registerData.fullName,
                "email" : registerData.email,
                "password" : registerData.password,
                "otp" : otp,
                "state" : sessionStorage.getItem("otpToken")
            })
            if (response.status == 200) {
                navigate("/");
            } else {
                alert("Thông tin gửi đi không hợp lệ !!");
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className="bg-slate-100 min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 selection:bg-slate-900 selection:text-white">
            <div className="bg-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(15,23,42,0.08),0_1px_3px_rgba(15,23,42,0.04)] border border-slate-200/60 w-full max-w-4xl min-h-[620px] flex flex-col md:flex-row overflow-hidden= smooth-transition">
                <div id="left-panel" className="w-full md:w-1/2 p-6 sm:p-10 md:p-12 flex flex-col justify-center bg-slate-50/50 md:border-r border-slate-100 smooth-transition">
                    {state == "login" && (
                        <div id="msg-login" className="space-y-6 smooth-transition opacity-100 transform translate-x-0 block md:flex md:flex-col">
                            <div className="space-y-3">
                                <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">Welcome Back</span>
                                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Chào mừng trở lại!</h2>
                                <p className="text-slate-500 text-sm leading-relaxed">Để tiếp tục hành trình khám phá và sử dụng các dịch vụ cao cấp, vui lòng đăng nhập bằng tài khoản của bạn.</p>
                            </div>
                            <div className="pt-2">
                                <p className="text-xs text-slate-400 mb-3">Chưa có tài khoản thành viên?</p>
                                <button onClick={() => {setState("register")}} className="w-full sm:w-auto px-6 py-2.5 border border-slate-300 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-900 hover:text-white hover:border-slate-900 active:scale-95 smooth-transition shadow-sm">
                                    Đăng ký tài khoản
                                </button>
                            </div>
                        </div>
                    )}

                    {state == "register" && (
                        <div id="form-register" className={`space-y-6 smooth-transition ${state=== "register" ? " opacity-100 translate-x-0 block": "opacity-0 transform -translate-x-4 hidden" }`}>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Tạo tài khoản mới</h2>
                                <p className="text-xs text-slate-400 mt-1">Đăng ký nhanh chóng chỉ trong vài bước</p>
                            </div>
                            
                            <form className="space-y-4" onSubmit={(e) => otpSubmit(e, "REGISTER")}>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Họ và tên</label>
                                    <input type="text" value={registerData.fullName} onChange={(e) => {setRegisterData({...registerData, fullName: e.target.value})}} required placeholder="Nguyễn Văn A" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white smooth-transition input-focus-effect outline-none"/>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Địa chỉ Email</label>
                                    <input type="email" value={registerData.email}  onChange={(e) => {setRegisterData({...registerData, email: e.target.value})}} required placeholder="name@example.com" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white smooth-transition input-focus-effect outline-none"/>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Mật khẩu</label>
                                    <input type="password" value={registerData.password}  onChange={(e) => {setRegisterData({...registerData, password: e.target.value})}} required placeholder="••••••••" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white smooth-transition input-focus-effect outline-none"/>
                                </div>
                                <button type="submit" className="w-full py-3 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 active:scale-[0.98] smooth-transition shadow-md">
                                    Đăng ký ngay
                                </button>
                                <button type="button" onClick={() => {setState("login")}} className="block md:hidden w-full text-center text-xs text-slate-500 hover:underline pt-2">
                                    Bạn đã có tài khoản? <span className="font-semibold text-slate-800">Đăng nhập</span>
                                </button>
                            </form>
                        </div>
                    )}

                    {state == "otp" && (
                        <div id="form-register-otp" className={`space-y-6 smooth-transition${state == "otp" ? "opacity-100 transform -translate-x-4" : "opacity-0 transform -translate-x-4 hidden"}`}>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Xác thực OTP</h2>
                                <p className="text-xs text-slate-400 mt-1">Vui lòng nhập mã số 6 chữ số vừa được gửi tới email đăng ký của bạn.</p>
                            </div>
                            
                            <form className="space-y-5" onSubmit={registerSubmit}>
                                <div className="flex justify-between gap-2 max-w-xs mx-auto">
                                    {[1, 2, 3, 4, 5, 6].map((i) => (
                                        <input type="text" key={i} id={`otp-reg-${i}`} onChange={(e) => handleOtpChange(e , "otp-reg-", i)} onKeyDown={(e) => handleOtpKeyDown(e, "otp-reg-", i)} className="w-10 h-12 sm:w-12 text-center text-lg font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 bg-white smooth-transition" required/>
                                    ))}
                                </div>

                                <button type="submit" className="w-full py-3 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 active:scale-[0.98] smooth-transition shadow-md">
                                    Xác nhận tài khoản
                                </button>
                                <button type="button" onClick={() => {setState("register")}} className="w-full text-center text-xs text-slate-400 hover:text-slate-800 transition underline">
                                    Quay lại sửa thông tin
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                <div id="right-panel" className="w-full md:w-1/2 p-6 sm:p-10 md:p-12 flex flex-col justify-center smooth-transition">
                    
                    {state == "login" && (
                        <div id="form-login" className="space-y-6 smooth-transition opacity-100 transform translate-x-0 block">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Đăng nhập hệ thống</h2>
                                <p className="text-xs text-slate-400 mt-1">Nhập thông tin tài khoản của bạn bên dưới</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button onClick={googleLogin} className="flex items-center justify-center space-x-2 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 active:scale-95 smooth-transition shadow-sm">
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                                    <span>Google</span>
                                </button>
                                <button onClick={facebookLogin} className="flex items-center justify-center space-x-2 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 active:scale-95 smooth-transition shadow-sm">
                                    <svg className="h-4 w-4 fill-[#1877F2]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                    <span>Facebook</span>
                                </button>
                            </div>

                            <div className="relative flex py-1 items-center">
                                <div className="flex-grow border-t border-slate-100"></div>
                                <span className="flex-shrink mx-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hoặc bằng Email</span>
                                <div className="flex-grow border-t border-slate-100"></div>
                            </div>

                            <form className="space-y-4" onSubmit={loginSubmit}>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Địa chỉ Email</label>
                                    <input name="email" type="email" placeholder="name@example.com" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white smooth-transition input-focus-effect outline-none"/>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-1.5">
                                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Mật khẩu</label>
                                        <button type="button" onClick={() => {setForgotModal(true)}} className="text-xs text-slate-400 hover:text-slate-900 smooth-transition hover:underline">Quên mật khẩu?</button>
                                    </div>
                                    <input name="password" type="password" placeholder="••••••••" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white smooth-transition input-focus-effect outline-none"/>
                                </div>
                                {errorLog && (<p className="mt-2 text-sm text-red-500">{errorLog}</p>)}
                                <button type="submit" className="w-full py-3 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 active:scale-[0.98] smooth-transition shadow-md">
                                    Đăng nhập
                                </button>
                                <button type="button" onClick={() => {setState("register")}} className="block md:hidden w-full text-center text-xs text-slate-500 hover:underline pt-2">
                                    Chưa có tài khoản? <span className="font-semibold text-slate-800">Đăng ký ngay</span>
                                </button>
                            </form>
                        </div>
                    )}

                    {["register", "otp"].includes(state) && (
                        <div 
                            id="msg-register" 
                            className={`space-y-6 smooth-transition ${["register", "otp"].includes(state) ? "opacity-100 translate-x-0 block" : "opacity-0 transform -translate-x-4 hidden"}`}
                        >
                            <div className="space-y-3">
                                <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">Join Us</span>
                                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Khám phá điều mới!</h2>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    Đăng ký ngay tài khoản hôm nay để nhận được các đặc quyền, thông báo cập nhật tính năng mới nhất từ hệ thống của chúng tôi.
                                </p>
                            </div>
                            <div className="pt-2">
                                <p className="text-xs text-slate-400 mb-3">Đã có tài khoản thành viên từ trước?</p>
                                <button 
                                    onClick={() => {setState("login")}} 
                                    className="w-full sm:w-auto px-6 py-2.5 border border-slate-300 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-900 hover:text-white hover:border-slate-900 active:scale-95 smooth-transition shadow-sm"
                                >
                                    Đăng nhập ngay
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {forgotModal && (
                    <div id="forgot-modal" className={`fixed inset-0 bg-slate-900/20 backdrop-blur-sm items-center justify-center p-4 z-50 smooth-transition ${forgotModal ? "flex opacity-100" : "hidden opacity-0" }`}>
                        <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 max-w-md w-full p-6 sm:p-8 space-y-5 transform scale-95 smooth-transition" id="modal-content">
                            {loading && (
                                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-2xl z-50">
                                    <div className="relative">
                                        <div className="w-12 h-12 border-4 border-slate-200 rounded-full"></div>
                                        <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-slate-900 rounded-full animate-spin"></div>
                                    </div>
                                </div>
                            )}
                            <div className="flex justify-end absolute top-4 right-4 z-10">
                                <button onClick={() => {setForgotModal(prev => !prev)}} className="text-slate-400 hover:text-slate-600 hover:bg-slate-50 p-1.5 rounded-lg smooth-transition">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            {forgotStepEmail && (
                                <div id="forgot-step-email" className="space-y-4 smooth-transition block opacity-100">
                                    <div className="space-y-1 pr-6">
                                        <h3 className="text-lg font-bold text-slate-900">Khôi phục mật khẩu</h3>
                                        <p className="text-xs text-slate-400 leading-relaxed">Nhập email của bạn để nhận mã OTP xác thực khôi phục mật khẩu.</p>
                                    </div>
                                    <form className="space-y-4" onSubmit={(e) => {setForgotStepEmail(false); otpSubmit(e, "FORGOT")}}>
                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Địa chỉ Email</label>
                                            <input value={emailForgot} onChange={(e) => {setEmailForgot(e.target.value)}} type="email" required placeholder="name@example.com" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white smooth-transition input-focus-effect outline-none"/>
                                        </div>
                                        <button type="submit" className="w-full py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 active:scale-95 smooth-transition shadow-md">
                                            Gửi mã OTP
                                        </button>
                                    </form>
                                </div>
                            )}

                            {forgotStepOtp && (
                                <div id="forgot-step-otp" className={`space-y-4 smooth-transition`} >
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-bold text-slate-900">Xác thực mã OTP</h3>
                                        <p className="text-xs text-slate-400 leading-relaxed">Mã OTP gồm 6 số vừa được gửi đến email của bạn.</p>
                                    </div>
                                    <form className="space-y-5" onSubmit={(e) => {verifyOtp(e, "FORGOT")}}>
                                        <div className="flex justify-between gap-2 max-w-xs mx-auto">
                                            {[1,2,3,4,5,6].map((i) => ( 
                                                <input key = {i} type="text" id={`otp-forgot-${i}`} onChange={(e) => handleOtpChange(e, "otp-forgot-", i)} onKeyDown={(e) => handleOtpKeyDown(e, "otp-forgot-", i)} className="w-10 h-12 text-center text-lg font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 bg-white smooth-transition" required/>
                                            ))}
                                        </div>
                                        <button  type="submit" className="w-full py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 active:scale-95 smooth-transition shadow-md">
                                            Xác nhận OTP
                                        </button>
                                    </form>
                                </div>
                            )}

                            {forgotStepReset && (
                                <div id="forgot-step-reset" className="space-y-4 smooth-transition">
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-bold text-slate-900">Đặt lại mật khẩu</h3>
                                        <p className="text-xs text-slate-400 leading-relaxed">Vui lòng tạo mật khẩu mới an toàn hơn cho tài khoản của bạn.</p>
                                    </div>
                                    <form className="space-y-4" onSubmit={forgotSubmit}>
                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Mật khẩu mới</label>
                                            <input name="password" type="password" required placeholder="••••••••" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white smooth-transition input-focus-effect outline-none"/>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Xác nhận mật khẩu mới</label>
                                            <input name = "confirmPassword" type="confirmPassword" required placeholder="••••••••" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white smooth-transition input-focus-effect outline-none"/>
                                        </div>
                                        <button type="submit" className="w-full py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 active:scale-95 smooth-transition shadow-md">
                                            Cập nhật mật khẩu
                                        </button>
                                    </form>
                                </div>  
                            )}
                        </div>
                    </div>
                )}
                
    
            </div>
        </div>
    );
}