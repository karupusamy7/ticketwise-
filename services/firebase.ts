// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDg5tEksv2jvJK5SdHFLHJOb5s8kH_-ty0",
    authDomain: "ticket-wise.firebaseapp.com",
    projectId: "ticket-wise",
    storageBucket: "ticket-wise.firebasestorage.app",
    messagingSenderId: "709722216335",
    appId: "1:709722216335:web:fe3a79cd8fcd5597649dfa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };
