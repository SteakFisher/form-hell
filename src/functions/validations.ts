import FormItem from "@/interfaces/FormItem";
import {FormResponse, Response} from "@/interfaces/FormResponse";
import zod, {z, ZodError} from "zod";

type Errors = {
  [id: string]: string
}

export function validateJSON(formItems: FormItem[], formResponses: FormResponse<Response>) {
  let errors : Errors  = {}
  formItems.map((item) => {
    let responses = formResponses[item.id]

    if (item.props.type === "title") return

    if (!formResponses[item.id] && item.props.required) {
      errors[item.id] = "This field is required"
    }

    if (formResponses[item.id] && responses.type === "date" && !zod.date().safeParse(responses.date)) {
      errors[item.id] = "Please select a valid date"
    }

    if (formResponses[item.id] && responses.type === "text-input" && item.props.type === "text-input") {
      let input = z.string()

      if (item.props.lengthType === "characters") {
        if (item.props.maxLength) input = input.max(item.props.maxLength, { message: `Input can't be longer than ${item.props.maxLength} characters!`})
        if (item.props.minLength) input = input.min(item.props.minLength, {message: `Input can't be shorter than ${item.props.minLength} characters!`})
      }

      else if (item.props.lengthType === "words") {
        if (item.props.maxLength && item.props.maxLength < responses.input.split(" ").length) {
          errors[item.id] =`Input can't be longer than ${item.props.maxLength} words!`
        }
        if (item.props.minLength && item.props.minLength > responses.input.split(" ").length) {
          errors[item.id] =`Input can't be longer than ${item.props.maxLength} words!`
        }
      }

      if (item.props.regex) input = input.regex(new RegExp(item.props.regex, item.props.regexFlags), {message: `Input doesn't match the regex ${item.props.regex}`})

      try {
        input.parse(responses.input)
        console.log(responses.input)
      } catch (e) {
        if (e instanceof ZodError) {
          errors[item.id] = e.errors[0].message
        }
      }
    }

    if (formResponses[item.id] && responses.type === "dropdown" && item.props.type === "dropdown") {
      if (!item.props.items.map((option) => option.value).includes(responses.selected)) {
        errors[item.id] = "Please select a valid option"
      }
    }

    if (formResponses[item.id] && responses.type === "multiple-choice" && item.props.type === "multiple-choice") {
      if (responses.selected.size > 1 && !item.props.allowMultiple) {
        errors[item.id] = "Please select only one option"
      }
      if (responses.selected.size > 1 && item.props.allowMultiple && responses.selected.has("other")) {
        errors[item.id] = "Selecting other limits you to only one option"
      }
      if (responses.selected.size === 0 && item.props.required) {
        errors[item.id] = "This field is required"
      }
    }
  })

  return errors
}