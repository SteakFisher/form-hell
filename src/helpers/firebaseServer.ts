// Import the functions you need from the SDKs you need
import * as admin from "firebase-admin";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const serviceAccount = JSON.parse(
	process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string,
);

export default function FirebaseServer() {
	if (admin.apps.length === 0) {
		return admin.initializeApp({
			credential: admin.credential.cert(serviceAccount),
			databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
		});
	} else {
		return admin.apps[0];
	}
}
