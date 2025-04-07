importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyB6JDznIm2avK9vm8gwwBYKTk_QKZLNS_4",
  authDomain: "auto-auction-ce674.firebaseapp.com",
  projectId: "auto-auction-ce674",
  storageBucket: "auto-auction-ce674.firebasestorage.app",
  messagingSenderId: "1010506321111",
  appId: "1:1010506321111:web:b1110086aa738e1b873492",
  measurementId: "G-688ETJPH6Y"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("🌙 Received background message: ", payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo.png", 
  });
});
