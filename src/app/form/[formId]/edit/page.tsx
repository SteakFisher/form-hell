import FormBuilderWrapper from "@/components/FormBuilderWrapper";
import getFormById from "@/functions/getFormById";

async function Page({ params }: { params: { formId: string } }) {
	const formObject = await getFormById(params.formId);

	if (!formObject) return <h1>Form doesn't exist</h1>;

	return <FormBuilderWrapper formObject={formObject} type="edit" />;
}

export default Page;
