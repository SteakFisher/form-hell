"use client";

import { FormItem, MediaProps } from "formhell-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { YTIframe } from "@/components/form-components/Media";
import getVideoId from "get-video-id";

export default function MediaComponent({
	item,
	id,
}: {
	item: FormItem;
	id: string;
}) {
	const props = item.props as MediaProps;
	const vidid = getVideoId(props.url);
	return (
		<Card className={"mb-4 w-10/12 self-center"}>
			<CardHeader>
				<CardTitle>{props.title}</CardTitle>
			</CardHeader>
			<CardContent>
				{props.mediaType === "image" ? (
					<img src={props.url} alt={props.altText} />
				) : (
					<YTIframe
						id={""}
						videoIdRef={{
							current: vidid.id ?? "",
						}}
					/>
				)}
			</CardContent>
		</Card>
	);
}
