import FormBuilderWrapper from "@/components/FormBuilderWrapper";
import { db } from "@/helpers/drizzleTurso";
import FBFormObject from "@/interfaces/FormItemsObject";
import { and, eq } from "drizzle-orm";
import { formsTable } from "../../../../../drizzle/schema";

async function Page({ params }: { params: { formId: string } }) {
	const res = await db
		.select()
		.from(formsTable)
		.where(
			and(
				eq(formsTable.formId, params.formId),
				eq(formsTable.userId, "TestUserId"),
			),
		);
	if (res.length === 0) {
		return <div>Form not found</div>;
	}
	const formObject: FBFormObject = {
		formId: res[0].formId,
		formItems: res[0].formJson,
	};

	return <FormBuilderWrapper formObject={formObject} type="edit" />;
}

export default Page;
