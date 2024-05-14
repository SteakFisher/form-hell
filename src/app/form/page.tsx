"use client"

import { toast } from "sonner"
import {useRef, useState} from "react";
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
import {getBindingIdentifiers} from "@babel/types";
import keys = getBindingIdentifiers.keys;

export default function Form() {
  const {
    current: formItems
  } = useRef<FormItem[]>([{"id":"0","props":{"description":"It's self explanatory.. hopefully some Lorem Ipsum BS in here","required":true,"title":"Test Form with all values filled in","type":"title"}},{"id":"e6b58b39-429e-4fdf-a3a2-0ae464a3660d","props":{"inputType":"short-text", "regexFlags": "","lengthType":"characters","minLength":5,"maxLength":10,"placeholder":"Placeholder for the text input","regex":"","regexMethod":"contains","required":true,"title":"Here's a Text input that can go bleh and yea","type":"text-input"}},{"id":"60b6bcc7-2432-4ace-8cac-521c0c6fcb45","props":{"allowMultiple":true,"hasOther":true,"items":[{"id":"e10b329d-8ac3-4564-ab13-f890f03acc39","parentId":"60b6bcc7-2432-4ace-8cac-521c0c6fcb45","value":"Option 1"},{"id":"9928d793-eb37-4184-8858-08bfba29bfa9","parentId":"60b6bcc7-2432-4ace-8cac-521c0c6fcb45","value":"Option 2 things"},{"id":"580d26e9-3ca6-4d82-b4ae-156a9fcc5e8e","parentId":"60b6bcc7-2432-4ace-8cac-521c0c6fcb45","value":"and yeaaaa"}],"required":true,"title":"Here's a multiple choice thing thats yeaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","type":"multiple-choice"}},{"id":"c96f9325-c6bc-45e3-ad4d-2f1352232e47","props":{"items":[{"id":"1463b161-6504-402d-a3bf-6e4054c6f3a8","parentId":"c96f9325-c6bc-45e3-ad4d-2f1352232e47","value":"Kekw"},{"id":"5808e2e1-6b8b-4be0-9709-48dcfb77caa4","parentId":"c96f9325-c6bc-45e3-ad4d-2f1352232e47","value":"Jeezzlaweez"},{"id":"6709c8a8-c1a0-4bc8-99a8-653edeb2abf3","parentId":"c96f9325-c6bc-45e3-ad4d-2f1352232e47","value":"gaaah"}],"required":true,"title":"Dropdown selection thignaling","type":"dropdown"}},{"id":"d9bc57bb-dbb1-4624-ac1c-091e41e47027","props":{"min":0,"max":50,"step":10,"required":true,"title":"Range thingy","type":"range"}},{"id":"3d77bf0b-e75a-4187-b794-da08430f999c","props":{"required":true,"title":"Last but not least a date picker thing","type":"date"}}])
  const [formResponses, setFormResponses] = useState<FormResponse<Response>>({});

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
                    return <RangeComponent key={item.id} id={item.id} props={item.props}/>;
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