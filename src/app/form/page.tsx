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
  } = useRef<FormItem[]>([{"id":"0","props":{"description":"I wanna kms","required":false,"title":"LMFAO HAHA ANOTHER TEST","type":"title"}},{"id":"e3caf55b-72a6-4f4c-b2af-12a7fd4531f9","props":{"inputType":"short-text","lengthType":"characters","minLength":4,"maxLength":10,"placeholder":"qwerasd","regex":"","regexFlags":"m","regexMethod":"contains","required":true,"title":"Testin rn lmao","type":"text-input"}},{"id":"5cd1d96b-97e8-4d76-b58f-b4591bed6991","props":{"allowMultiple":true,"hasOther":true,"items":[{"id":"885b6c47-4530-4f60-8d3b-cbfc83b0db8e","parentId":"5cd1d96b-97e8-4d76-b58f-b4591bed6991","value":"Option 1"},{"id":"16a91ac1-75dc-4341-bdaf-1bb2d7a3f1b4","parentId":"5cd1d96b-97e8-4d76-b58f-b4591bed6991","value":"Option 2"},{"id":"9575b9d3-3ae4-46ce-a12f-c904eb3398ae","parentId":"5cd1d96b-97e8-4d76-b58f-b4591bed6991","value":"Option 3"}],"required":true,"title":"KekwGOD","type":"multiple-choice"}},{"id":"9a21de2f-8ec4-49be-bb21-acdf3b147ee9","props":{"allowMultiple":false,"hasOther":true,"items":[{"id":"93b058dc-ac22-4458-8d08-77e5d4f1355e","parentId":"9a21de2f-8ec4-49be-bb21-acdf3b147ee9","value":"Option 1"},{"id":"711501b9-f0bc-47aa-819b-3936e7815324","parentId":"9a21de2f-8ec4-49be-bb21-acdf3b147ee9","value":"Option 2"}],"required":false,"title":"Not required multiple choice","type":"multiple-choice"}},{"id":"e083f59f-ae05-456a-a8b8-64cd09b2f18c","props":{"items":[{"id":"a258e229-a7f6-4d45-8ee2-5a4546cd9695","parentId":"e083f59f-ae05-456a-a8b8-64cd09b2f18c","value":"AHHHHHH"},{"id":"b4170fe6-cd15-4ced-adb5-5f19dec124f9","parentId":"e083f59f-ae05-456a-a8b8-64cd09b2f18c","value":"nottttt"},{"id":"4a6eb0ec-4c03-4833-b43e-e4211ab5442c","parentId":"e083f59f-ae05-456a-a8b8-64cd09b2f18c","value":"meeeeeeeeeee"}],"required":false,"title":"Droppin it down","type":"dropdown"}},{"id":"4768e6c4-e303-47a6-998d-43d8f8783d72","props":{"min":0,"max":50,"step":1,"required":false,"title":"Im such a funi kekw guy","type":"range"}},{"id":"cee71b2e-4d73-40af-a828-4b8a04212d9d","props":{"allowMultiple":true,"columns":[{"id":"df9890d5-41df-4f40-acc6-8ff921c1a2f5","parentId":"cee71b2e-4d73-40af-a828-4b8a04212d9d","value":"1"},{"id":"07d64357-8254-4f7e-b882-7d4653848d3e","parentId":"cee71b2e-4d73-40af-a828-4b8a04212d9d","value":"2"},{"id":"07744cff-ecfb-49d4-a462-2b59be4985a9","parentId":"cee71b2e-4d73-40af-a828-4b8a04212d9d","value":"3"},{"id":"45595f24-a7b0-46b4-994d-b361c5e8219b","parentId":"cee71b2e-4d73-40af-a828-4b8a04212d9d","value":"4"},{"id":"d2b0b9e5-73b6-46e9-9cbc-b4ff377dcf8d","parentId":"cee71b2e-4d73-40af-a828-4b8a04212d9d","value":"5"}],"required":true,"rows":[{"id":"3f8a92bc-fce2-4a7b-bc26-0364637efc00","parentId":"cee71b2e-4d73-40af-a828-4b8a04212d9d","value":"Do u "},{"id":"571e4f76-2060-4d15-9f6c-a339ee7945c8","parentId":"cee71b2e-4d73-40af-a828-4b8a04212d9d","value":"Wanna"},{"id":"bd54a2bf-6f27-4612-9fb7-4924351d1063","parentId":"cee71b2e-4d73-40af-a828-4b8a04212d9d","value":"KYS"}],"title":"This is so fuckin lame","type":"multiple-choice-grid"}},{"id":"1d896ba3-86a9-47da-a2ef-472ce05a9f0d","props":{"allowMultiple":false,"columns":[{"id":"6983d600-fcb2-443e-9ad4-a3a8e2a55044","parentId":"1d896ba3-86a9-47da-a2ef-472ce05a9f0d","value":"1"},{"id":"78938d07-3452-4d1a-8450-a355e9585155","parentId":"1d896ba3-86a9-47da-a2ef-472ce05a9f0d","value":"2"},{"id":"e478e968-98da-4bb1-b911-5750609c27f1","parentId":"1d896ba3-86a9-47da-a2ef-472ce05a9f0d","value":"3"},{"id":"49974efb-d52c-4422-afc1-5720920478f7","parentId":"1d896ba3-86a9-47da-a2ef-472ce05a9f0d","value":"4"},{"id":"63579473-0529-4edb-8fd2-fa5e536a5878","parentId":"1d896ba3-86a9-47da-a2ef-472ce05a9f0d","value":"5"}],"required":false,"rows":[{"id":"3407eb2d-5565-4842-ab99-84ad104f48d0","parentId":"1d896ba3-86a9-47da-a2ef-472ce05a9f0d","value":"I do "},{"id":"72d31cb0-c789-439a-9d69-78181b96e500","parentId":"1d896ba3-86a9-47da-a2ef-472ce05a9f0d","value":"Wanna"},{"id":"280b0705-d113-486d-80d2-8b57e7418b57","parentId":"1d896ba3-86a9-47da-a2ef-472ce05a9f0d","value":"KMS"}],"title":"Times 2","type":"multiple-choice-grid"}},{"id":"51d3d5e0-b146-4d37-b960-fa22fdd1194e","props":{"required":true,"title":"Just pick a fuckin date","type":"date"}}])
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