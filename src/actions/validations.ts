"use server";

import { FormResponses, Response } from "@/interfaces/FormResponses";
import FormItem from "@/interfaces/FormItem";
import { validateJSON } from "@/functions/validations";
import firestoreServer from "@/helpers/firestoreServer";
import FormResponseObject from "@/interfaces/FormResponseObject";
import { v4 as uuidv4 } from "uuid";


export async function serverValidate(formItems: FormItem[], formResponses: FormResponses<Response>) {
  let formResponseObject : FormResponseObject = {
    responseId: uuidv4(),
    formResponse: formResponses
  }
  let { finalResponse, errors } = validateJSON(formItems, formResponseObject)
  if (Object.keys(errors).length > 0) {
    return errors
  } else {
    // Save the data
    const db = firestoreServer()
    let document = await db.doc(`Responses/FormID/ComponentID/ResponseID`).get()
    console.log(document.data())

    return {}
  }// Otherwise save the data
}

