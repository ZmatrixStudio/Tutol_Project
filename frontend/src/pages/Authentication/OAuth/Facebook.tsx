import { initializeApp } from "firebase/app";
import { getAuth, FacebookAuthProvider, signInWithPopup} from "firebase/auth";
import type { User } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBsajCFk20DUqUqq_PS7CQT_mCWgINWTiA",
  authDomain: "tutoroo-43684.web.app",
  projectId: "tutoroo-43684",
  storageBucket: "tutoroo-43684.firebasestorage.app",
  messagingSenderId: "276299346053",
  appId: "1:276299346053:web:6cfdf19b7296f41ae4f9ec",
  measurementId: "G-HF83J27RNX"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export async function loginFacebook(): Promise<User> {
  const provider = new FacebookAuthProvider();

  provider.addScope("email");

  const result = await signInWithPopup(auth, provider);

  return result.user;
}