// Import the functions you need from the SDKs you need
import { initializeApp ,getApps} from "firebase/app";
import { initializeAuth ,getReactNativePersistence, getAuth} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCqY3Kk2-rwSTWC8qdZJpAuDxKqT4iBziA",
  authDomain: "reactnative-d5537.firebaseapp.com",
  projectId: "reactnative-d5537",
  storageBucket: "reactnative-d5537.firebasestorage.app",
  messagingSenderId: "711874238676",
  appId: "1:711874238676:web:dcfb2b5e1d42c5a0928341"
};

// Initialize Firebase
let auth
let db
if (getApps().length === 0) {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = initializeAuth(app,
        {
            persistence :getReactNativePersistence(ReactNativeAsyncStorage) }
    );
    
}else {
    auth = getAuth();
    db = getFirestore();
}

export { auth, db };
