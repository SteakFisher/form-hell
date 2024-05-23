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
  } = useRef<FormItem[]>([{"id":"0","mediaProps":{"mediaAltText":"","mediaType":"image","mediaUrl":""},"props":{"description":"","required":false,"title":"","type":"title"}},{"id":"c2e4b47b-0283-426f-8e29-5e2eed23d905","mediaProps":{"mediaAltText":"","mediaType":"image","mediaUrl":""},"props":{"min":0,"max":4,"step":1,"required":false,"title":"","type":"range"}},{"id":"584f4bbc-3821-4ec1-b0ef-dcb93ee892e4","mediaProps":{"mediaAltText":"","mediaType":"image","mediaUrl":""},"props":{"allowMultiple":true,"hasOther":true,"items":[{"id":"74669d3c-4e8c-430c-b4c6-1ec2d048dfab","parentId":"584f4bbc-3821-4ec1-b0ef-dcb93ee892e4","value":"1"},{"id":"e81816a0-6697-4959-bed2-55dec5101174","parentId":"584f4bbc-3821-4ec1-b0ef-dcb93ee892e4","value":"2"}],"required":true,"title":"Yea","type":"multiple-choice"}},{"id":"3f659519-25c4-486a-9f65-c3074ae50b79","mediaProps":{"mediaAltText":"","mediaType":"image","mediaUrl":""},"props":{"allowMultiple":false,"hasOther":true,"items":[{"id":"c554f498-05eb-4da1-9d7f-0a7a6169bc53","parentId":"3f659519-25c4-486a-9f65-c3074ae50b79","value":"1"},{"id":"3d721f69-5831-4310-bd78-05b29c0a8eea","parentId":"3f659519-25c4-486a-9f65-c3074ae50b79","value":"2"}],"required":true,"title":"Nope","type":"multiple-choice"}},{"id":"d24dd8ad-913e-4dfc-ac16-09f4392f3ff5","mediaProps":{"mediaAltText":"","mediaType":"image","mediaUrl":""},"props":{"altText":"dqweqwe","mediaType":"image","required":false,"title":"asdfasdf","type":"media","url":"https://avatars.githubusercontent.com/u/54469796?s=48&v=4"}}])
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