import { NextRequest, NextResponse } from "next/server";
import firestoreServer from "@/helpers/firestoreServer";
import {
	DateResponse,
	getDateValidateObject,
	getDropdownValidateObject,
	getInputValidateObject,
	getMultipleChoiceGridValidateObject,
	getMultipleChoiceValidateObject,
	getRangeValidateObject,
	MultipleChoiceGridResponse,
	Response,
} from "formhell-js";

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

		switch (dataProps.type) {
			case "text-input":
				const zodInputObj = getInputValidateObject();
				let { success: inputSuccess } = zodInputObj.safeParse(dataProps);
				if (!inputSuccess) return;
				break;

			case "date":
				const zodDateObj = getDateValidateObject();
				let dateData = {
					type: "date",
					// @ts-ignore
					date: new Date(dataProps.date.seconds * 1000),
				} as DateResponse;
				let { success: dateSuccess } = zodDateObj.safeParse(dateData);
				if (!dateSuccess) return;
				break;

			case "range":
				const zodRangeObj = getRangeValidateObject();
				let { success: rangeSuccess } = zodRangeObj.safeParse(dataProps);
				if (!rangeSuccess) return;
				break;

			case "dropdown":
				const zodDropdownObj = getDropdownValidateObject();
				let { success: dropdownSuccess } =
					zodDropdownObj.safeParse(dataProps);
				if (!dropdownSuccess) return;
				break;

			case "multiple-choice":
				const zodMultipleChoiceObj = getMultipleChoiceValidateObject();
				let { success: multipleChoiceSuccess } =
					zodMultipleChoiceObj.safeParse(dataProps);
				if (!multipleChoiceSuccess) return;
				break;

			case "multiple-choice-grid":
				const zodMultipleChoiceGridObj =
					getMultipleChoiceGridValidateObject();

				let newDataProps = {
					type: "multiple-choice-grid",
					selected: {},
				} as MultipleChoiceGridResponse;

				let dropdownDataProps = dataProps.selected;

				Object.keys(dropdownDataProps).map((row) => {
					newDataProps.selected[row] = new Set(dropdownDataProps[row]);
				});

				let { success: multipleChoiceGridSuccess } =
					zodMultipleChoiceGridObj.safeParse(newDataProps);
				if (!multipleChoiceGridSuccess) return;
				break;

			default:
				return;
		}

		retComponentData.push(dataProps);
	});

	return NextResponse.json(retComponentData);
}
