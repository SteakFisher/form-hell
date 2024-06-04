"use server"

import {FormResponse, Response} from "@/interfaces/FormResponse";
import FormItem from "@/interfaces/FormItem";
import {validateJSON} from "@/functions/validations";

type Errors = {
  [id: string]: string
}

export async function serverValidate(formItems: FormItem[], formResponses: FormResponse<Response>) {
  let errors = validateJSON(formItems, formResponses)
  if (Object.keys(errors).length > 0) {
    return errors
  } else {
    return {}
  }// Otherwise save the data
}

