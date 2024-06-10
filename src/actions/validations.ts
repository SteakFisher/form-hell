"use server";

import { FormResponses, Response } from "@/interfaces/FormResponses";
import { validateJSON } from "@/functions/validations";
import firestoreServer from "@/helpers/firestoreServer";
import FormResponseObject from "@/interfaces/FormResponseObject";
import { v4 as uuidv4 } from "uuid";
import FormItemsObject from "@/interfaces/FormItemsObject";
import MultipleChoiceGridResponse from "@/interfaces/form-component-response-interfaces/MultipleChoiceGridResponse";

type SelectedJSONGridResponse = {
   [key: string]: Array<string>
}


export async function serverValidate(formItemsObject: FormItemsObject, formResponses: FormResponses<Response>) {
  let formItems = formItemsObject.formItems

  let { finalResponse, errors } = validateJSON(formItems, formResponses)
  if (Object.keys(errors).length > 0) {
    return errors
  } else {
    try {
      let formResponseObject : FormResponseObject = {
        responseId: uuidv4(),
        formResponse: formResponses
      }

      // Save the data
      const db = firestoreServer()
      const formCollection =  db.doc(`Responses/${formItemsObject.formId}`)
      let writeBatch = db.batch();

      let writeCount = 0

      formItems.map(async (item) => {
        let responseId = formResponseObject.responseId
        let responseCollection = formCollection.collection(`${item.id}`).doc(responseId)

        if (finalResponse[item.id] == undefined) return

        if (finalResponse[item.id].type === "multiple-choice-grid") {
          let multipleChoiceGridResponse = finalResponse[item.id] as MultipleChoiceGridResponse
          let selected : SelectedJSONGridResponse = {}
          Object.keys(multipleChoiceGridResponse.selected).map((key) => {
            selected[key] = Array.from(multipleChoiceGridResponse.selected[key])
          })
          writeCount++
          writeBatch.set(responseCollection, { ...finalResponse[item.id], selected: selected })
          return
        }

        writeCount++
        writeBatch.set(responseCollection, finalResponse[item.id])
      })

      let result = await writeBatch.commit()

      console.log(result)

      if (result.length < writeCount) return { "error": "An error occurred while saving the data"}

      // let document = await db.doc(`Responses/FormID/ComponentID/ResponseID`).get()
      // console.log(document.data())

      return {}
    } catch (e) {
      return { "error": "An error occurred while saving the data"}
    }
  }// Otherwise save the data
}

