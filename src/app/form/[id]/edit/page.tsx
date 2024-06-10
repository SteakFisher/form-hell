import FormItem from "@/interfaces/FormItem";
import FormBuilderWrapper from "@/components/FormBuilderWrapper";
import FormItemsObject from "@/interfaces/FormItemsObject";

const Page = () => {
	const formItemsObject: FormItemsObject = JSON.parse(localStorage.getItem("formItemsObject") ?? '{}');

	return <FormBuilderWrapper formItemsObject={formItemsObject} />
};

export default Page;
