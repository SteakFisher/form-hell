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
import { z } from "zod";

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
				let sendWebhookReq = () => {
					return new Promise<Errors | undefined>((resolve, reject) => {
						setTimeout(async () => {
							let webhookResponse = await fetch(webhookURL, {
								method: "POST",
								headers: {
									"Content-Type": "application/json",
								},
								body: JSON.stringify(finalResponse),
							});

							if (webhookResponse.status == 420) {
								let errorSchema = z.record(z.string(), z.string());
								let webhookError = await webhookResponse.json();

								try {
									let finalError: Errors =
										errorSchema.parse(webhookError);
									resolve(finalError);
								} catch (e) {
									resolve({});
								}
							} else resolve({});
						}, 2000);
						resolve({});
					});
				};

				let error = await sendWebhookReq();

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
			const formCollection = db.doc(`Responses/${formItemsObject.formId}`);
			let writeBatch = db.batch();

			let writeCount = 0;

			formItems.map(async (item) => {
				let responseId = formResponseObject.responseId;
				let responseCollection = formCollection
					.collection(`${item.id}`)
					.doc(responseId);

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
					writeBatch.set(responseCollection, {
						...finalResponse[item.id],
						selected: selected,
					});
					return;
				}

				writeCount++;
				writeBatch.set(responseCollection, finalResponse[item.id]);
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
