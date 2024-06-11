"use server";

import { FBValidate } from "@/functions/FBValidation";
import FormItem from "@/interfaces/FormItem";

export async function FBValidateAction(formItems: FormItem[]) {
	return FBValidate(formItems);
	// localStorage.setItem("formItemsObject", JSON.stringify(formItems));
	// after saving
	// redirect(`/form/${3}/edit`);
}
