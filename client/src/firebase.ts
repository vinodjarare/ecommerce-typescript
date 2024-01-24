// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBWtgPWk1N8iF0Axj05NfYvmMJ_wiJNKF8',
  authDomain: 'node-typescript-ec550.firebaseapp.com',
  projectId: 'node-typescript-ec550',
  storageBucket: 'node-typescript-ec550.appspot.com',
  messagingSenderId: '1050803800942',
  appId: '1:1050803800942:web:f8f48994b40b8d4fe1cf7f',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);

// create messaging instance

export const getTokenFCM = async () => {
  const token = await getToken(messaging, {
    vapidKey:
      'BFDks7w2HWC6KOB53-T59xERXhg2iopKJgSPGlexR4fuiJTSqrJOE3EJ1AAtC37NznpNhfEqvrD5sYzamelJhfo',
  });
  return token;
  console.log('token .....', token);
};
