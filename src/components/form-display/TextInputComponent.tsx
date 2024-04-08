import TextInputProps from "@/interfaces/form-component-interfaces/TextInputProps";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {useState} from "react";
import {z, ZodError} from "zod";

export default function TextInputComponent({props}: {props: TextInputProps}) {

  const [error, setError] = useState<string | null>();
  return (
    <Card className={"w-10/12 self-center mb-4"}>
      <CardHeader>
        <CardTitle>
          {props.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder={props.placeholder} onChange={(e) => {
          let input = z.string()

          if (props.maxLength) input = input.max(props.maxLength, { message: `Input can't be longer than ${props.maxLength} characters!`})
          if (props.minLength) input = input.min(props.minLength, {message: `Input can't be shorter than ${props.minLength} characters!`})
          if (props.regex) input = input.regex(new RegExp(props.regex, props.regexFlags), {message: `Input doesn't match the regex ${props.regex}`})


          try {
            const yea = input.parse(e.target.value)
            setError(null)
          } catch (e) {
            if (e instanceof ZodError) {
              setError(e.errors[0].message)
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