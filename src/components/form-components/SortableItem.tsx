/* eslint-disable @next/next/no-img-element */
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { constants, mediaConstants } from "@/constants";
import { FormBuilderContext } from "@/contexts/FormBuilderContext";
import { SortableItemContext } from "@/contexts/SortableItemContext";
import FormItem from "@/interfaces/FormItem";
import { FormItemMediaProps } from "@/interfaces/FormItemMediaProps";
import { propsTypes } from "@/interfaces/propsTypes";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DragHandleDots2Icon, ImageIcon } from "@radix-ui/react-icons";
import autosize from "autosize";
import getVideoId from "get-video-id";
import React, {
	ChangeEvent,
	ComponentType,
	memo,
	MutableRefObject,
	useContext,
	useEffect,
	useRef,
	useState,
	useTransition,
} from "react";
import { useDebouncedCallback } from "use-debounce";
import DeleteIcon from "../../../public/icons/delete.svg";
import MediaIcon from "../../../public/icons/media.svg";
import VideoIcon from "../../../public/icons/video.svg";
import AddBar from "../AddBar";
import AutoHeight from "../AutoHeight";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { YTIframe } from "./Media";

interface SortableItemProps<T extends propsTypes> {
	className?: string;
	isMedia?: boolean;
	id: string;
	SortableItemChild: ComponentType<{
		id: string;
		isFocused: boolean;
		props: T;
	}>;
	mediaProps: FormItemMediaProps;
	props: T;
}

interface FocusedSortableItemProps<T extends propsTypes>
	extends SortableItemProps<T> {
	setDeleteClicked: (value: boolean) => void;
}

export function SortableItem<T extends propsTypes>({
	isMedia,
	id,
	mediaProps,
	props,
	SortableItemChild,
}: SortableItemProps<T>) {
	const {
		debounceRefs,
		firstRenderRef,
		formItems,
		focusedItemRef,
		heightDiffRef,
		setFormItems,
	} = useContext(FormBuilderContext);

	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: id });

	const [deleteClicked, setDeleteClicked] = useState(false);
	const [isFocused, setIsFocused] = useState(false);
	const [mediaUrlState, setMediaUrlState] = useState(mediaProps.mediaUrl);

	const autoHeightChildRef = useRef<HTMLDivElement>(null);
	const focusedHeightRef = useRef(0);
	const focusingItemIdRef = useRef("");
	const mediaVideoIdRef = useRef(
		mediaProps.mediaType === "video"
			? getVideoId(mediaProps.mediaUrl).id ?? ""
			: "",
	);
	const sortableItemRef = useRef<HTMLDivElement>(null);

	const style = {
		transform: CSS.Translate.toString(transform),
		transition,
	};

	useEffect(() => {
		if (!firstRenderRef.current) {
			sortableItemRef.current?.focus({ preventScroll: true });
		}
	}, [firstRenderRef]);

	useEffect(() => {
		mediaProps.mediaUrl = mediaUrlState;
	}, [mediaUrlState]);

	return (
		<SortableItemContext.Provider
			value={{
				mediaUrlState,
				mediaVideoIdRef,
				setMediaUrlState,
				sortableItemRef,
			}}
		>
			<div
				className="custom-focus z-50 bg-card"
				onFocus={handleOnFocus}
				ref={setNodeRef}
				style={style}
				tabIndex={0}
			>
				<Card
					className={cn(
						"custom-focus relative flex w-full select-none overflow-hidden scroll-smooth border-[1.5px] bg-none pl-3 pr-7 transition-all duration-200 before:absolute before:right-0 before:top-0 before:h-full before:w-7 before:bg-accent",
						isFocused && "border-ring",
						"data-[error=true]:border-red-800",
					)}
					data-error="false"
					id={id}
					tabIndex={-1}
					ref={sortableItemRef}
				>
					<AutoHeight
						autoHeightChildRef={autoHeightChildRef}
						deleteClicked={deleteClicked}
						deleteItem={deleteItem}
						isFocused={isFocused}
						sortableItemRef={sortableItemRef}
					>
						{isFocused ? (
							<FocusedSortableItem
								isMedia={isMedia}
								id={id}
								mediaProps={mediaProps}
								props={props}
								setDeleteClicked={setDeleteClicked}
								SortableItemChild={SortableItemChild}
							/>
						) : (
							<UnfocusedSortableItem
								focusedHeightRef={focusedHeightRef}
								focusingItemIdRef={focusingItemIdRef}
								id={id}
								mediaProps={mediaProps}
								props={props}
								SortableItemChild={SortableItemChild}
							/>
						)}
					</AutoHeight>
					<div
						// bg is simulated by parent cus corners dont line up
						// why is css
						className="absolute inset-y-0 right-0 flex cursor-move items-center focus-visible:opacity-50 focus-visible:outline-none"
						{...attributes}
						{...listeners}
						onMouseDown={(e) => {
							e.stopPropagation();
							e.preventDefault();
						}}
					>
						<DragHandleDots2Icon className="size-7 text-black" />
					</div>
				</Card>
			</div>
			<AddBar focusingItemIdRef={focusingItemIdRef} id={id} />
		</SortableItemContext.Provider>
	);

	function deleteItem() {
		const newFormItems: FormItem[] = [];
		formItems.forEach((formItem) => {
			if (!(formItem.id === id)) newFormItems.push(formItem);
		});
		setFormItems(newFormItems);

		debounceRefs.delete(id);
	}

	function blurItem() {
		const refs = debounceRefs.get(id);

		if (refs) {
			refs.forEach((ref) => {
				ref.flush();
			});
		}

		setIsFocused(false);
	}

	function handleOnFocus() {
		if (focusedItemRef.current.id === id) return;
		console.log("still here");
		focusedItemRef.current.blurItem();
		focusedItemRef.current = {
			...focusedItemRef.current,
			id: id,
			blurItem: blurItem,
		};

		setIsFocused(true);
	}
}

