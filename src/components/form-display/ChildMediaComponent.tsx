import { FormItemMediaProps } from "formhell-js";
import getVideoId from "get-video-id";
import { YTIframe } from "@/components/form-components/Media";

export default function ChildMediaComponent({
	props,
}: {
	props: FormItemMediaProps;
}) {
	const vidid = getVideoId(props.mediaUrl);
	return (
		<div className={"flex flex-grow justify-center"}>
			{props.mediaType === "image" ? (
				<img
					className={"max-w-screen-sm p-4"}
					src={props.mediaUrl}
					alt={props.mediaAltText}
				/>
			) : props.mediaType === "video" ? (
				<YTIframe
					id={""}
					videoIdRef={{
						current: vidid.id ?? "",
					}}
				/>
			) : null}
		</div>
	);
}
