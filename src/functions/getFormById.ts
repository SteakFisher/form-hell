import { db } from "@/helpers/drizzleTurso";
import { and, eq } from "drizzle-orm";
import { FBFormObject } from "formhell-js";
import { formsTable } from "../../drizzle/schema";

export default async function getFormById(formId: string) {
	const res = await db
		.select()
		.from(formsTable)
		.where(
			and(
				eq(formsTable.formId, formId),
				eq(formsTable.userId, "TestUserId"),
			),
		);
	if (res.length === 0) {
		return;
	}
	const formObject: FBFormObject = res[0].formJson;
	return formObject;
}
