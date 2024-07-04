/* eslint-disable @next/next/no-img-element */
import { constants, mediaConstants } from "@/constants";
import { FormBuilderContext } from "@/contexts/FormBuilderContext";
import { SortableItemContext } from "@/contexts/SortableItemContext";
import { validateImageUrl, validateVideoUrl } from "@/functions/mediaHelpers";
import MediaProps from "@/interfaces/form-component-interfaces/MediaProps";
import { FormItemMediaProps } from "formhell-js";
import { ImageIcon, Link2Icon } from "@radix-ui/react-icons";
import getVideoId from "get-video-id";
import {
	ChangeEvent,
	createContext,
	memo,
	MutableRefObject,
	useContext,
	useEffect,
	useRef,
	useState,
	useTransition,
} from "react";
import { useDebouncedCallback } from "use-debounce";
import VideoIcon from "../../../public/icons/video.svg";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { SortableItem } from "./SortableItem";

interface MediaContextInterface {
	setUrlState: (value: string) => void;
	urlState: string;
	videoIdRef: MutableRefObject<string>;
}

const MediaContext = createContext<MediaContextInterface>({
	setUrlState: (value: string) => {},
	urlState: "",
	videoIdRef: { current: "" },
});

const Media = memo(function Media({
	id,
	mediaProps,
	props,
}: {
	id: string;
	mediaProps: FormItemMediaProps;
	props: MediaProps;
}) {
	const [urlState, setUrlState] = useState(props.url);

	const videoIdRef = useRef(
		props.mediaType === "video" ? getVideoId(props.url).id ?? "" : "",
	);

	useEffect(() => {
		props.url = urlState;
	}, [urlState]);

	return (
		<MediaContext.Provider
			value={{
				setUrlState,
				urlState,
				videoIdRef,
			}}
		>
			<SortableItem
				isMedia={true}
				id={id}
				mediaProps={mediaProps}
				props={props}
				SortableItemChild={MediaWrapper}
			/>
		</MediaContext.Provider>
	);
});

const MediaWrapper = memo(function MediaWrapper({
	id,
	isFocused,
	props,
}: {
	id: string;
	isFocused: boolean;
	props: MediaProps;
}) {
	const { urlState } = useContext(MediaContext);
	const { sortableItemRef } = useContext(SortableItemContext);

	useEffect(() => {
		sortableItemRef.current?.setAttribute("data-error", `${!urlState}`);
	}, [urlState]);

	return isFocused ? (
		<FocusedMedia id={id} props={props} />
	) : (
		<UnfocusedMedia id={id} props={props} />
	);
});

