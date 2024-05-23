"use client"

import { toast } from "sonner"
import {useRef} from "react";
import FormItem from "@/interfaces/FormItem";
import TitleComponent from "@/components/form-display/TitleComponent";
import {Card} from "@/components/ui/card";
import TextInputComponent from "@/components/form-display/TextInputComponent";
import MultipleChoiceComponent from "@/components/form-display/MultipleChoiceComponent";
import DropdownComponent from "@/components/form-display/DropdownComponent";
import RangeComponent from "@/components/form-display/RangeComponent";
import DateComponent from "@/components/form-display/DateComponent";
import {FormRendererContext} from "@/contexts/FormRendererContext";
import {FormResponse, Response} from "@/interfaces/FormResponse";
import {Button} from "@/components/ui/button";
import {validateJSON} from "@/functions/validations";
import {serverValidate} from "@/actions/validations";
import MultipleChoiceGridComponent from "@/components/form-display/MultipleChoiceGridComponent";
import MediaComponent from "@/components/form-display/MediaComponent";

export default function Form() {
  const {
    current: formItems
  } = useRef<FormItem[]>([{"id":"0","mediaProps":{"mediaAltText":"","mediaType":"image","mediaUrl":""},"props":{"description":"","required":false,"title":"","type":"title"}},{"id":"97096e5b-8d59-4da5-9b4c-aa23f9629b6b","mediaProps":{"mediaAltText":"","mediaType":"image","mediaUrl":""},"props":{"altText":"","mediaType":"video","required":false,"title":"AAAAHAHAHAHah","type":"media","url":"https://www.youtube.com/watch?v=SIaFtAKnqBU&pp=ygUOc2NyZWFtaW5nIGdvYXQ%3D"}}])
  const {
    current: formResponses
  } = useRef<FormResponse<Response>>({});

  return (
    <FormRendererContext.Provider value={
      {
        formResponses: formResponses,
      }
    }>
      <div className={"flex justify-center flex-grow mt-10 mb-4"}>
        <Card className={"flex flex-col w-4/6 justify-center "}>
          <form action={async () => {
            let errors = validateJSON(formItems, formResponses)
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
            {
              formItems.map((item) => {
                switch (item.props.type) {
                  case "title":
                    return <TitleComponent key={item.id} props={item.props}/>;
                  case "text-input":
                    return <TextInputComponent key={item.id} id={item.id} props={item.props}/>;
                  case "multiple-choice":
                    return <MultipleChoiceComponent key={item.id} id={item.id} props={item.props}/>;
                  case "dropdown":
                    return <DropdownComponent key={item.id} id={item.id} props={item.props}/>;
                  case "range":
                    formResponses[item.id] = formResponses[item.id] ?? { range: item.props.min, type: "range" }
                    return <RangeComponent key={item.id} id={item.id} props={item.props}/>;
                  case "multiple-choice-grid":
                    return <MultipleChoiceGridComponent key={item.id} id={item.id} props={item.props}/>;
                  case "date":
                    return <DateComponent key={item.id} id={item.id} props={item.props}/>;
                  case "media":
                    return <MediaComponent key={item.id} id={item.id} props={item.props}/>;
                  default:
                    return null;
                }
              })
            }
            <Button>
              <input className={"cursor-pointer"} type={"submit"} />
            </Button>
          </form>
        </Card>
      </div>
    </FormRendererContext.Provider>
  );
}