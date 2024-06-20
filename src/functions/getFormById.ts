import { db } from "@/helpers/drizzleTurso";
import { formsTable } from "../../drizzle/schema";
import { and, eq } from "drizzle-orm";
import FBFormObject from "@/interfaces/FormItemsObject";

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
	const formObject: FBFormObject = {
		formId: res[0].formId,
		formItems: res[0].formJson,
	};

	return formObject;
}
