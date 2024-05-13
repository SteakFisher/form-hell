import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {DropdownProps} from "@/interfaces/form-component-interfaces/dropdown/DropdownProps";
import {Label} from "@/components/ui/label";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {useContext, useState} from "react";
import {FormRendererContext} from "@/contexts/FormRendererContext";

export default function DropdownComponent({ props, id } : { id: string; props: DropdownProps}) {
  const { formResponses } = useContext(FormRendererContext)

  return (
    <Card className={"w-10/12 self-center mb-4"}>
      <CardHeader>
        <CardTitle>
          {props.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Select onValueChange={(value) => {
          formResponses[id] = { selected: value, type: "dropdown" }
        }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Item" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {
                props.items.map((item, index) => {
                  return (
                    <SelectItem key={index} value={item.value}>{item.value}</SelectItem>
                  )
                })
              }
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  )
}