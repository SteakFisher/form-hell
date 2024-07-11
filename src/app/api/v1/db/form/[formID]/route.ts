import { NextRequest, NextResponse } from "next/server";
import firestoreServer from "@/helpers/firestoreServer";

export async function GET(
	req: NextRequest,
	{ params }: { params: { formID: string } },
) {
	const db = firestoreServer();

	const componentCollection = db
		.collection("Forms")
		.doc(params.formID)
		.collection("Response");

	const componentDocsList = await componentCollection.listDocuments();

	const responseID: string[] = [];

	componentDocsList.map((doc) => {
		responseID.push(doc.id);
	});

	return NextResponse.json(responseID);
}
