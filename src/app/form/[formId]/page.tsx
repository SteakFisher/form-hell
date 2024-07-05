import FormRenderer from "@/components/form-display/FormRenderer";
import { Card } from "@/components/ui/card";
import { FormResponses } from "formhell-js";
import { auth } from "@/helpers/auth";
import { redirect } from "next/navigation";
import getFormById from "@/functions/getFormById";

const formResponses: FormResponses = {};

function sleep(ms = 0) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// bc1bbf14-57c4-4b3c-ab41-9dc0606c929c

export default async function Form({
	params: { formId },
}: {
	params: { formId: string };
}) {
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

	const formItemsObject = await getFormById(formId);

	if (!formItemsObject) return <h1>{"Form doesn't exist"}</h1>;

	return (
		<div className={"mb-4 mt-10 flex flex-grow justify-center"}>
			<Card className={"flex w-4/6 flex-col justify-center "}>
				<FormRenderer
					formItemsObject={formItemsObject}
					formResponses={formResponses}
				/>
			</Card>
		</div>
	);
}
