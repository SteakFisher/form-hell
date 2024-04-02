import {MultipleChoiceProps} from "@/interfaces/form-component-interfaces/multiple-choice/MultipleChoiceProps";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import React from "react";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function MultipleChoiceComponent({ props }: { props: MultipleChoiceProps}) {
  const isRadio = !props.allowMultiple;

  return (
    <Card className={"w-10/12 self-center mb-4"}>
      <CardHeader>
        <CardTitle>
          {props.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {
          isRadio ? (
            <RadioGroup defaultValue={props.items[0].value}>
              {
                props.items.map((item, index) => {
                  return (
                    <>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={item.value} id={item.id}/>
                        <Label htmlFor={item.id}>{item.value}</Label>
                      </div>
                    </>
                  )
                })
              }
            </RadioGroup>
          ) : (
            <RadioGroup defaultValue={props.items[0].value}>
              {
                props.items.map((item, index) => {
                  return (
                    <>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={item.value} id={item.id}/>
                        <Label htmlFor={item.id}>{item.value}</Label>
                      </div>
                    </>
                  )
                })
              }
            </RadioGroup>
          )
        }
      </CardContent>
    </Card>
  )
}