function UnfocusedSortableItem<T extends propsTypes>({
	focusingItemIdRef,
	focusedHeightRef,
	id,
	mediaProps,
	props,
	SortableItemChild,
}: {
	focusingItemIdRef: MutableRefObject<string>;
	focusedHeightRef: MutableRefObject<number>;
} & SortableItemProps<T>) {
	const { formItems, heightDiffRef } = useContext(FormBuilderContext);
	const { mediaUrlState, mediaVideoIdRef } = useContext(SortableItemContext);

	const unfocusedSortableItemRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (
			unfocusedSortableItemRef.current &&
			heightDiffRef.current.shouldScroll &&
			focusingItemIdRef.current
		) {
			const shouldScroll = () => {
				for (const formItem of formItems) {
					if (formItem.id === id) return true;
					if (formItem.id === focusingItemIdRef.current) return false;
				}
				return false;
			};
			heightDiffRef.current = {
				heightDiff:
					unfocusedSortableItemRef.current.scrollHeight -
					focusedHeightRef.current,
				shouldScroll: shouldScroll(),
			};
		}
	}, []);

	return (
		<div
			ref={unfocusedSortableItemRef}
			className="h-min w-full whitespace-pre-wrap"
		>
			<CardHeader>
				<CardTitle className="flex leading-snug [overflow-wrap:anywhere]">
					<span>{props.title || "Title"}</span>
					<span>
						{props.required && <sup className="ml-2 text-red-500">*</sup>}
					</span>
				</CardTitle>
			</CardHeader>
			{mediaUrlState && (
				<div className="mb-6 flex min-h-10 w-full flex-col items-center">
					{mediaProps.mediaType === "image" ? (
						<div className="mb-3">
							<img
								className="media-image"
								src={mediaUrlState}
								alt={mediaProps.mediaAltText}
							/>
						</div>
					) : (
						<YTIframe id={id} videoIdRef={mediaVideoIdRef} />
					)}
				</div>
			)}

			<SortableItemChild id={id} props={props} isFocused={false} />
		</div>
	);
}

