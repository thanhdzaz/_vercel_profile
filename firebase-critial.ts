// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCbuNjaEEyyqyVjsMpENIyjJxjURi2XFEY",
  authDomain: "videocollector-0000.firebaseapp.com",
  projectId: "videocollector-0000",
  storageBucket: "videocollector-0000.appspot.com",
  messagingSenderId: "42551320152",
  appId: "1:42551320152:web:a3fb13b03928fee97a742d",
  measurementId: "G-QT2XK3F9YB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);