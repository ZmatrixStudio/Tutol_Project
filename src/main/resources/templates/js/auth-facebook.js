window.fbAsyncInit = function () {
    FB.init({
        appId: "3940751182724418",
        xfbml: true,
        version: "v25.0",
    });
};

// Handle clicks on the "Log in with Facebook" button
function loginWithFacebook() {
    return new Promise((resolve, reject) => {
        FB.login(function (response) {
            console.log("FB.login response:", response);
            
            if (response.authResponse) {
                FB.api("/me",{locale: "en_US",fields: "id,name,email,first_name,last_name"},
                    function (userInfo) {
                        resolve(userInfo); 
                    }
                );
            } else {
                resolve(null); 
            }
        }, { scope: 'email' }); 
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

// ĐƯA DỮ LIỆU LÊN SERVER
async function handleFb() {
    try {
        const userData = await loginWithFacebook();
        
        if (userData) {
            // Dữ liệu đã được return và lưu vào biến userData
            console.log("Dữ liệu nhận được:", userData);
            
            // Render ra giao diện như code cũ của bạn
            document.getElementById("profile").innerHTML = `
                <h3>User Profile</h3>
                <p><b>ID:</b> ${userData.id || "N/A"}</p>
                <p><b>Name:</b> ${userData.name || "N/A"}</p>
                <p><b>First Name:</b> ${userData.first_name || "N/A"}</p>
                <p><b>Last Name:</b> ${userData.last_name || "N/A"}</p>
                <p><b>Email:</b> ${userData.email || "No email permission"}</p>
            `;
        } else {
            alert("Đăng nhập thất bại hoặc bị hủy.");
        }
    } catch (error) {
        console.error("Lỗi hệ thống:", error);
    }
}

// Gọi hàm này khi user click nút Đăng nhập
// <button onclick="handleLogin()">Login with Facebook</button>