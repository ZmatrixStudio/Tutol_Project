import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { loginFacebook } from "./OAuth/Facebook";
import { loginGoogle } from "./OAuth/Google";
import api from "../../api/axios";

type AuthState = "login" | "register" | "otp";
type LoadingType = "login" | "register" | "send-otp" | "verify-otp" | "forgot-email" | "forgot-otp" | "forgot-reset" | "google" | "facebook" | null;
type ToastType = "success" | "error" | "info";

interface ToastState {
  show: boolean;
  message: string;
  type: ToastType;
}

export default function IndexAuthentication() {
    const navigate = useNavigate();
    const [state, setState] = useState<AuthState>("login");
    const [loadingType, setLoadingType] = useState<LoadingType>(null);
    const [toast, setToast] = useState<ToastState>({ show: false, message: "", type: "info" });
    const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [emailForgot, setEmailForgot] = useState("");
        const [forgotModal, setForgotModal] = useState(false);
    const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1);
    const [registerData, setRegisterData] = useState({ fullName: "", email: "", password: "" });
    const [NX1Data, setNX1Data] = useState("");
    const [regOtp, setRegOtp] = useState<string[]>(Array(6).fill(""));
    const [forgotOtp, setForgotOtp] = useState<string[]>(Array(6).fill(""));

    const regOtpRefs = useRef<(HTMLInputElement | null)[]>([]);
    const forgotOtpRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        document.title = "Chào mừng bạn đã quay trở lại";
    }, []);

    // HÀM HIỂN THỊ THÔNG BÁO TOAST TRƯỢT TỪ BÊN PHẢI
    const showToast = (message: string, type: ToastType = "info") => {
        if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
        setToast({ show: true, message, type });

        toastTimerRef.current = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
        }, 4000);
    };

    // XỬ LÝ NHẬP OTP CHUNG
    const handleOtpInput = (
        value: string,
        index: number,
        otpArray: string[],
        setOtpArray: React.Dispatch<React.SetStateAction<string[]>>,
        refs: React.MutableRefObject<(HTMLInputElement | null)[]>
    ) => {
        const cleanVal = value.replace(/[^0-9]/g, "").slice(-1);
        const newOtp = [...otpArray];
        newOtp[index] = cleanVal;
        setOtpArray(newOtp);

        if (cleanVal && index < 5) {
        refs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        index: number,
        otpArray: string[],
        refs: React.MutableRefObject<(HTMLInputElement | null)[]>
    ) => {
        if (e.key === "Backspace" && !otpArray[index] && index > 0) {
        refs.current[index - 1]?.focus();
        }
    };

    // LOGIN
    const loginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoadingType("login");
        try {
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const res = await api.post("/api/v1/auth/login", { email, password }, { withCredentials: true });
        if (res.status === 200) {
            showToast("Đăng nhập thành công!", "success");
            window.location.reload();
        }
        } catch (err: any) {
        showToast(err.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại!", "error");
        } finally {
        setLoadingType(null);
        }
    };

    // GOOGLE LOGIN (Xử lý đóng popup thoát giữa chừng)
    const googleLogin = async () => {
    setLoadingType("google");

    // Bắt sự kiện người dùng quay lại màn hình chính (do tắt popup)
    const handleWindowFocus = () => {
        // Chờ 800ms để đảm bảo nếu đăng nhập thành công thì logic chính sẽ chạy trước
        setTimeout(() => {
        setLoadingType((prev) => (prev === "google" ? null : prev));
        window.removeEventListener("focus", handleWindowFocus);
        }, 800);
    };

    window.addEventListener("focus", handleWindowFocus);

    try {
        const googleData = await loginGoogle();
        if (!googleData) {
        showToast("Đã hủy đăng nhập bằng Google.", "info");
        return;
        }
        const res = await api.post("/api/v1/oauth/google", { token: googleData }, { withCredentials: true });
        if (res.status === 200) {
        showToast("Đăng nhập Google thành công!", "success");
        window.location.reload();
        }
    } catch (error: any) {
        showToast("Đã hủy hoặc xảy ra lỗi khi đăng nhập Google.", "error");
    } finally {
        window.removeEventListener("focus", handleWindowFocus);
        setLoadingType(null);
    }
    };

    // FACEBOOK LOGIN (Xử lý tương tự cho Facebook)
    const facebookLogin = async () => {
    setLoadingType("facebook");

    const handleWindowFocus = () => {
        setTimeout(() => {
        setLoadingType((prev) => (prev === "facebook" ? null : prev));
        window.removeEventListener("focus", handleWindowFocus);
        }, 800);
    };

    window.addEventListener("focus", handleWindowFocus);

    try {
        const facebookData = await loginFacebook();
        if (!facebookData) {
        showToast("Đã hủy đăng nhập bằng Facebook.", "info");
        return;
        }
        showToast("Đăng nhập Facebook thành công!", "success");
    } catch (error: any) {
        showToast("Đã hủy hoặc xảy ra lỗi khi đăng nhập Facebook.", "error");
    } finally {
        window.removeEventListener("focus", handleWindowFocus);
        setLoadingType(null);
    }
    };

    // GỬI OTP (cho Register hoặc Forgot)
    const otpSubmit = async (e: React.FormEvent, purpose: "REGISTER" | "FORGOT") => {
        e.preventDefault();
        const email = purpose === "REGISTER" ? registerData.email : emailForgot;
        if (!email) return;

        setLoadingType(purpose === "REGISTER" ? "send-otp" : "forgot-email");
        try {
        const response = await api.post("/api/v1/auth/identifier", { email, purpose });
        if (response.status === 200) {
            sessionStorage.setItem("otpToken", response.data.otpToken);
            showToast("Mã OTP đã được gửi về Email của bạn!", "success");
            if (purpose === "REGISTER") {
            setState("otp");
            } else {
            setForgotStep(2);
            }
        }
        } catch (error: any) {
        showToast(error.response?.data?.message || "Khởi tạo gửi OTP thất bại!", "error");
        } finally {
        setLoadingType(null);
        }
    };

    // REGISTER SUBMIT
    const registerSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpCode = regOtp.join("");
        if (otpCode.length < 6) {
        showToast("Vui lòng nhập đủ 6 số OTP", "error");
        return;
        }

        setLoadingType("verify-otp");
        try {
        const response = await api.post(`/api/v1/auth/register`, {
            username: registerData.fullName,
            email: registerData.email,
            password: registerData.password,
            otp: otpCode,
            state: sessionStorage.getItem("otpToken"),
        });

        if (response.status === 200) {
            showToast("Đăng ký tài khoản thành công!", "success");
            navigate("/");
        } else {
            showToast("Thông tin gửi đi không hợp lệ!", "error");
        }
        } catch (error: any) {
        showToast(error.response?.data?.message || "Xảy ra lỗi trong quá trình đăng ký!", "error");
        } finally {
        setLoadingType(null);
        }
    };

    // XÁC THỰC OTP QUÊN MẬT KHẨU
    const verifyForgotOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpCode = forgotOtp.join("");
        if (otpCode.length < 6) {
        showToast("Vui lòng nhập đủ 6 chữ số OTP!", "error");
        return;
        }

        setLoadingType("forgot-otp");
        try {
        const response = await api.post("/api/v1/auth/email-identifier", {
            email: emailForgot,
            otp: otpCode,
            state: sessionStorage.getItem("otpToken"),
            purpose: "FORGOT",
        });

        if (response.status === 200) {
            setNX1Data(response.data.NX1);
            setForgotStep(3);
            sessionStorage.removeItem("otpToken");
            showToast("Xác thực OTP thành công. Vui lòng nhập mật khẩu mới!", "success");
        }
        } catch (error: any) {
        showToast(error.response?.data?.message || "Mã OTP không chính xác hoặc đã hết hạn!", "error");
        } finally {
        setLoadingType(null);
        }
    };

    // ĐẶT LẠI MẬT KHẨU
    const forgotSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formDataForgot = new FormData(e.currentTarget);
        const passNew = formDataForgot.get("password") as string;
        const confirmPassword = formDataForgot.get("confirmPassword") as string;

        if (passNew !== confirmPassword) {
        showToast("Xác nhận mật khẩu không trùng khớp!", "error");
        return;
        }

        setLoadingType("forgot-reset");
        try {
        const resForgot = await api.post("/api/v1/auth/forgot", {
            email: emailForgot,
            password: passNew,
            NX1DEBUG: NX1Data,
        });

        if (resForgot.status === 200) {
            setForgotModal(false);
            setState("login");
            showToast("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.", "success");
        }
        } catch (error: any) {
        showToast(error.response?.data?.message || "Đổi mật khẩu thất bại!", "error");
        } finally {
        setLoadingType(null);
        }
    };

    // Component Nút Loading Tái Sử Dụng
    const Spinner = () => (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    );

  return (
    <div className="bg-slate-100 min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 selection:bg-slate-900 selection:text-white overflow-hidden relative">
        <div
            className={`fixed top-3 right-3 sm:top-5 sm:right-5 z-[9999] flex items-center w-full max-w-[280px] sm:max-w-sm p-2.5 sm:p-4 text-slate-700 bg-white rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl border border-slate-100/80 transition-all duration-300 ease-out transform ${
                toast.show ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
            }`}
            >
            <div className="flex-shrink-0">
                {toast.type === "success" && (
                <div className="p-1.5 sm:p-2 bg-emerald-50 rounded-lg sm:rounded-xl text-emerald-600">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                )}
                {toast.type === "error" && (
                <div className="p-1.5 sm:p-2 bg-rose-50 rounded-lg sm:rounded-xl text-rose-600">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                )}
                {toast.type === "info" && (
                <div className="p-1.5 sm:p-2 bg-sky-50 rounded-lg sm:rounded-xl text-sky-600">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                )}
            </div>

            <div className="ml-2.5 sm:ml-3 text-[11px] sm:text-xs font-medium text-slate-700 leading-tight sm:leading-snug flex-1">
                {toast.message}
            </div>

            <button
                onClick={() => setToast((prev) => ({ ...prev, show: false }))}
                className="ml-1.5 sm:ml-2 text-slate-300 hover:text-slate-600 p-0.5 sm:p-1 rounded-lg transition-colors"
            >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        {/* CARD MAIN CONTAINER */}
        <div className="bg-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(15,23,42,0.08),0_1px_3px_rgba(15,23,42,0.04)] border border-slate-200/60 w-full max-w-4xl min-h-[620px] flex flex-col md:flex-row overflow-hidden relative">
            
            {/* LEFT PANEL */}
            <div className="w-full md:w-1/2 p-6 sm:p-10 md:p-12 flex flex-col justify-center bg-slate-50/50 md:border-r border-slate-100 relative overflow-hidden transition-all duration-500 ease-in-out">
            
            {/* WELCOME MSG */}
            <div className={`space-y-6 transition-all duration-500 ease-in-out ${state === "login" ? "opacity-100 translate-x-0 relative z-10" : "opacity-0 -translate-x-10 pointer-events-none absolute inset-x-6 sm:inset-x-10 md:inset-x-12"}`}>
                <div className="space-y-3">
                <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">Welcome Back</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">Chào mừng trở lại!</h2>
                <p className="text-slate-500 text-sm leading-relaxed">
                    Để tiếp tục hành trình khám phá và sử dụng các dịch vụ cao cấp, vui lòng đăng nhập bằng tài khoản của bạn.
                </p>
                </div>
                <div className="pt-2">
                <p className="text-xs text-slate-400 mb-3">Chưa có tài khoản thành viên?</p>
                <button
                    onClick={() => setState("register")}
                    disabled={loadingType !== null}
                    className="w-full sm:w-auto px-6 py-2.5 border border-slate-300 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-900 hover:text-white hover:border-slate-900 active:scale-95 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:pointer-events-none"
                >
                    Đăng ký tài khoản
                </button>
                </div>
            </div>

            {/* REGISTER FORM */}
            <div className={`space-y-6 transition-all duration-500 ease-in-out ${state === "register" ? "opacity-100 translate-x-0 relative z-10" : "opacity-0 -translate-x-10 pointer-events-none absolute inset-x-6 sm:inset-x-10 md:inset-x-12"}`}>
                <div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Tạo tài khoản mới</h2>
                <p className="text-xs text-slate-400 mt-1">Đăng ký nhanh chóng chỉ trong vài bước</p>
                </div>

                <form className="space-y-4" onSubmit={(e) => otpSubmit(e, "REGISTER")}>
                <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Họ và tên</label>
                    <input
                    type="text"
                    value={registerData.fullName}
                    onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                    disabled={loadingType !== null}
                    required
                    placeholder="Nguyễn Văn A"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white transition-all focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                    />
                </div>
                <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Địa chỉ Email</label>
                    <input
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    disabled={loadingType !== null}
                    required
                    placeholder="name@example.com"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white transition-all focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                    />
                </div>
                <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Mật khẩu</label>
                    <input
                    type="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    disabled={loadingType !== null}
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white transition-all focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loadingType !== null}
                    className="w-full py-3 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all duration-200 shadow-md flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loadingType === "send-otp" ? <Spinner /> : null}
                    <span>{loadingType === "send-otp" ? "Đang gửi mã..." : "Đăng ký ngay"}</span>
                </button>
                <button
                    type="button"
                    onClick={() => setState("login")}
                    disabled={loadingType !== null}
                    className="block md:hidden w-full text-center text-xs text-slate-500 hover:underline pt-2 disabled:opacity-50"
                >
                    Bạn đã có tài khoản? <span className="font-semibold text-slate-800">Đăng nhập</span>
                </button>
                </form>
            </div>

            {/* OTP FORM REGISTER */}
            <div className={`space-y-6 transition-all duration-500 ease-in-out ${state === "otp" ? "opacity-100 translate-x-0 relative z-10" : "opacity-0 -translate-x-10 pointer-events-none absolute inset-x-6 sm:inset-x-10 md:inset-x-12"}`}>
                <div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Xác thực OTP</h2>
                <p className="text-xs text-slate-400 mt-1">Vui lòng nhập mã số 6 chữ số vừa được gửi tới email của bạn.</p>
                </div>

                <form className="space-y-5" onSubmit={registerSubmit}>
                <div className="flex justify-between gap-2 max-w-xs mx-auto">
                    {regOtp.map((digit, i) => (
                    <input
                        key={i}
                        ref={(el) => { regOtpRefs.current[i] = el; }}
                        type="text"
                        value={digit}
                        onChange={(e) => handleOtpInput(e.target.value, i, regOtp, setRegOtp, regOtpRefs)}
                        onKeyDown={(e) => handleOtpKeyDown(e, i, regOtp, regOtpRefs)}
                        disabled={loadingType !== null}
                        className="w-10 h-12 sm:w-12 text-center text-lg font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 bg-white transition-all disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                        required
                    />
                    ))}
                </div>

                <button
                    type="submit"
                    disabled={loadingType !== null}
                    className="w-full py-3 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all duration-200 shadow-md flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loadingType === "verify-otp" ? <Spinner /> : null}
                    <span>{loadingType === "verify-otp" ? "Đang xác thực..." : "Xác nhận tài khoản"}</span>
                </button>
                <button
                    type="button"
                    onClick={() => setState("register")}
                    disabled={loadingType !== null}
                    className="w-full text-center text-xs text-slate-400 hover:text-slate-800 transition underline disabled:opacity-50"
                >
                    Quay lại sửa thông tin
                </button>
                </form>
            </div>

            </div>

            {/* RIGHT PANEL */}
            <div className="w-full md:w-1/2 p-6 sm:p-10 md:p-12 flex flex-col justify-center relative overflow-hidden transition-all duration-500 ease-in-out">
            
            {/* LOGIN FORM */}
            <div className={`space-y-6 transition-all duration-500 ease-in-out ${state === "login" ? "opacity-100 translate-x-0 relative z-10" : "opacity-0 translate-x-10 pointer-events-none absolute inset-x-6 sm:inset-x-10 md:inset-x-12"}`}>
                <div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Đăng nhập hệ thống</h2>
                <p className="text-xs text-slate-400 mt-1">Nhập thông tin tài khoản của bạn bên dưới</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                <button
                    type="button"
                    onClick={googleLogin}
                    disabled={loadingType !== null}
                    className="flex items-center justify-center space-x-2 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 active:scale-95 transition-all duration-200 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loadingType === "google" ? (
                    <Spinner />
                    ) : (
                    <svg className="h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    )}
                    <span>Google</span>
                </button>

                <button
                    type="button"
                    onClick={facebookLogin}
                    disabled={loadingType !== null}
                    className="flex items-center justify-center space-x-2 py-2.5 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 active:scale-95 transition-all duration-200 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loadingType === "facebook" ? (
                    <Spinner />
                    ) : (
                    <svg className="h-4 w-4 fill-[#1877F2]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    )}
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
                    <input
                    name="email"
                    type="email"
                    disabled={loadingType !== null}
                    required
                    placeholder="name@example.com"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white transition-all focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                    />
                </div>
                <div>
                    <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Mật khẩu</label>
                    <button
                        type="button"
                        onClick={() => {
                        setForgotModal(true);
                        setForgotStep(1);
                        }}
                        disabled={loadingType !== null}
                        className="text-xs text-slate-400 hover:text-slate-900 transition-colors hover:underline disabled:opacity-50"
                    >
                        Quên mật khẩu?
                    </button>
                    </div>
                    <input
                    name="password"
                    type="password"
                    disabled={loadingType !== null}
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white transition-all focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loadingType !== null}
                    className="w-full py-3 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all duration-200 shadow-md flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loadingType === "login" ? <Spinner /> : null}
                    <span>{loadingType === "login" ? "Đang xử lý..." : "Đăng nhập"}</span>
                </button>

                <button
                    type="button"
                    onClick={() => setState("register")}
                    disabled={loadingType !== null}
                    className="block md:hidden w-full text-center text-xs text-slate-500 hover:underline pt-2 disabled:opacity-50"
                >
                    Chưa có tài khoản? <span className="font-semibold text-slate-800">Đăng ký ngay</span>
                </button>
                </form>
            </div>

            {/* JOIN US MSG */}
            <div className={`space-y-6 transition-all duration-500 ease-in-out ${["register", "otp"].includes(state) ? "opacity-100 translate-x-0 relative z-10" : "opacity-0 translate-x-10 pointer-events-none absolute inset-x-6 sm:inset-x-10 md:inset-x-12"}`}>
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
                    onClick={() => setState("login")}
                    disabled={loadingType !== null}
                    className="w-full sm:w-auto px-6 py-2.5 border border-slate-300 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-900 hover:text-white hover:border-slate-900 active:scale-95 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:pointer-events-none"
                >
                    Đăng nhập ngay
                </button>
                </div>
            </div>

            </div>
        </div>

        <div
            className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 z-50 transition-all duration-300 ease-out ${
            forgotModal ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
        >
            <div
            className={`bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-100 max-w-md w-full p-6 sm:p-8 space-y-5 transform transition-all duration-300 ease-out ${
                forgotModal ? "translate-y-0 opacity-100 scale-100" : "translate-y-12 opacity-0 scale-95"
            }`}
            >
            <div className="flex justify-end absolute top-4 right-4 z-10">
                <button
                onClick={() => setForgotModal(false)}
                disabled={loadingType !== null}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-50 p-1.5 rounded-lg transition-colors disabled:opacity-50"
                >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                </button>
            </div>

            {/* STEP 1: GỬI EMAIL */}
            {forgotStep === 1 && (
                <div className="space-y-4">
                <div className="space-y-1 pr-6">
                    <h3 className="text-lg font-bold text-slate-900">Khôi phục mật khẩu</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">Nhập email của bạn để nhận mã OTP xác thực khôi phục mật khẩu.</p>
                </div>
                <form className="space-y-4" onSubmit={(e) => otpSubmit(e, "FORGOT")}>
                    <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Địa chỉ Email</label>
                    <input
                        value={emailForgot}
                        onChange={(e) => setEmailForgot(e.target.value)}
                        disabled={loadingType !== null}
                        type="email"
                        required
                        placeholder="name@example.com"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white transition-all focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                    />
                    </div>
                    <button
                    type="submit"
                    disabled={loadingType !== null}
                    className="w-full py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 active:scale-95 transition-all shadow-md flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                    {loadingType === "forgot-email" ? <Spinner /> : null}
                    <span>{loadingType === "forgot-email" ? "Đang gửi..." : "Gửi mã OTP"}</span>
                    </button>
                </form>
                </div>
            )}

            {/* STEP 2: XÁC THỰC OTP QUÊN MẬT KHẨU */}
            {forgotStep === 2 && (
                <div className="space-y-4">
                <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900">Xác thực mã OTP</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">Mã OTP gồm 6 số vừa được gửi đến email của bạn.</p>
                </div>
                <form className="space-y-5" onSubmit={verifyForgotOtp}>
                    <div className="flex justify-between gap-2 max-w-xs mx-auto">
                    {forgotOtp.map((digit, i) => (
                        <input
                        key={i}
                        ref={(el) => { forgotOtpRefs.current[i] = el; }}
                        type="text"
                        value={digit}
                        onChange={(e) => handleOtpInput(e.target.value, i, forgotOtp, setForgotOtp, forgotOtpRefs)}
                        onKeyDown={(e) => handleOtpKeyDown(e, i, forgotOtp, forgotOtpRefs)}
                        disabled={loadingType !== null}
                        className="w-10 h-12 text-center text-lg font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 bg-white transition-all disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                        required
                        />
                    ))}
                    </div>
                    <button
                    type="submit"
                    disabled={loadingType !== null}
                    className="w-full py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 active:scale-95 transition-all shadow-md flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                    {loadingType === "forgot-otp" ? <Spinner /> : null}
                    <span>{loadingType === "forgot-otp" ? "Đang kiểm tra..." : "Xác nhận OTP"}</span>
                    </button>
                </form>
                </div>
            )}

            {/* STEP 3: ĐẶT LẠI MẬT KHẨU */}
            {forgotStep === 3 && (
                <div className="space-y-4">
                <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900">Đặt lại mật khẩu</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">Vui lòng tạo mật khẩu mới an toàn hơn cho tài khoản của bạn.</p>
                </div>
                <form className="space-y-4" onSubmit={forgotSubmit}>
                    <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Mật khẩu mới</label>
                    <input
                        name="password"
                        type="password"
                        disabled={loadingType !== null}
                        required
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white transition-all focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                    />
                    </div>
                    <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Xác nhận mật khẩu mới</label>
                    <input
                        name="confirmPassword"
                        type="password"
                        disabled={loadingType !== null}
                        required
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white transition-all focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                    />
                    </div>
                    <button
                    type="submit"
                    disabled={loadingType !== null}
                    className="w-full py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 active:scale-95 transition-all shadow-md flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                    {loadingType === "forgot-reset" ? <Spinner /> : null}
                    <span>{loadingType === "forgot-reset" ? "Đang cập nhật..." : "Cập nhật mật khẩu"}</span>
                    </button>
                </form>
                </div>
            )}
            </div>
        </div>
    </div>
  );
}