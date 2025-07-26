/* ---------------------------------------------------------------------------------------------
* Copyright (c) 2025 Blinkr Team, PFMCODES Org. All rights reserved.
* Licensed under the MIT License. See License(File) in the project root for license information.
*-----------------------------------------------------------------------------------------------*/

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4OsBaTnRWG_e18L3PipvNmJ4xmINcY90",
  authDomain: "blinkr-88096.firebaseapp.com",
  projectId: "blinkr-88096",
  storageBucket: "blinkr-88096.firebasestorage.app",
  messagingSenderId: "629211145870",
  appId: "1:629211145870:web:6ce36d4e0b3e45f2ce0bdf",
  measurementId: "G-FEY9WQLT0M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);