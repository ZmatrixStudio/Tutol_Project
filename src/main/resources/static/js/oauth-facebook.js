import {headers} from "./get-headers.js";

document.getElementById("facebook-btn").addEventListener("click", function() {
    handleFb();
});

window.fbAsyncInit = function () {
    FB.init({
        appId: window.FACEBOOK_APP_ID,
        xfbml: true,
        version: window.FACEBOOK_VERSION,
    });
};

// Handle clicks on the "Log in with Facebook" button
function loginWithFacebook() {
    return new Promise((resolve, reject) => {
        FB.login(function (response) {
            
            if (response.authResponse) {
                const accessToken = response.authResponse.accessToken;
                FB.api("/me",{locale: "en_US",fields: "id,name,email,picture"},
                    function (userInfo) {
                        resolve({
                            ...userInfo,
                            accessToken: accessToken
                        }); 
                    }
                );
            } else {
                resolve(null); 
            }
        }, { scope: 'email, public_profile' }); 
    });
}

// Load the JavaScript SDK asynchronously
(function (d, s, id) {
    var js,
        fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
})(document, "script", "facebook-jssdk");


// ĐƯA DỮ LIỆU ACCESS TOKEN LÊN SERVER
async function handleFb() {
    try {
        const userData = await loginWithFacebook();
        
        if (userData) {

            const token = await new Promise((resolve) => {
                grecaptcha.ready(() => {
                    grecaptcha.execute(window.RECAPTCHA_SITE_KEY, {action: 'facebook_oauth'}).then(resolve);
                });
            });
            // ĐẨY DỮ LIỆU LÊN SERVER
            const res = await fetch("http://localhost:8080/api/v1/oauth/facebook",{
                method: "POST",
                headers: await headers(),
                body:JSON.stringify({
                    "accessToken": userData.accessToken,
                    "recaptchaToken": token
                })
            })
            const data = await res.json();
            if (data.success) {
                localStorage.removeItem("T-Auth");
                // MỞ TRANG HOME LOGIN THÀNH CÔNG 
                location.href = "Home";
                return true;
            } else {
                showMessage(data.msg, false);
            }
        } else {
            alert("Đăng nhập thất bại hoặc bị hủy.");
        }
    } catch (error) {
        console.error("Lỗi hệ thống:", error);
    }
}

// Gọi hàm này khi user click nút Đăng nhập
// <button onclick="handleLogin()">Login with Facebook</button>