// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, collection } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCW0N36-SYgkgTvG1dOF7fJsOMw1Q3Cxwk",
  authDomain: "clinic-mate-e6cc7.firebaseapp.com",
  projectId: "clinic-mate-e6cc7",
  storageBucket: "clinic-mate-e6cc7.appspot.com",
  messagingSenderId: "13016211990",
  appId: "1:13016211990:web:11ddff36567105f919cb37",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
export const userRef = collection(db, "users");
export const roomRef = collection(db, "rooms");