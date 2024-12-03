import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { providerSignin } from "./actions/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB91vQLzXmQ7mqWKRCbvOTeNBcDjc7Vzz0",
  authDomain: "thoughts-area-ce3d6.firebaseapp.com",
  projectId: "thoughts-area-ce3d6",
  storageBucket: "thoughts-area-ce3d6.firebasestorage.app",
  messagingSenderId: "50121739192",
  appId: "1:50121739192:web:ad285c2848ef14c4989d4d",
  measurementId: "G-BVNENMFQW1",
};
export const GoogleSignin = async () => {
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const { photoURL, displayName, email } = user;
    if (!email) return;

    const answer = await providerSignin({
      email: email,
      name: displayName,
      image: photoURL,
      provider: "google",
    });
    return answer;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    return {
      success: false,
      message: "Something went wrong, Please try again later.",
    };
  }
};
let app: any;
let storage: any;
if (typeof window !== "undefined") {
  app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

  storage = getStorage(app);
}
export { storage };

export default app;
