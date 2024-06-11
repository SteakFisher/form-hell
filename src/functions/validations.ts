import FormItem from "@/interfaces/FormItem";
import { FormResponses, Response } from "@/interfaces/FormResponses";
import { z, ZodError } from "zod";
import TextInputResponse from "@/interfaces/form-component-response-interfaces/TextInputResponse";
import DropdownResponse from "@/interfaces/form-component-response-interfaces/DropdownResponse";
import DateResponse from "@/interfaces/form-component-response-interfaces/DateResponse";
import RangeResponse from "@/interfaces/form-component-response-interfaces/RangeResponse";
import { MultipleChoiceResponse } from "@/interfaces/form-component-response-interfaces/MultipleChoiceResponse";
import MultipleChoiceGridResponse from "@/interfaces/form-component-response-interfaces/MultipleChoiceGridResponse";

type Errors = {
  [id: string]: string
}



export function validateJSON(formItems: FormItem[], formResponses: FormResponses<Response>) {
  let errors : Errors  = {}
  let finalResponse = {} as FormResponses<Response>

  formItems.map((item) => {
    let response = formResponses[item.id]

    if (item.props.type === "title") return

    if (!response && item.props.required) {
      errors[item.id] = "This field is required"
      return
    } else if (!response) {
      return
    }

    // Validate the schema as a whole
    const responseValidate = z.object({
      input: z.string().optional(),
      selected: z.union([
        z.string(),
        z.record(
          z.string(),
          z.string().nullable()
        ),
        z.record(
          z.string(),
          z.set(z.string())
        )
      ]).optional(),
      date: z.date().optional(),
      range: z.number().optional(),
      type: z.string()
    }, {
      invalid_type_error: "Response object is invalid",
      required_error: "Response object is required",
      description: "Response object",
    }).strict()

    try {
      responseValidate.parse(response)
    } catch (e) {
      if (e instanceof ZodError) {
        errors[item.id] = e.errors[0].message
      }
    }

    switch (response.type) {
      case "text-input":
        validateTextInput(item, response as TextInputResponse, errors, finalResponse)
        break;
      case "dropdown":
        validateDropdownInput(item, response as DropdownResponse, errors, finalResponse)
        break;
      case "date":
        validateDateInput(item, response as DateResponse, errors, finalResponse)
        break;
      case "range":
        validateRangeInput(item, response as RangeResponse, errors, finalResponse)
        break;
      case "multiple-choice":
        validateMultipleChoiceInput(item, response as MultipleChoiceResponse, errors, finalResponse)
        break;
      case "multiple-choice-grid":
        validateMultipleChoiceGridInput(item, response as MultipleChoiceGridResponse, errors, finalResponse)
        break;
      default:
        errors[item.id] = "Invalid Item Type"
        break;
    }
  })

  if (Object.keys(errors).length != 0) finalResponse = {}


  return { finalResponse, errors }
}

function validateTextInput(item: FormItem, response: TextInputResponse, errors: Errors, finalResponse: FormResponses<Response>){
  if (item.props.type !== "text-input") return;

  if (!response.input && !item.props.required) return;

  let inputResponseValidate = z.string()

  if (item.props.lengthType === "characters") {
    if (item.props.maxLength) inputResponseValidate = inputResponseValidate.max(item.props.maxLength, { message: `Input can't be longer than ${item.props.maxLength} characters!`})
    if (item.props.minLength) inputResponseValidate = inputResponseValidate.min(item.props.minLength, {message: `Input can't be shorter than ${item.props.minLength} characters!`})
  }

  if (item.props.regexPattern) inputResponseValidate = inputResponseValidate.regex(new RegExp(item.props.regexPattern, item.props.regexFlags), {message: `Input doesn't match the regex ${item.props.regexPattern}`})

  let inputValidate = z.object({
    input: inputResponseValidate,
    type: z.literal("text-input")
  }, {
    invalid_type_error: "Text input response invalid",
    required_error: "Text input is required",
    description: "Text input response"
  }).strict()

  try {
    inputValidate.parse(response)
  } catch (e) {
    if (e instanceof ZodError) {
      errors[item.id] = e.errors[0].message
    }
  }

  if (item.props.lengthType === "words") {
    if (item.props.maxLength && item.props.maxLength < response.input.split(" ").length) {
      errors[item.id] =`Input can't be longer than ${item.props.maxLength} words!`
    }
    if (item.props.minLength && item.props.minLength > response.input.split(" ").length) {
      errors[item.id] =`Input can't be longer than ${item.props.maxLength} words!`
    }
  }

  if (Object.keys(errors).length === 0) {
    finalResponse[item.id] = response
  }
}

function validateDropdownInput(item: FormItem, response: DropdownResponse, errors: Errors, finalResponse: FormResponses<Response>){
  if (item.props.type !== "dropdown") return;

  if (!response.selected && !item.props.required) return;

  // Workaround for zod to work tsk tsk
  const zodLiterals = item.props.items.map((option) => z.literal(option.id)) as unknown as readonly [ z.ZodLiteral<string>, z.ZodLiteral<string>, ...z.ZodLiteral<string>[] ]

  let dropdownResponseValidate = z.object({
    selected: z.union(zodLiterals, {
      invalid_type_error: "Please select a valid option",
      required_error: "Please select a valid option",
      description: "Dropdown literal response"
    }),
    type: z.literal("dropdown")
  }, {
    invalid_type_error: "Dropdown response invalid",
    required_error: "Dropdown response is required",
    description: "Dropdown response"
  }).strict()

  try {
    dropdownResponseValidate.parse(response)
  } catch (e) {
    if (e instanceof ZodError) {
      errors[item.id] = e.errors[0].message
    }
  }

  if (Object.keys(errors).length === 0) {
    finalResponse[item.id] = response
  }
}

