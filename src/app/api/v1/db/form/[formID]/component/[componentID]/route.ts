import { NextRequest, NextResponse } from "next/server";
import firestoreServer from "@/helpers/firestoreServer";

export async function GET(
	req: NextRequest,
	{ params }: { params: { componentID: string; formID: string } },
) {
	const db = firestoreServer();

	const componentCollection = db
		.collection("Forms")
		.doc(params.formID)
		.collection("Response");

	const componentDocsList = await componentCollection.listDocuments();

	const promiseResolutionQueue: Promise<FirebaseFirestore.DocumentData>[] = [];

	componentDocsList.map((doc) => {
		promiseResolutionQueue.push(
			new Promise(async (resolve, reject) => {
				let data = (
					await doc.collection("Component").doc(params.componentID).get()
				).data();
				if (!data) return resolve({});
				resolve(data);
			}),
		);
	});

	let resolved = await Promise.all(promiseResolutionQueue);

	return NextResponse.json(resolved);
}
