import MediaProps from "@/interfaces/form-component-interfaces/MediaProps";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import Image from "next/image";
import {YTIframe} from "@/components/form-components/Media";
import getVideoId from "get-video-id";


export default function MediaComponent({
 props,
 id
}: {
  props: MediaProps;
  id: string;
}) {
  const vidid = getVideoId(props.url)
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
            <YTIframe id={""} videoIdRef={{
              current: vidid.id ?? ""
            }} />
          )
        }
      </CardContent>
    </Card>
  );
}