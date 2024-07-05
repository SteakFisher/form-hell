import FormBuilderWrapper from "@/components/FormBuilderWrapper";
import { constants } from "@/constants";
import { FormItemsObject } from "formhell-js";
import { v4 as uuid } from "uuid";

export default function New() {
	let formItemsObject: FormItemsObject = {
		formId: uuid(),
		formItems: constants.defaultFormItems,
	};

	return <FormBuilderWrapper formObject={formItemsObject} type="new" />;
}
