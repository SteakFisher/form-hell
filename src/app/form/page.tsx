"use client"

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
import FormResponse from "@/interfaces/FormResponse";

export default function Form() {
  const { current: formItems } = useRef<FormItem[]>([{"id":"0","props":{"description":"","required":false,"title":"","type":"title"}},{"id":"94a88d50-184b-47cd-bf8f-fbf682928bc4","props":{"allowMultiple":true,"hasOther":true,"items":[{"id":"4b5db3eb-9464-4427-99b1-0636dd90eae7","parentId":"94a88d50-184b-47cd-bf8f-fbf682928bc4","value":"Option 1"},{"id":"a8fcbf83-6121-4fc4-ac5e-65fa68227350","parentId":"94a88d50-184b-47cd-bf8f-fbf682928bc4","value":"asdf"}],"required":false,"title":"qwersadf","type":"multiple-choice"}}])
  const [formResponses, setFormResponses] = useState<FormResponse>({} as FormResponse)

  return (
    <FormRendererContext.Provider value={
      {
        formResponses: formResponses
      }
    }>
      <div className={"flex justify-center flex-grow mt-10"}>
        <Card className={"flex flex-col w-4/6 justify-center "}>
          {
            formItems.map((item) => {
              switch (item.props.type) {
                case "title":
                  return <TitleComponent key={item.id} props={item.props}/>;
                case "text-input":
                  return <TextInputComponent key={item.id} props={item.props} id={item.id}/>;
                case "multiple-choice":
                  return <MultipleChoiceComponent key={item.id} props={item.props} id={item.id}/>;
                case "dropdown":
                  return <DropdownComponent key={item.id} props={item.props}/>;
                case "range":
                  return <RangeComponent key={item.id} props={item.props}/>;
                case "date":
                  return <DateComponent key={item.id} props={item.props}/>;
                default:
                  return null;
              }
            })
          }
        </Card>
      </div>
    </FormRendererContext.Provider>
  );
}