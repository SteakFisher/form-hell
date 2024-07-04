import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TitleProps } from "formhell-js";


export default function TitleComponent({ props } : { props: TitleProps}) {
  return (
    <CardHeader className={"flex justify-center items-center"}>
      <CardTitle>{props.title}</CardTitle>
      <CardDescription>{props.description}</CardDescription>
    </CardHeader>
  )
}