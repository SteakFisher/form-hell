// Import the functions you need from the SDKs you need
import * as admin from "firebase-admin";
import { credential } from "firebase-admin";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const serviceAccount = JSON.parse(
	process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
);

export default function Firebase() {
	// Your web app's Firebase configuration
	// const firebaseConfig = {
	// 	apiKey: process.env.API_KEY,
	// 	authDomain: process.env.AUTH_DOMAIN,
	// 	projectId: process.env.PROJECT_ID,
	// 	storageBucket: process.env.STORAGE_BUCKET,
	// 	messagingSenderId: process.env.MESSAGING_SENDER_ID,
	// 	appId: process.env.APP_ID
	// };

	if (admin.apps.length === 0) {
		return admin.initializeApp({
			credential: admin.credential.cert(serviceAccount),
			databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
		});
	} else {
		return admin.apps[0]
	}
}