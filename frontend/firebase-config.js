// Shared Firebase Configuration
// Import this in any HTML file that needs Firebase

// Firebase configuration object
export const firebaseConfig = {
  apiKey: "AIzaSyBAj2SLWwMSBDB4jl0VLjVhea9W6FkhXF0",
  authDomain: "my-career-project-a1885.firebaseapp.com",
  projectId: "my-career-project-a1885",
  storageBucket: "my-career-project-a1885.firebasestorage.app",
  messagingSenderId: "1006665032949",
  appId: "1:1006665032949:web:175f91f2559139cda8d1bc",
  measurementId: "G-V34ZR2C9PV"
};

// Firebase CDN URLs (v10.13.1)
export const firebaseUrls = {
  app: "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js",
  analytics: "https://www.gstatic.com/firebasejs/10.13.1/firebase-analytics.js",
  firestore: "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js",
  auth: "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js"
};

// Common Firestore collections
export const collections = {
  users: "users",
  jobs: "jobs", 
  applications: "applications",
  loginActivity: "loginActivity"
};
