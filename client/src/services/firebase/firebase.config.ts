import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyB6JDznIm2avK9vm8gwwBYKTk_QKZLNS_4",
  authDomain: "auto-auction-ce674.firebaseapp.com",
  projectId: "auto-auction-ce674",
  storageBucket: "auto-auction-ce674.firebasestorage.app",
  messagingSenderId: "1010506321111",
  appId: "1:1010506321111:web:b1110086aa738e1b873492",
  measurementId: "G-688ETJPH6Y"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);

export {app,analytics,messaging}