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
  } = useRef<FormItem[]>([{"id":"0","mediaProps":{"mediaAltText":"","mediaType":"image","mediaUrl":""},"props":{"description":"Here's a description cuz y not","required":false,"title":"HUGE form for testing validation and implementing","type":"title"}},{"id":"f5633610-ccd5-42c7-9d5d-47ef889190b6","mediaProps":{"mediaAltText":"","mediaType":"image","mediaUrl":"https://avatars.githubusercontent.com/u/54469796?s=48&v=4"},"props":{"lengthType":"characters","maxLength":0,"minLength":0,"multiline":false,"regex":"","regexFlags":"","required":true,"title":"Title of a required input component","type":"text-input"}},{"id":"f38f1931-49b7-4d07-bab1-6d513ec53361","mediaProps":{"mediaAltText":"","mediaType":"image","mediaUrl":""},"props":{"lengthType":"characters","maxLength":0,"minLength":0,"multiline":false,"regex":"","regexFlags":"","required":false,"title":"Title fo a not required input component","type":"text-input"}},{"id":"4f109a8d-67ef-45fe-bbee-47e521246286","mediaProps":{"mediaAltText":"","mediaType":"image","mediaUrl":""},"props":{"allowMultiple":true,"hasOther":true,"items":[{"id":"9eba0d70-969f-48e0-b4f1-f75a54044334","parentId":"4f109a8d-67ef-45fe-bbee-47e521246286","value":"1"},{"id":"93658c30-9fb0-44be-8602-ad4cd54bb6f7","parentId":"4f109a8d-67ef-45fe-bbee-47e521246286","value":"2"}],"required":true,"title":"Title of a required multiple choice component","type":"multiple-choice"}},{"id":"3d31162e-b230-4b4d-80ad-3162539e626d","mediaProps":{"mediaAltText":"","mediaType":"image","mediaUrl":""},"props":{"allowMultiple":false,"hasOther":true,"items":[{"id":"f9283db1-882b-49ea-bda5-60c5296456bf","parentId":"3d31162e-b230-4b4d-80ad-3162539e626d","value":"1"},{"id":"abb2efeb-7d1d-4d3e-9539-167e85aea842","parentId":"3d31162e-b230-4b4d-80ad-3162539e626d","value":"2"}],"required":false,"title":"Title of a not required single choice component..?","type":"multiple-choice"}},{"id":"d44bf619-9ccf-4b5e-ba68-f8af944340fd","mediaProps":{"mediaAltText":"","mediaType":"image","mediaUrl":""},"props":{"items":[{"id":"edd7fdf2-e61e-45a7-a0ee-a325c7ef589f","parentId":"d44bf619-9ccf-4b5e-ba68-f8af944340fd","value":"1"},{"id":"69422c78-eb17-4b77-9d42-95c4381fc24f","parentId":"d44bf619-9ccf-4b5e-ba68-f8af944340fd","value":"2"},{"id":"b45df36b-8c79-427a-beef-b56bd2a56bb6","parentId":"d44bf619-9ccf-4b5e-ba68-f8af944340fd","value":"3"}],"required":true,"title":"Title of a weird required dropdown component","type":"dropdown"}},{"id":"6786792e-4273-440c-9db8-f87b5f01daaf","mediaProps":{"mediaAltText":"","mediaType":"image","mediaUrl":""},"props":{"items":[{"id":"03225a20-181a-4bd5-90a7-3d032dd3a281","parentId":"6786792e-4273-440c-9db8-f87b5f01daaf","value":"1"},{"id":"42491439-3414-4f31-aff9-1e06348694dc","parentId":"6786792e-4273-440c-9db8-f87b5f01daaf","value":"2"}],"required":false,"title":"Title fo a not required dropdown component","type":"dropdown"}},{"id":"6a26c77c-0519-4006-a044-55e89033ba17","mediaProps":{"mediaAltText":"","mediaType":"image","mediaUrl":""},"props":{"min":0,"max":100,"step":2,"required":true,"title":"Title of a required range component","type":"range"}},{"id":"78addaa8-3c39-4fc7-bacd-76087782b077","mediaProps":{"mediaAltText":"","mediaType":"image","mediaUrl":""},"props":{"min":0,"max":30,"step":1,"required":false,"title":"Actually not required range","type":"range"}},{"id":"77a6519f-d145-49cf-8077-a49720869550","mediaProps":{"mediaAltText":"","mediaType":"image","mediaUrl":""},"props":{"allowMultiple":true,"columns":[{"id":"6fe345ea-adea-4e0d-ac6a-8dd3bc90a6f8","parentId":"77a6519f-d145-49cf-8077-a49720869550","value":"1"},{"id":"7f7bea8c-c8e0-4188-a9a9-d5adc440c3c9","parentId":"77a6519f-d145-49cf-8077-a49720869550","value":"2"},{"id":"27ffbf04-9045-493a-819e-9ff965f53606","parentId":"77a6519f-d145-49cf-8077-a49720869550","value":"3"},{"id":"be4585a3-93e9-49a1-902c-0e64cf698761","parentId":"77a6519f-d145-49cf-8077-a49720869550","value":"4"},{"id":"22f17ce6-fd42-4e9f-b02d-1bd22bf48b1a","parentId":"77a6519f-d145-49cf-8077-a49720869550","value":"5"}],"required":true,"rows":[{"id":"178cad73-e90e-4176-aa03-abc15af8323d","parentId":"77a6519f-d145-49cf-8077-a49720869550","value":"1"},{"id":"748d3d77-4aa9-4afb-8c32-369af872fef0","parentId":"77a6519f-d145-49cf-8077-a49720869550","value":"2"},{"id":"2ada54a2-1053-42d1-a214-b51f3252722a","parentId":"77a6519f-d145-49cf-8077-a49720869550","value":"3"}],"title":"Title of a required multiple selection table component","type":"multiple-choice-grid"}},{"id":"c95f1c52-9d99-4415-97a3-8d3816877b65","mediaProps":{"mediaAltText":"","mediaType":"image","mediaUrl":""},"props":{"allowMultiple":false,"columns":[{"id":"332036cb-0863-47b5-ad4e-85647bf7a544","parentId":"c95f1c52-9d99-4415-97a3-8d3816877b65","value":"1"},{"id":"b4fdeef0-ff1c-488e-8e05-870bb2767fd3","parentId":"c95f1c52-9d99-4415-97a3-8d3816877b65","value":"2"},{"id":"bf1de695-907f-4ab3-a0a2-e01aff3e394d","parentId":"c95f1c52-9d99-4415-97a3-8d3816877b65","value":"3"},{"id":"c5b495ac-017c-4b02-9094-57bcbfa797fe","parentId":"c95f1c52-9d99-4415-97a3-8d3816877b65","value":"4"},{"id":"e36cb259-5883-4229-b9ac-1b6748a77703","parentId":"c95f1c52-9d99-4415-97a3-8d3816877b65","value":"5"}],"required":false,"rows":[{"id":"47905881-be86-4ed2-9b00-fe7dcf2fa394","parentId":"c95f1c52-9d99-4415-97a3-8d3816877b65","value":"1"},{"id":"baf3070f-a036-44f4-9229-b7ac742fc957","parentId":"c95f1c52-9d99-4415-97a3-8d3816877b65","value":"2"},{"id":"1d2de4e0-88aa-48f7-aa21-fe40878e45dd","parentId":"c95f1c52-9d99-4415-97a3-8d3816877b65","value":"3"}],"title":"Title of a not required not multiple choicce weird grid","type":"multiple-choice-grid"}},{"id":"caffd65a-e334-49b0-a479-89158d6d8e3c","mediaProps":{"mediaAltText":"","mediaType":"image","mediaUrl":""},"props":{"required":true,"title":"Weird required date BUT LETS MAKE IT SUPERRRRRRRRR LONG JUST TO FUCK WITH JAYADEEP AND WHATEVER LITTLE REMAINING BRAINCELLS HE POSSIBLY COULD HAVE HOLY SHIT SO MUCH FUN","type":"date"}},{"id":"aacc8721-3bdf-4971-b5b0-38d123c232ca","mediaProps":{"mediaAltText":"","mediaType":"image","mediaUrl":""},"props":{"required":false,"title":"Not required date tho","type":"date"}},{"id":"81159efb-7367-409e-915a-4a14cab3b2dd","mediaProps":{"mediaAltText":"","mediaType":"image","mediaUrl":""},"props":{"altText":"","mediaType":"video","required":false,"title":"insert media here","type":"media","url":"https://www.youtube.com/watch?v=yxAxvFhf8ro"}}])
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
                    return <TextInputComponent key={item.id} id={item.id} item={item}/>;
                  case "multiple-choice":
                    return <MultipleChoiceComponent key={item.id} id={item.id} item={item}/>;
                  case "dropdown":
                    return <DropdownComponent key={item.id} id={item.id} item={item}/>;
                  case "range":
                    formResponses[item.id] = formResponses[item.id] ?? { range: item.props.min, type: "range" }
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
            <Button>
              <input className={"cursor-pointer"} type={"submit"} />
            </Button>
          </form>
        </Card>
      </div>
    </FormRendererContext.Provider>
  );
}