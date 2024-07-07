import FormBuilderWrapper from "@/components/FormBuilderWrapper";
import { titleConstants } from "@/constants";
import { FBFormObject } from "formhell-js";
import { v4 as uuid } from "uuid";

export default function New() {
	let formItemsObject: FBFormObject = {
		formId: uuid(),
		formItems: [],
		formTitleObj: titleConstants.defaultProps,
	};

	return <FormBuilderWrapper formObject={formItemsObject} type="new" />;
}
