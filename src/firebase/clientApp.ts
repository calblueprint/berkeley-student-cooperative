import { initializeApp } from 'firebase/app'
import { Analytics, getAnalytics } from 'firebase/analytics'
import { Firestore, getFirestore } from 'firebase/firestore'
import { Auth, getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase

console.log('fbconfig is', firebaseConfig)
const firebaseApp = initializeApp(firebaseConfig)
let analytics: Analytics, firestore: Firestore, auth: Auth // TYPES!! Imported from Firebase!

if (firebaseConfig?.projectId) {
  if (firebaseApp.name && typeof window !== 'undefined') {
    analytics = getAnalytics(firebaseApp) // HOVER OVER GETANALYTICS FOR RETURN TYPE
  }

  // Access Firebase services using shorthand notation
  firestore = getFirestore(firebaseApp) // HOVER OVER GETFIREBASE FOR RETURN TYPE
  auth = getAuth(firebaseApp)
}

export { firestore, analytics, auth }

// // Import the functions you need from the SDKs you need
// import { initializeApp } from 'firebase/app'
// import { Analytics, getAnalytics } from 'firebase/analytics'
// import { Firestore, getFirestore } from 'firebase/firestore'

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
// }

// // Initialize Firebase
// const firebaseApp = initializeApp(firebaseConfig)
// let analytics: Analytics, firestore: Firestore // TYPES!! Imported from Firebase!
// if (firebaseConfig?.projectId) {
//   // Initialize Firebase
//   const app = initializeApp(firebaseConfig)

//   if (app.name && typeof window !== 'undefined') {
//     analytics = getAnalytics(app) // HOVER OVER GETANALYTICS FOR RETURN TYPE
//   }

//   // Access Firebase services using shorthand notation
//   firestore = getFirestore(firebaseApp) // HOVER OVER GETFIREBASE FOR RETURN TYPE
// }

// export { firestore, analytics }
