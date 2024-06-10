"use server";

import { FBValidate } from "@/functions/FBValidation";
import FormItem from "@/interfaces/FormItem";

export async function FBValidateAction(formItems: FormItem[]) {
	return FBValidate(formItems);
}
