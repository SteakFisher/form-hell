import MediaProps from "@/interfaces/form-component-interfaces/MediaProps";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import Image from "next/image";


export default function MediaComponent({
 props,
 id
}: {
  props: MediaProps;
  id: string;
}) {
  return (
    <Card className={"mb-4 w-10/12 self-center"}>
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {
          props.mediaType === "image" ? (
            <img src={props.url} alt={props.altText}  />
          ) : (
            <video src={props.url} controls />
          )
        }
      </CardContent>
    </Card>
  );
}