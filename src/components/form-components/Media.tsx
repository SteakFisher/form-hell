/* eslint-disable @next/next/no-img-element */
import { constants } from "@/constants";
import { FormBuilderContext } from "@/contexts/FormBuilderContext";
import { SortableItemContext } from "@/contexts/SortableItemContext";
import MediaProps from "@/interfaces/form-component-interfaces/MediaProps";
import { ImageIcon, ReloadIcon } from "@radix-ui/react-icons";
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
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
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
	props,
}: {
	id: string;
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
				hideRequired={true}
				id={id}
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

	useEffect(() => {
		if (!contentRef.current) return;
		contentRef.current.focus({ preventScroll: true });
	}, [isPending]);

	return (
		<CardContent className="custom-focus" tabIndex={-1} ref={contentRef}>
			<div className="mb-6 flex min-h-10 w-full flex-col items-center space-y-3">
				{urlState &&
					(props.mediaType === "image" ? (
						<>
							<div className="relative">
								<img src={urlState} alt={props.altText} />
							</div>
							<div className="flex items-center">
								<Label className="text-nowrap pr-2" htmlFor="alt-text">
									Alt text:
								</Label>
								<Input
									defaultValue={props.altText}
									id="alt-text"
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
									URL:
								</Label>
								<Input
									defaultValue={mediaRef.current.imageUrl}
									id="image-url"
									onChange={handleImageUrlChange}
									placeholder="Paste image URL here..."
								/>
								{isPending ? (
									<LoadingButton />
								) : (
									<Button
										className="ml-6 w-40"
										onClick={() =>
											startTransition(() => handleInsertImage())
										}
									>
										Insert image
									</Button>
								)}
							</div>

							<div className="error">{imageError}</div>
						</TabsContent>
						<TabsContent value="video">
							<div className="flex items-center pt-4">
								<Label className="text-nowrap pr-2" htmlFor="video-url">
									URL:
								</Label>
								<Input
									id="video-url"
									defaultValue={mediaRef.current.videoUrl}
									onChange={handleVideoUrlChange}
									placeholder="Paste YouTube URL here..."
								/>
								{isPending ? (
									<LoadingButton />
								) : (
									<Button
										className="ml-6 w-40"
										onClick={() =>
											startTransition(() => handleInsertVideo())
										}
									>
										Insert video
									</Button>
								)}
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
		handleAltTextChange.flush();
		const url = mediaRef.current.imageUrl;
		const error = validateImageUrl(url);
		setImageError(error);
		if (error) return;

		props.mediaType = "image";
		setUrlState(url);
	}

	function handleInsertVideo() {
		handleVideoUrlChange.flush();
		const url = mediaRef.current.videoUrl;
		const error = validateVideoUrl(url);
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

	function validateImageUrl(url: string): string {
		try {
			new URL(url);
		} catch (e) {
			return "Invalid URL";
		}

		try {
			const response = fetch(url, { method: "HEAD" });

			response.then((response) => {
				if (!response.ok) {
					return `HTTP error! Status: ${response.status}`;
				}

				const contentType = response.headers.get("Content-Type");
				if (!contentType || !contentType.startsWith("image/")) {
					return "URL does not point to a valid image";
				}
			});
		} catch (error) {
			return "Failed to fetch the URL";
		}
		return "";
	}

	function validateVideoUrl(url: string): string {
		try {
			new URL(url);
		} catch (e) {
			return "Invalid URL";
		}
		const { id, service } = getVideoId(url);
		if (service !== "youtube") return "Invalid URL";
		if (!id) return "Invalid URL";

		videoIdRef.current = id;
		return "";
	}
}

function UnfocusedMedia({ id, props }: { id: string; props: MediaProps }) {
	const { urlState, videoIdRef } = useContext(MediaContext);

	return (
		<div className="h-min w-full whitespace-pre-wrap">
			<CardHeader>
				<CardTitle className="flex leading-snug [overflow-wrap:anywhere]">
					<span>{props.title || "Title"}</span>
					<span>
						{props.required && <sup className="ml-2 text-red-500">*</sup>}
					</span>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="mb-6 flex min-h-10 w-full flex-col items-center">
					{urlState &&
						(props.mediaType === "image" ? (
							<div className="relative mb-3">
								<img src={urlState} alt={props.altText} />
							</div>
						) : (
							<YTIframe id={id} videoIdRef={videoIdRef} />
						))}
					<div className="error">{!urlState && "No media inserted"}</div>
				</div>
			</CardContent>
		</div>
	);
}

function YTIframe({
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
			onBlur={() => {
				console.log("jjj");
			}}
			width="640"
			src={`http://www.youtube.com/embed/${videoIdRef.current}`}
		/>
	);
}

function LoadingButton() {
	return (
		<Button className="ml-6 w-40" disabled>
			<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
			Please wait
		</Button>
	);
}

export default Media;