function validateDateInput(item: FormItem, response: DateResponse, errors: Errors, finalResponse: FormResponses<Response>) {
  if (item.props.type !== "date") return;

  if (!response.date && !item.props.required) return;

  let dateResponseValidate = z.object({
    date: z.date({
      required_error: "Please select a date and time",
      invalid_type_error: "That's not a date!"
    }),
    type: z.literal("date")
  }, {
    invalid_type_error: "Date response invalid",
    required_error: "Date response is required",
    description: "Date response"
  }).strict()

  try {
    dateResponseValidate.parse(response)
  } catch (e) {
    if (e instanceof ZodError) {
      errors[item.id] = e.errors[0].message
    }
  }

  if (Object.keys(errors).length === 0) {
    finalResponse[item.id] = response
  }
}

function validateRangeInput(item: FormItem, response: RangeResponse, errors: Errors, finalResponse: FormResponses<Response>) {
  if (item.props.type !== "range") return;

  if (!response.range && !item.props.required) return;

  let rangeResponseValidate = z.object({
    range: z.number().min(item.props.min).max(item.props.max, {message: `Value must be between ${item.props.min} and ${item.props.max}`}),
    type: z.literal("range")
  }, {
    invalid_type_error: "Range response invalid",
    required_error: "Range response is required",
    description: "Range response"
  }).strict()

  try {
    rangeResponseValidate.parse(response)
  } catch (e) {
    if (e instanceof ZodError) {
      errors[item.id] = e.errors[0].message
    }
  }

  if (Object.keys(errors).length === 0) {
    finalResponse[item.id] = response
  }
}

function validateMultipleChoiceInput(item: FormItem, response: MultipleChoiceResponse, errors: Errors, finalResponse: FormResponses<Response>){
  if (item.props.type !== "multiple-choice") return;

  if ((!response.selected || Object.keys(response.selected).length == 0) && !item.props.required) return;

  // Workaround for zod to work tsk tsk
  const zodLiteralsKeys = item.props.items.map((option) => z.literal(option.id))  as unknown as readonly [ z.ZodLiteral<string>, z.ZodLiteral<string>, ...z.ZodLiteral<string>[] ]


  let multipleChoiceResponseValidate = z.object({
    selected: z.record(
      z.union([...zodLiteralsKeys, z.literal("other")]),
      z.string()
    ),
    type: z.literal("multiple-choice")
  }, {
    invalid_type_error: "Multiple choice response invalid",
    required_error: "Multiple choice response is required",
    description: "Multiple choice response"
  }).strict()

  try {
    multipleChoiceResponseValidate.parse(response)
  } catch (e) {
    if (e instanceof ZodError) {
      errors[item.id] = e.errors[0].message
    }
  }

  if (Object.keys(response.selected).length > 1 && !item.props.allowMultiple) {
    errors[item.id] = "Please select only one option"
  }
  if (Object.keys(response.selected).length > 1 && item.props.allowMultiple && response.selected["other"] != undefined) {
    errors[item.id] = "Selecting other limits you to only one option"
  }
  if (Object.keys(response.selected).length === 0 && item.props.required) {
    errors[item.id] = "This field is required"
  }

  if (Object.keys(errors).length === 0) {
    finalResponse[item.id] = response
  }
}

function validateMultipleChoiceGridInput(item: FormItem, response: MultipleChoiceGridResponse, errors: Errors, finalResponse: FormResponses<Response>){
  if (item.props.type !== "multiple-choice-grid") return;

  if ((!response.selected || Object.keys(response.selected).length == 0) && !item.props.required) return;

  // Workaround for zod to work tsk tsk
  const zodLiteralsRows = item.props.rows.map((option) => z.literal(option.id))  as unknown as readonly [ z.ZodLiteral<string>, z.ZodLiteral<string>, ...z.ZodLiteral<string>[] ]
  const zodLiteralColumns = item.props.columns.map((option) => z.literal(option.id))  as unknown as readonly [ z.ZodLiteral<string>, z.ZodLiteral<string>, ...z.ZodLiteral<string>[] ]


  let multipleChoiceResponseValidate = z.object({
    selected: z.record(
      z.union(zodLiteralsRows),
      z.set(z.union(zodLiteralColumns))
    , {
        required_error: "Please select a valid option",
        description: "Multiple choice grid response"
      }),
    type: z.literal("multiple-choice-grid")
  }, {
    invalid_type_error: "Multiple choice response invalid",
    required_error: "Multiple choice response is required",
    description: "Multiple choice response"
  }).strict()

  try {
    multipleChoiceResponseValidate.parse(response)
  } catch (e) {
    if (e instanceof ZodError) {
      errors[item.id] = e.errors[0].message
    }
  }

  let requireFlag = false;
  let validFlag = false;
  let tooManyEntriesFlag = false;
  let selected = response.selected

  let gridProps = item.props
  gridProps.rows.map((row) => {
    if (!selected[row.id]) requireFlag = true
    else if (selected[row.id]) {
      selected[row.id].forEach((entry) => {
        if (!gridProps.columns.map((column) => column.id).includes(entry)) validFlag = true
      })

      if (selected[row.id].size > 1 && !gridProps.allowMultiple) tooManyEntriesFlag = true
    }
  })

  if (requireFlag && item.props.required) errors[item.id] = "This field is required"
  if (validFlag) errors[item.id] = "Please select a valid option"
  if (tooManyEntriesFlag) errors[item.id] = "Please select only one option"


  if (Object.keys(errors).length === 0) {
    finalResponse[item.id] = response
  }
}