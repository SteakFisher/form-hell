import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {RangeProps} from "@/interfaces/form-component-interfaces/RangeProps";
import {Slider} from "@/components/ui/slider";
import {useContext, useEffect} from "react";
import {FormRendererContext} from "@/contexts/FormRendererContext";

export default function RangeComponent({ props, id } : { id: string; props: RangeProps }) {
  const { formResponses } = useContext(FormRendererContext)
  useEffect(() => {
    formResponses[id] = { range: props.min, type: "range" }
  })

  console.log(props)
  return (
    <Card className={"w-10/12 self-center mb-4"}>
      <CardHeader>
        <CardTitle>
          {props.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Slider
          onValueChange={(value) => {
            formResponses[id] = { range: value, type: "range" }
          }}
          defaultValue={[props.min]}
          max={props.max}
          min={props.min}
          step={props.step}
        />
      </CardContent>
    </Card>
  )
}