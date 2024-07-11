import { NextRequest, NextResponse } from "next/server";
import firestoreServer from "@/helpers/firestoreServer";

export async function GET(
	req: NextRequest,
	{ params }: { params: { responseID: string; formID: string } },
) {
	const db = firestoreServer();

	const componentCollection = db
		.collection("Forms")
		.doc(params.formID)
		.collection("Response")
		.doc(params.responseID)
		.collection("Component");
	let componentData = await componentCollection.get();
	let retComponentData: FirebaseFirestore.DocumentData[] = [];

	componentData.docs.map((doc) => {
		retComponentData.push(doc.data());
	});

	return NextResponse.json(retComponentData);
}
