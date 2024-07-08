"use server";

import { FBValidate } from "@/functions/FBValidation";
import { db, increment } from "@/helpers/drizzleTurso";
import { eq } from "drizzle-orm";
import { FBFormObject } from "formhell-js";
import { v4 as uuid } from "uuid";
import { formsTable } from "../../drizzle/schema";

export async function FBValidateAction(
	formObject: FBFormObject,
	type: "edit" | "new",
) {
	const errorObj = await FBValidate(formObject);
	if (errorObj.message) return errorObj;

	if (type === "edit") {
		// store if present and permissions
		const res = await db
			.update(formsTable)
			.set({
				formJson: formObject,
				version: increment(formsTable.version),
			})
			.where(eq(formsTable.formId, formObject.formId))
			.returning({ formId: formsTable.formId });
		if (res.length === 0) return { message: "Form not found", id: "0" };
		return errorObj;
	} else if (type === "new") {
		// store if not present
		while ((await checkFormId(formObject.formId)).length !== 0) {
			formObject.formId = uuid();
		}
		await db
			.insert(formsTable)
			.values({
				userId: "TestUserId",
				formId: formObject.formId,
				formJson: formObject,
				version: 1,
			})
			.onConflictDoNothing();
		// in future batch as much requests as possible, including form json for edit
	}

	return errorObj;
}

async function checkFormId(id: string) {
	return db
		.select({ formId: formsTable.formId })
		.from(formsTable)
		.where(eq(formsTable.formId, id));
}
