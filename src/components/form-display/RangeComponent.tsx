import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {RangeProps} from "@/interfaces/form-component-interfaces/RangeProps";
import {Slider} from "@/components/ui/slider";

export default function RangeComponent({ props } : { props: RangeProps }) {
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
          defaultValue={[0]}
          max={props.max}
          min={props.min}
          step={props.step}
        />
      </CardContent>
    </Card>
  )
}