function FocusedSortableItem<T extends propsTypes>({
	className,
	id,
	isMedia,
	mediaProps,
	props,
	setDeleteClicked,
	SortableItemChild,
}: FocusedSortableItemProps<T>) {
	const { debounceRefs } = useContext(FormBuilderContext);
	const { setMediaUrlState, mediaUrlState, mediaVideoIdRef } =
		useContext(SortableItemContext);

	const [isPending, startTransition] = useTransition();

	const [isPopoverOpen, setIsPopoverOpen] = useState(false);

	const titleRef = useRef<HTMLTextAreaElement>(null);

	const handleAltTextChange = useDebouncedCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			mediaProps.mediaAltText = e.target.value;
		},
		constants.debounceWait,
	);

	const handleRequiredChange = useDebouncedCallback((isChecked: boolean) => {
		props.required = isChecked;
	}, constants.debounceWait);

	const handleTitleChange = useDebouncedCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			props.title = e.target.value;
		},
		constants.debounceWait,
	);

	useEffect(() => {
		if (titleRef.current == null) return;
		autosize(titleRef.current);

		const refs =
			debounceRefs.get(id) ?? debounceRefs.set(id, new Map()).get(id);
		if (!refs) return;
		refs
			.set("alt-text", handleAltTextChange)
			.set("required", handleRequiredChange)
			.set("title", handleTitleChange);
	}, []);

	return (
		<div className={cn("w-full", className)}>
			<CardHeader className="pb-0">
				<div className="flex justify-between">
					<CardTitle className="flex w-full items-center">
						<Textarea
							ref={titleRef}
							placeholder="Title"
							defaultValue={props.title}
							onChange={handleTitleChange}
							className="mr-2 h-[30px] resize-none text-base leading-snug tracking-tight"
							maxLength={constants.formItemTitleMaxLength}
						/>
						{isMedia || (
							<Popover
								modal
								open={isPopoverOpen}
								onOpenChange={setIsPopoverOpen}
							>
								<PopoverTrigger className="mr-1 size-10 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground">
									<MediaIcon className="size-10 cursor-pointer fill-white p-2.5" />
								</PopoverTrigger>
								<PopoverContent className="flex w-full">
									<SortableItemMedia
										mediaProps={mediaProps}
										setIsOpen={setIsPopoverOpen}
										startTransition={startTransition}
									/>
								</PopoverContent>
							</Popover>
						)}
						<Button
							className="size-10"
							onClick={handleDeleteClick}
							variant="ghost"
							size="icon"
						>
							<DeleteIcon className="size-10 cursor-pointer fill-red-600 p-2.5" />
						</Button>
					</CardTitle>
				</div>
				{mediaUrlState && (
					<div className="mb-6 flex min-h-10 w-full flex-col items-center space-y-3">
						{mediaProps.mediaType === "image" ? (
							<>
								<div className="relative">
									<img
										className="media-image"
										src={mediaUrlState}
										alt={mediaProps.mediaAltText}
									/>
								</div>
								<div className="flex items-center">
									<Label
										className="text-nowrap pr-2"
										htmlFor="alt-text"
									>
										Alt text:
									</Label>
									<Input
										defaultValue={mediaProps.mediaAltText}
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
								<YTIframe id={id} videoIdRef={mediaVideoIdRef} />
								<Button
									onClick={() => {
										startTransition(() => handleDeleteMedia());
									}}
									variant={"destructive"}
								>
									Remove Video
								</Button>
							</>
						)}
					</div>
				)}
				{isMedia || (
					<div className="flex space-x-2 pt-2">
						<Label htmlFor="required">Required</Label>
						<Checkbox
							id="required"
							onCheckedChange={handleRequiredChange}
							defaultChecked={props.required}
						/>
					</div>
				)}
			</CardHeader>
			<SortableItemChild id={id} props={props} isFocused={true} />
		</div>
	);

	function handleDeleteClick() {
		setDeleteClicked(true);
	}

	function handleDeleteMedia() {
		setMediaUrlState("");
	}
}

const SortableItemMedia = memo(function SortableItemMedia({
	mediaProps,
	setIsOpen,
	startTransition,
}: {
	mediaProps: FormItemMediaProps;
	setIsOpen: (value: boolean) => void;
	startTransition: React.TransitionStartFunction;
}) {
	const { mediaVideoIdRef, setMediaUrlState } =
		useContext(SortableItemContext);

	const [imageError, setImageError] = useState("");
	const [tab, setTab] = useState(mediaProps.mediaType);
	const [videoError, setVideoError] = useState("");

	const mediaRef = useRef({
		imageUrl: mediaProps.mediaType === "image" ? mediaProps.mediaUrl : "",
		videoUrl: mediaProps.mediaType === "video" ? mediaProps.mediaUrl : "",
	});

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

	return (
		<Tabs className="w-full" value={tab} onValueChange={handleTabChange}>
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
					<Button
						className="ml-6 w-40"
						onClick={() => startTransition(() => handleInsertImage())}
					>
						Insert image
					</Button>
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
					<Button
						className="ml-6 w-40"
						onClick={() => startTransition(() => handleInsertVideo())}
					>
						Insert video
					</Button>
				</div>
				<div className="error">{videoError}</div>
			</TabsContent>
		</Tabs>
	);

	function handleInsertImage() {
		handleImageUrlChange.flush();
		const url = mediaRef.current.imageUrl;
		const error = validateImageUrl(url);
		error.then((error) => {
			setImageError(error);
			if (error) return;

			mediaProps.mediaType = "image";
			setMediaUrlState(url);
			setIsOpen(false);
		});
	}

	function handleInsertVideo() {
		handleVideoUrlChange.flush();
		const url = mediaRef.current.videoUrl;
		const error = validateVideoUrl(url);
		setVideoError(error);
		if (error) return;

		mediaProps.mediaType = "video";
		mediaProps.mediaAltText = "";
		setMediaUrlState(url);
		setIsOpen(false);
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

	async function validateImageUrl(url: string): Promise<string> {
		try {
			new URL(url);
		} catch (e) {
			return "Invalid URL";
		}

		try {
			const response = await fetch(url, { method: "HEAD" });

			if (!response.ok) {
				return `HTTP error! Status: ${response.status}`;
			}

			const contentType = response.headers.get("Content-Type");
			if (!contentType || !contentType.startsWith("image/")) {
				return "URL does not point to a valid image";
			}
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

		mediaVideoIdRef.current = id;
		return "";
	}
});