function FocusedMedia({ id, props }: { id: string; props: MediaProps }) {
	const { debounceRefs } = useContext(FormBuilderContext);
	const { setUrlState, urlState, videoIdRef } = useContext(MediaContext);
	const [isPending, startTransition] = useTransition();

	const [imageError, setImageError] = useState("");
	const [tab, setTab] = useState(props.mediaType);
	const [videoError, setVideoError] = useState("");

	const mediaRef = useRef({
		imageUrl: props.mediaType === "image" ? props.url : "",
		videoUrl: props.mediaType === "video" ? props.url : "",
	});

	const contentRef = useRef<HTMLDivElement>(null);

	const handleAltTextChange = useDebouncedCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			props.altText = e.target.value;
		},
		constants.debounceWait,
	);

	const handleImageUrlChange = useDebouncedCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			mediaRef.current.imageUrl = e.target.value;
			setImageError("");
		},
		constants.debounceWait,
	);

	const handleVideoUrlChange = useDebouncedCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			mediaRef.current.videoUrl = e.target.value;
			setVideoError("");
		},
		constants.debounceWait,
	);

	useEffect(() => {
		const refs = debounceRefs.get(id);
		if (!refs) return;
		refs
			.set("alt-text-change", handleAltTextChange)
			.set("image-url-change", handleImageUrlChange)
			.set("video-url-change", handleVideoUrlChange);
	}, []);

	return (
		<CardContent className="custom-focus" tabIndex={-1} ref={contentRef}>
			<div className="mb-6 mt-3 flex min-h-10 w-full flex-col items-center space-y-3">
				{urlState &&
					(props.mediaType === "image" ? (
						<>
							<img
								className="media-image"
								src={urlState}
								alt={props.altText}
							/>
							<div className="flex items-center">
								<Label className="text-nowrap pr-2" htmlFor="alt-text">
									Alt text:
								</Label>
								<Input
									defaultValue={props.altText}
									id="alt-text"
									maxLength={mediaConstants.altTextMaxLength}
									onChange={handleAltTextChange}
									placeholder="Enter alt text (optional)"
								/>
							</div>
							<Button
								onClick={() => {
									startTransition(() => handleDeleteMedia());
								}}
								variant={"destructive"}
							>
								Remove Image
							</Button>
						</>
					) : (
						<>
							<YTIframe id={id} videoIdRef={videoIdRef} />
							<Button
								onClick={() => {
									startTransition(() => handleDeleteMedia());
								}}
								variant={"destructive"}
							>
								Remove Video
							</Button>
						</>
					))}
				<div className="error">{!urlState && "No media inserted"}</div>
			</div>
			<Card>
				<CardContent className="p-6 pb-0">
					<Tabs
						className="w-full"
						value={tab}
						onValueChange={handleTabChange}
					>
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="image">
								<ImageIcon className="mr-1" />
								Image
							</TabsTrigger>
							<TabsTrigger value="video">
								<VideoIcon className="mr-1 size-4" />
								Video
							</TabsTrigger>
						</TabsList>
						<TabsContent value="image">
							<div className="flex items-center pt-4">
								<Label className="text-nowrap pr-2" htmlFor="image-url">
									<Link2Icon />
								</Label>
								<Input
									defaultValue={mediaRef.current.imageUrl}
									id="image-url"
									onChange={handleImageUrlChange}
									placeholder="Paste image URL here..."
								/>
								<Button
									className="ml-6 w-40 transition-opacity"
									onClick={() =>
										startTransition(() => handleInsertImage())
									}
								>
									Insert image
								</Button>
							</div>

							<div className="error">{imageError}</div>
						</TabsContent>
						<TabsContent value="video">
							<div className="flex items-center pt-4">
								<Label className="text-nowrap pr-2" htmlFor="video-url">
									<Link2Icon />
								</Label>
								<Input
									id="video-url"
									defaultValue={mediaRef.current.videoUrl}
									onChange={handleVideoUrlChange}
									placeholder="Paste YouTube URL here..."
								/>
								<Button
									className="ml-6 w-40"
									onClick={() =>
										startTransition(() => handleInsertVideo())
									}
								>
									Insert video
								</Button>
							</div>
							<div className="error">{videoError}</div>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</CardContent>
	);

	function handleDeleteMedia() {
		setUrlState("");
	}

	function handleInsertImage() {
		handleImageUrlChange.flush();
		const url = mediaRef.current.imageUrl;
		const error = validateImageUrl(url);
		error.then((error) => {
			setImageError(error);
			if (error) return;

			props.mediaType = "image";
			setUrlState(url);
		});
	}

	function handleInsertVideo() {
		handleVideoUrlChange.flush();
		const url = mediaRef.current.videoUrl;
		const error = validateVideoUrl(url, videoIdRef);
		setVideoError(error);
		if (error) return;

		props.mediaType = "video";
		props.altText = "";
		setUrlState(url);
	}

	function handleTabChange(newTab: string) {
		if (newTab === "image") {
			handleVideoUrlChange.flush();
			setTab("image");
			return;
		}
		if (newTab === "video") {
			handleImageUrlChange.flush();
			setTab("video");
		}
	}
}

function UnfocusedMedia({ id, props }: { id: string; props: MediaProps }) {
	const { urlState, videoIdRef } = useContext(MediaContext);

	return (
		<CardContent>
			<div className="mb-6 flex min-h-10 w-full flex-col items-center">
				{urlState &&
					(props.mediaType === "image" ? (
						<div className="mb-3">
							<img
								className="media-image"
								src={urlState}
								alt={props.altText}
							/>
						</div>
					) : (
						<YTIframe id={id} videoIdRef={videoIdRef} />
					))}
				<div className="error">{!urlState && "No media inserted"}</div>
			</div>
		</CardContent>
	);
}

export const YTIframe = memo(function YTIframe({
	id,
	videoIdRef,
}: {
	id: string;
	videoIdRef: MutableRefObject<string>;
}) {
	return (
		<iframe
			className="mb-3"
			height="390"
			id={`yt-player-${id}`}
			width="640"
			src={`http://www.youtube.com/embed/${videoIdRef.current}`}
		/>
	);
});

export default Media;
