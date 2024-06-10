import FirebaseServer from "@/helpers/firebaseServer";
import { getFirestore } from "firebase-admin/firestore";

export default function firestoreServer() {
	const app = FirebaseServer()

	if (!app) {
		throw new Error ("Firebase app not initialized")
	}

	return getFirestore(app);
}