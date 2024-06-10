import FormBuilderWrapper from "@/components/FormBuilderWrapper";
import {v4 as uuid} from "uuid";
import FormItemsObject from "@/interfaces/FormItemsObject";
import { constants } from "@/constants";

export default function New() {
	let formItemsObject : FormItemsObject = {
		formId: uuid(),
		formItems: constants.defaultFormItems,
	}

	return (
	 <FormBuilderWrapper formItemsObject={formItemsObject} />
  )
}