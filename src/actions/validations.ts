"use server"

import {FormResponse, Response} from "@/interfaces/FormResponse";
import FormItem from "@/interfaces/FormItem";
import {validateJSON} from "@/functions/validations";
import Firebase from "@/helpers/firebase";
import { getFirestore } from "firebase-admin/firestore";


export async function serverValidate(formItems: FormItem[], formResponses: FormResponse<Response>) {
  let errors = validateJSON(formItems, formResponses)
  if (Object.keys(errors).length > 0) {
    return errors
  } else {
    // Save the data
    const app = Firebase()

    if (!app) {
      errors["General"] = "Error initializing Firebase"
      return errors
    }

    const db = getFirestore(app);
    let document = await db.doc("Responses/FormID/ComponentID/ResponseID").get()
    console.log(document.data())

    return {}
  }// Otherwise save the data
}

