import { NextRequest, NextResponse } from "next/server";
import firestoreServer from "@/helpers/firestoreServer";
import {
	DateResponse,
	FormItem,
	FormResponses,
	getDateValidateObject,
	getDropdownValidateObject,
	getInputValidateObject,
	getMultipleChoiceGridValidateObject,
	getMultipleChoiceValidateObject,
	getRangeValidateObject,
	MultipleChoiceGridResponse,
	Response,
} from "formhell-js";
import validateResponseComponent from "@/functions/validations/validateResponseComponent";

export async function GET(
	req: NextRequest,
	{ params }: { params: { componentID: string; formID: string } },
) {
	const db = firestoreServer();

	const componentCollection = db
		.collection("Responses")
		.doc(params.formID)
		.collection(params.componentID);

	let componentData = await componentCollection.get();
	let retComponentData: FirebaseFirestore.DocumentData[] = [];

	componentData.docs.map((doc) => {
		let dataProps = doc.data() as Response;

		dataProps = validateResponseComponent(dataProps);

		retComponentData.push(dataProps);
	});

	return NextResponse.json(retComponentData as FormResponses[]);
}
