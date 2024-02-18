// Import the functions you need from the SDKs you need
import { getApp, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCHf5gSZ7SUNSOPPYsESFBBKTJP7ksgzJk",
  authDomain: "holo-uf-tg-bot.firebaseapp.com",
  projectId: "holo-uf-tg-bot",
  storageBucket: "holo-uf-tg-bot.appspot.com",
  messagingSenderId: "648249955573",
  appId: "1:648249955573:web:37b968a45adcb695bb21bc"
};

// Initialize Firebase

function createFirebaseApp(config: object) {
	try {
		return getApp();
	} catch {
		return initializeApp(config);
	}
}
const app = createFirebaseApp(firebaseConfig);
export const db = getFirestore(app);
