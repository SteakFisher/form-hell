import FormBuilderWrapper from "@/components/FormBuilderWrapper";
import { constants } from "@/constants";
import FBFormObject from "@/interfaces/FormItemsObject";
import { v4 as uuid } from "uuid";

export default function New() {
	let formItemsObject: FBFormObject = {
		formId: uuid(),
		formItems: constants.defaultFormItems,
	};

	return <FormBuilderWrapper formObject={formItemsObject} type="new" />;
}
