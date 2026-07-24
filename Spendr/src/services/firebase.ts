import AsyncStorage from "@react-native-async-storage/async-storage";
import { FirebaseOptions, getApp, getApps, initializeApp } from "firebase/app";
import { Auth, getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import { Platform } from "react-native";

// TODO: Replace every placeholder with the Firebase web app configuration from your Firebase console.
const firebaseConfig = {
  apiKey: "AIzaSyDXSHvCcPWi0SFX4F5vZBxBxZFo2_2lyEA",
  authDomain: "spendr-expensetracker.firebaseapp.com",
  projectId: "spendr-expensetracker",
  storageBucket: "spendr-expensetracker.firebasestorage.app",
  messagingSenderId: "916539149841",
  appId: "1:916539149841:web:10b89c7013550c14aa6bb0"
};

const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

function createAuth(): Auth {
  if (Platform.OS === "web") {
    return getAuth(firebaseApp);
  }

  try {
    return initializeAuth(firebaseApp, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    return getAuth(firebaseApp);
  }
}

export const auth = createAuth();
