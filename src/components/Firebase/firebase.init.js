// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZ3iEyf5Axxv8PXFSoXHgl7_OucwRvbZo",
  authDomain: "test-project-b1a78.firebaseapp.com",
  projectId: "test-project-b1a78",
  storageBucket: "test-project-b1a78.firebasestorage.app",
  messagingSenderId: "438474355459",
  appId: "1:438474355459:web:951e9d128a0342266a2f36"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);