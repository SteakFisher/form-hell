import {MultipleChoiceProps} from "@/interfaces/form-component-interfaces/multiple-choice/MultipleChoiceProps";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import React, {useContext, useEffect, useRef, useState} from "react";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {Checkbox} from "@/components/ui/checkbox";
import {FormRendererContext} from "@/contexts/FormRendererContext";

export default function MultipleChoiceComponent({ props, id }: { props: MultipleChoiceProps, id: string }) {
  const isRadio = !props.allowMultiple;
  const [choices, setChoices] = useState<Set<string>>(new Set<string>)
  const { formResponses } = useContext(FormRendererContext);
  const [error, setError] = useState<string | null>(null);
  const [other, setOther] = useState<boolean>(false);

  useEffect(() => {
    formResponses[id] = {
      selected: choices,
      type: "multiple-choice"
    }
  }, [choices])


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
            <RadioGroup onValueChange={(value) => {
              // Run validation

              choices.add(value)
            }} defaultValue={props.items[0].value}>
              {
                props.items.map((item, index) => {
                  return (
                    <div key={item.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={item.value} id={item.id}/>
                      <Label htmlFor={item.id}>{item.value}</Label>
                    </div>
                  )
                })
              }
              {
                props.hasOther ? (
                  <div key={id + "-other"} className="flex items-center space-x-2">
                    <RadioGroupItem value={"other"} id={id + "-otherid"}/>
                    <Label htmlFor={id + "-otherid"}>{"other"}</Label>
                  </div>
                ) : null
              }
            </RadioGroup>
          ) : (
            <>
              {
                props.items.map((item, index) => {
                  return (
                    <div key={item.id} className="flex items-cen mb-4">
                      <Checkbox
                        id="terms"
                        checked={other ? false : choices.has(item.value)}
                        onCheckedChange={(checked) => {
                          // Run validation
                          if (checked) {
                            const tempChoices = new Set(choices);
                            tempChoices.add(item.value)
                            setChoices(tempChoices)
                          } else {
                            const tempChoices = new Set(choices);
                            tempChoices.delete(item.value)
                            setChoices(tempChoices)
                          }
                        }}
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm mt-0.5 ml-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {item.value}
                      </label>
                    </div>
                  )
                })
              }
              {
                props.hasOther ? (
                  <div key={id + "-other"} className="flex items-cen mb-4">
                    <Checkbox
                      id="terms"
                      checked={choices.has("other")}
                      onCheckedChange={(checked) => {
                        // Run validation
                        if (checked) {
                          choices.add("other")
                          setOther(true)
                        } else {
                          setChoices(new Set([]))
                          choices.delete("other")
                          setOther(false)
                        }
                      }}
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm mt-0.5 ml-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      other
                    </label>
                  </div>
                ) : null
              }
            </>
          )
        }
      </CardContent>
    </Card>
  )
}