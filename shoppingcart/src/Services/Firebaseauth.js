import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDoEFBGSTYXBF_2L4fjGxvDfgxf_ci3iuk",
  authDomain: "fir-authjs-9523d.firebaseapp.com",
  projectId: "fir-authjs-9523d",
  storageBucket: "fir-authjs-9523d.firebasestorage.app",
  messagingSenderId: "38088133720",
  appId: "1:38088133720:web:404d68efccb4ed9cc44e2d",
  measurementId: "G-VLLRX0L2FK"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth;
