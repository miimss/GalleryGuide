import * as firebase from 'firebase';
import {
  API_KEY,
  AUTH_DOMAIN,
  DATABASE_URL,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGE_SENDER_ID,
  APP_ID
} from '@env';

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL: DATABASE_URL,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGE_SENDER_ID,
  appId: APP_ID
}


let firebaseApp = null;
if (!firebase.apps.length) {
  firebaseApp = firebase.initializeApp(firebaseConfig);
} else {
  firebaseApp = firebase.app();
}

export default firebaseApp;

export const firebaseAuth = firebase.auth();