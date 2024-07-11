import FormRenderer from "@/components/form-display/FormRenderer";
import { Card } from "@/components/ui/card";
import getFormById from "@/functions/getFormById";
import { auth } from "@/helpers/auth";
import { FormResponses } from "formhell-js";
import { redirect } from "next/navigation";

const formResponses: FormResponses = {};

function sleep(ms = 0) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// http://localhost:3000/form/46742f85-e52a-4b76-9804-29e6a23ee957

export default async function Form({
	params: { formId },
}: {
	params: { formId: string };
}) {
	const formItemsObject = await getFormById(formId);

	if (!formItemsObject) return <h1>{"Form doesn't exist"}</h1>;

	let requiresSignIn: boolean = true;

	if (requiresSignIn) {
		const session = await auth();
		if (!session?.user)
			redirect(
				"/?" +
					new URLSearchParams({
						loginRedirect: `/form/${formId}`,
					}).toString(),
			);
	}

	return (
		<div className={"mb-4 mt-10 flex flex-grow justify-center"}>
			<Card className={"flex h-min w-4/6 flex-col"}>
				<FormRenderer
					formItemsObject={formItemsObject}
					formResponses={formResponses}
				/>
			</Card>
		</div>
	);
}
