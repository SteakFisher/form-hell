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

export default function Form() {
  const {
    current: formItems
  } = useRef<FormItem[]>([{"id":"0","mediaProps":{"mediaAltText":"","mediaType":"image","mediaUrl":""},"props":{"description":"sfqwer","required":false,"title":"New test Form Title","type":"title"}},{"id":"8f8ee2fd-3650-4cf8-9ab5-117db1665f02","mediaProps":{"mediaAltText":"","mediaType":"image","mediaUrl":""},"props":{"altText":"LMFAO","mediaType":"image","required":false,"title":"The embed component","type":"media","url":"https://avatars.githubusercontent.com/u/54469796?s=48&v=4"}},{"id":"c674bbb8-599c-4e32-a683-daf4df269e8d","mediaProps":{"mediaAltText":"","mediaType":"image","mediaUrl":""},"props":{"allowMultiple":false,"hasOther":true,"items":[{"id":"7a581b65-033a-4e03-bdb8-f554f9e37d62","parentId":"c674bbb8-599c-4e32-a683-daf4df269e8d","value":"123"},{"id":"4a8deda6-a349-4b8a-9748-4a5d97147104","parentId":"c674bbb8-599c-4e32-a683-daf4df269e8d","value":"345"},{"id":"fcbc07fa-f84d-4408-a166-552163a12d2b","parentId":"c674bbb8-599c-4e32-a683-daf4df269e8d","value":"654"}],"required":true,"title":"Wanted other to be input","type":"multiple-choice"}},{"id":"b56d9a4c-c8f9-460f-85f4-e60ca6e849b4","mediaProps":{"mediaAltText":"","mediaType":"image","mediaUrl":""},"props":{"allowMultiple":true,"hasOther":true,"items":[{"id":"214dbe59-f0a4-45b6-ab5a-2c20757e879b","parentId":"b56d9a4c-c8f9-460f-85f4-e60ca6e849b4","value":"12"},{"id":"4af6459c-c937-4a88-90c8-6856a7ca7152","parentId":"b56d9a4c-c8f9-460f-85f4-e60ca6e849b4","value":"43"}],"required":true,"title":"1 more","type":"multiple-choice"}}])
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