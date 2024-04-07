import TextInputProps from "@/interfaces/form-component-interfaces/TextInputProps";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {useContext, useState} from "react";
import {FormRendererContext} from "@/contexts/FormRendererContext";

export default function TextInputComponent({props, id}: {props: TextInputProps, id: string}) {
  const { formResponses } = useContext(FormRendererContext);
  const [error, setError] = useState<string | null>(null);

  return (
    <Card className={"w-10/12 self-center mb-4"}>
      <CardHeader>
        <CardTitle>
          <p>
            {props.title}
            {
              props.required ? (
                <span className="text-red-500 ml-1">*</span>
              ) : null
            }
          </p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder={props.placeholder} onChange={(e) => {
          let flag = false;
          if (props.minLength && e.target.value.length < props.minLength) {
            setError("This field is too short")
            flag = true;
          }
          if (props.maxLength && e.target.value.length > props.maxLength) {
            setError("This field is too long")
            flag = true;
          }
          if(props.regex && props.regexMethod) {
            let regex = new RegExp(props.regex)
            if (regex.test(e.target.value) && props.regexMethod === "doesnt-match") {
              setError("Invalid input")
              flag = true;
            } else if (!regex.test(e.target.value) && props.regexMethod === "matches") {
              setError("Invalid input")
              flag = true;
            }
          }
          if (!flag) {
            setError(null)
          }

          // Run validation
          formResponses[id] = {
            input: e.target.value,
            type: "text-input"
          }
        }}/>
      </CardContent>
      <CardDescription>
        {
          error ? (
            <p className="text-red-500 pl-6 pb-2">{error}</p>
          ) : null
        }
      </CardDescription>
    </Card>
  )
}