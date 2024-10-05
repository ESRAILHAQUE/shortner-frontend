// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCsTG3hJoVwkEAztkssLyrwfIJ0ribi_zE",
  authDomain: "toolhub-2c845.firebaseapp.com",
  projectId: "toolhub-2c845",
  storageBucket: "toolhub-2c845.appspot.com",
  messagingSenderId: "474395082260",
  appId: "1:474395082260:web:4d73a1d3c56be3b821b101",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

export { auth };
