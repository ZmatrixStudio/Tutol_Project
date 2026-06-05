import {headers} from "./get-headers.js";
import {AES} from "./signature.js"
import {device_id} from "./get-devices.js";

const keyBytes = new Uint8Array([
    0xbf, 0x58, 0x73, 0x25, 0xc9, 0x2b, 0x11, 0xd1, 
    0x87, 0xf4, 0xa0, 0x67, 0x19, 0x22, 0x1d, 0xc0, 
    0x3d, 0x7e, 0x9a, 0x28, 0x70, 0xb4, 0x15, 0x73, 
    0x00, 0x29, 0x85, 0xe7, 0xab, 0x93, 0x85, 0x7f
]); // ENC Auth Google
window.onload = function () {
    google.accounts.id.initialize({
        client_id: "135399930194-pmatudppnlqs1rbc6ffna5l2648doka4.apps.googleusercontent.com",
        callback: handleCredentialResponse
    });

    google.accounts.id.renderButton(
        document.getElementById("hidden-google-container"),
        { theme: "outline", size: "large" }
    );

    document.getElementById("google-custom-btn").addEventListener("click", function() {
        google.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                const nativeBtn = document.getElementById("hidden-google-container").querySelector("div[role=button]");
                if (nativeBtn) nativeBtn.click();
            }
        });
    });
    google.accounts.id.prompt(); 
};

async function handleCredentialResponse(response) {
    try {
        const idToken = response.credential;
        const raw = `${Date.now()}@${device_id()}|${idToken}`;
        const sign = await AES(`${raw}`, keyBytes);
        const authBody = `${sign.cipher}.${sign.nonce}`;
        const token = await new Promise((resolve) => {
            grecaptcha.ready(() => {
                grecaptcha.execute('6LdaoAwtAAAAAJGDRLJDtWFjA_KKWRdaY9KUXWEu', {action: 'google_auth'}).then(resolve);
            });
        });
        // Requests về backend
        const res =  await fetch("http://localhost:8080/api/v1/auth/google", {
            method: "POST", 
            headers: await headers(),
            body: JSON.stringify({
                "auth": authBody,
                "recaptchaToken": token
            })
        })

        const data = await res.json();
        console.log(data);
    } catch (error) {
        console.error("Đã xảy ra lỗi khi giải mã Token Google:", error);
    }
}