// FIREBASE IMPORTS
import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getAuth } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { getFirestore } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// YOUR FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyBym3TSLHx3uW8P0U1-cTV0SWrCt1uAqvc",
  authDomain: "study-planner-f0f01.firebaseapp.com",
  projectId: "study-planner-f0f01",
  storageBucket: "study-planner-f0f01.appspot.com",
  messagingSenderId: "959236168287",
  appId: "1:959236168287:web:9a51404b5371b4795ed9ea"
};

// INITIALIZE FIREBASE
const app = initializeApp(firebaseConfig);

// EXPORT
export const auth = getAuth(app);
export const db = getFirestore(app);