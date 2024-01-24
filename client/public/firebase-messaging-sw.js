// Scripts for firebase and firebase messaging
importScripts(
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js'
);

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: 'AIzaSyBWtgPWk1N8iF0Axj05NfYvmMJ_wiJNKF8',
  authDomain: 'node-typescript-ec550.firebaseapp.com',
  projectId: 'node-typescript-ec550',
  storageBucket: 'node-typescript-ec550.appspot.com',
  messagingSenderId: '1050803800942',
  appId: '1:1050803800942:web:f8f48994b40b8d4fe1cf7f',
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
