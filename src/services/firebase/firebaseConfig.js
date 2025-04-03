// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth"; // Import Firebase Authentication

const firebaseConfig = {
  apiKey: "AIzaSyBflLdTkessKwOAOOsmoj6HyP6VSaLJseI",
  authDomain: "vticinema.firebaseapp.com",
  databaseURL: "https://vticinema-default-rtdb.firebaseio.com",
  projectId: "vticinema",
  storageBucket: "vticinema.firebasestorage.app",
  messagingSenderId: "770060105597",
  appId: "1:770060105597:web:48f335b17eec7a9d8d3e14",
  measurementId: "G-WVYBZBEH88",
};

// Khởi tạo ứng dụng Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo đối tượng db cho Realtime Database
const db = getDatabase(app);

// Khởi tạo đối tượng auth cho Firebase Authentication
const auth = getAuth(app); // Đây là đối tượng để sử dụng Firebase Authentication

export default { db, auth };
