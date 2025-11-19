// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBrAYCTcg03FApdQgMGuO_kNalpPJiD7LI",
  authDomain: "agriguard-c638c.firebaseapp.com",
  projectId: "agriguard-c638c",
  storageBucket: "agriguard-c638c.firebasestorage.app",
  messagingSenderId: "660669350945",
  appId: "1:660669350945:web:bac1e6bfd9ba576d6a0f60",
  measurementId: "G-39BZP3LK28"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const firebaseApp = initializeApp(firebaseConfig);
