import TextInputProps from "@/interfaces/form-component-interfaces/TextInputProps";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {useContext, useState} from "react";
import {z, ZodError} from "zod";
import {FormRendererContext} from "@/contexts/FormRendererContext";

export default function TextInputComponent({props, id, e }: {props: TextInputProps, id: string, e?: string | null}) {
  const { formResponses } = useContext(FormRendererContext)
  const [error, setError] = useState(e);
  return (
    <Card className={"w-10/12 self-center mb-4"}>
      <CardHeader>
        <CardTitle>
          {props.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Input onChange={(e) => {
          let input = z.string()

          if (props.lengthType === "characters") {
            if (props.maxLength) input = input.max(props.maxLength, { message: `Input can't be longer than ${props.maxLength} characters!`})
            if (props.minLength) input = input.min(props.minLength, {message: `Input can't be shorter than ${props.minLength} characters!`})
          } else if (props.lengthType === "words") {
            if (props.maxLength && props.maxLength < e.target.value.split(" ").length) {
              setError(`Input can't be longer than ${props.maxLength} words!`)
              return
            }
            if (props.minLength && props.minLength > e.target.value.split(" ").length) {
              setError(`Input can't be shorter than ${props.minLength} words!`)
              return
            }
          }

          if (props.regex) input = input.regex(new RegExp(props.regex, props.regexFlags), {message: `Input doesn't match the regex ${props.regex}`})


          try {
            const parsedInput = input.parse(e.target.value)
            formResponses[id] = { input: parsedInput, type: "text-input" }
            setError(null)
          } catch (err) {
            if (err instanceof ZodError) {
              formResponses[id] = { input: e.target.value, type: "text-input" }
              setError(err.errors[0].message)
            }
          }
        }} />
      </CardContent>
      <CardFooter>
        {error ? <p className={"text-red-500 text-sm ml-2"}>{error}</p> : null}
      </CardFooter>
    </Card>
  )
}