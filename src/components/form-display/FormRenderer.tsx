"use client"

import TitleComponent from "@/components/form-display/TitleComponent";
import TextInputComponent from "@/components/form-display/TextInputComponent";
import MultipleChoiceComponent from "@/components/form-display/MultipleChoiceComponent";
import DropdownComponent from "@/components/form-display/DropdownComponent";
import RangeComponent from "@/components/form-display/RangeComponent";
import MultipleChoiceGridComponent from "@/components/form-display/MultipleChoiceGridComponent";
import DateComponent from "@/components/form-display/DateComponent";
import MediaComponent from "@/components/form-display/MediaComponent";
import {FormRendererContext} from "@/contexts/FormRendererContext";
import {FormResponses, Response} from "@/interfaces/FormResponses";
import FormItem from "@/interfaces/FormItem";
import {validateJSON} from "@/functions/validations";
import {serverValidate} from "@/actions/validations";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";

export default function FormRenderer({ formItems, formResponses } : { formItems: FormItem[], formResponses: FormResponses<Response> }) {
  return (
    <form action={async () => {
      let { errors } = validateJSON(formItems, {
         responseId: "placeholderValue",
         formResponse: formResponses
      })
      if (Object.keys(errors).length == 0) {
        errors = await serverValidate(formItems, formResponses)
      }
      if (Object.keys(errors).length > 0) {
        Object.keys(errors).map((key) => {
          let name = formItems.filter((item) => item.id === key)[0].props.title
          toast.error(name, {
            description: errors[key]
          })
        })
      } else {
        toast.success("Form submitted successfully")
      }
    }} className={"flex flex-col justify-center "}>
      <FormRendererContext.Provider value={
        {
          formResponses: formResponses,
        }
      }>
        {
          formItems.map((item) => {
            switch (item.props.type) {
              case "title":
                return <TitleComponent key={item.id} props={item.props}/>;
              case "text-input":
                return <TextInputComponent key={item.id} id={item.id} item={item}/>;
              case "multiple-choice":
                return <MultipleChoiceComponent key={item.id} id={item.id} item={item}/>;
              case "dropdown":
                return <DropdownComponent key={item.id} id={item.id} item={item}/>;
              case "range":
                formResponses[item.id] = formResponses[item.id] ?? {range: item.props.min, type: "range"}
                return <RangeComponent key={item.id} id={item.id} item={item}/>;
              case "multiple-choice-grid":
                return <MultipleChoiceGridComponent key={item.id} id={item.id} item={item}/>;
              case "date":
                return <DateComponent key={item.id} id={item.id} item={item}/>;
              case "media":
                return <MediaComponent key={item.id} id={item.id} item={item}/>;
              default:
                return null;
            }
          })
        }
      </FormRendererContext.Provider>
      <Button>
        <input className={"cursor-pointer"} type={"submit"}/>
      </Button>
    </form>

  )
}