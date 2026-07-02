import { googleLogout } from "@react-oauth/google";

declare global {
  interface Window {
    google?: any;
  }
}

const CLIENT_ID = "135399930194-9ktcepqiorba1kd5m50djhhksbee3afj.apps.googleusercontent.com";

export function loginGoogle(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!window.google) {
      reject(new Error("Google SDK chưa được tải"));
      return;
    }

    window.google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: (response: any) => {
        resolve(response.credential); // JWT của Google
      },
    });

    window.google.accounts.id.prompt();

    window.google.accounts.oauth2
      .initTokenClient({
        client_id: CLIENT_ID,
        scope: "openid email profile",
        callback: (tokenResponse: any) => {
          resolve(tokenResponse.access_token);
        },
      })
      .requestAccessToken();
  });
}

export function logoutGoogle() {
  googleLogout();
}