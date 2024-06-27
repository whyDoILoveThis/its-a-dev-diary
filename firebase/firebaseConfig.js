import { initializeApp } from "firebase/app";
import {getAuth, updateEmail, updatePassword, updateProfile} from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";



const firebaseConfig = {
  apiKey: "AIzaSyCqYQNIUekshh9MK4rKzymRSdz_cBoOzd0",
  authDomain: "its-a-dev-diary.firebaseapp.com",
  projectId: "its-a-dev-diary",
  storageBucket: "its-a-dev-diary.appspot.com",
  messagingSenderId: "203283876835",
  appId: "1:203283876835:web:abb91c4a1a833e0ca0eed6"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const firestore = getFirestore(app);
export const storage = getStorage(app);

export {updateEmail, updatePassword, updateProfile}

export default app;