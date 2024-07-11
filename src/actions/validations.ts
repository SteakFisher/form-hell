"use server";

import {
	FormResponseObject,
	FormResponses,
	MultipleChoiceGridResponse,
	validateFormResponse,
} from "formhell-js";
import firestoreServer from "@/helpers/firestoreServer";
import { v4 as uuidv4 } from "uuid";
import getFormById from "@/functions/getFormById";
import { webhookValidation } from "@/functions/validations/webhookValidation";

type SelectedJSONGridResponse = {
	[key: string]: Array<string>;
};

type Errors = {
	[id: string]: string;
};

export async function serverValidate(
	formId: string,
	formResponses: FormResponses,
) {
	const formItemsObject = await getFormById(formId);

	if (!formItemsObject)
		return {
			error: "Form ID provided was invalid",
		};

	let formItems = formItemsObject.formItems;

	let formResponseObject: FormResponseObject = {
		responseId: uuidv4(),
		formResponse: formResponses,
	};

	let { finalResponse, errors } = validateFormResponse(
		formItemsObject,
		formResponseObject,
	);

	if (Object.keys(errors).length > 0) {
		return errors;
	} else {
		let webhookURL = "http://localhost:5000/validate";

		if (webhookURL) {
			try {
				let error = await webhookValidation(webhookURL, finalResponse);

				if (error && Object.keys(error).length > 0) {
					return error;
				}
			} catch (e) {
				return {};
			}
		}

		try {
			// Save the data
			const db = firestoreServer();
			const formCollection = db.doc(`Forms/${formItemsObject.formId}`);
			let writeBatch = db.batch();

			writeBatch.set(formCollection, { version: 0 });

			let writeCount = 0;

			let responseId = formResponseObject.responseId;
			let responseCollection = formCollection
				.collection(`Response`)
				.doc(responseId);
			writeBatch.set(responseCollection, { amount: 0 });

			formItems.map(async (item) => {
				let responseComponentCollection = responseCollection
					.collection(`Component`)
					.doc(`${item.id}`);

				if (finalResponse[item.id] == undefined) return;

				if (finalResponse[item.id].type === "multiple-choice-grid") {
					let multipleChoiceGridResponse = finalResponse[
						item.id
					] as MultipleChoiceGridResponse;
					let selected: SelectedJSONGridResponse = {};
					Object.keys(multipleChoiceGridResponse.selected).map((key) => {
						selected[key] = Array.from(
							multipleChoiceGridResponse.selected[key],
						);
					});
					writeCount++;
					writeBatch.set(responseComponentCollection, {
						...finalResponse[item.id],
						selected: selected,
					});
					return;
				}

				writeCount++;
				writeBatch.set(responseComponentCollection, finalResponse[item.id]);
			});

			let result = await writeBatch.commit();

			if (result.length < writeCount)
				return { error: "An error occurred while saving the data" };

			return {};
		} catch (e) {
			return { error: "An error occurred while saving the data" };
		}
	} // Otherwise save the data
}
