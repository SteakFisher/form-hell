import {FormItemMediaProps} from "@/interfaces/FormItemMediaProps";
import getVideoId from "get-video-id";
import {YTIframe} from "@/components/form-components/Media";

export default function ChildMediaComponent({props}: {props: FormItemMediaProps}) {
  const vidid = getVideoId(props.mediaUrl)
  return (
    <div className={"flex justify-center flex-grow"}>
      {
        props.mediaType === "image" ? (
        <img className={"p-4 max-w-screen-sm"} src={props.mediaUrl} alt={props.mediaAltText} />
        ) : props.mediaType === "video" ? (
          <YTIframe id={""} videoIdRef={{
            current: vidid.id ?? ""
          }} />
        ) : null
      }
    </div>
  )
}