import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { constants } from "@/constants";
import { FormBuilderContext } from "@/contexts/FormBuilderContext";
import { SortableItemContext } from "@/contexts/SortableItemContext";
import FormItem from "@/interfaces/FormItem";
import { propsTypes } from "@/interfaces/propsTypes";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import autosize from "autosize";
import React, {
	ComponentType,
	MutableRefObject,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { useDebouncedCallback } from "use-debounce";
import DeleteIcon from "../../../public/icons/delete.svg";
import AddBar from "../AddBar";
import AutoHeight from "../AutoHeight";

interface SortableItemProps<T extends propsTypes> {
	className?: string;
	SortableItemChild: ComponentType<{
		id: string;
		isFocused: boolean;
		props: T;
	}>;
	id: string;
	props: T;
}

interface FocusedSortableItemProps<T extends propsTypes>
	extends SortableItemProps<T> {
	setDeleteClicked: (value: boolean) => void;
}

export function SortableItem<T extends propsTypes>({
	id,
	SortableItemChild,
	props,
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

	const focusedHeightRef = useRef(0);
	const focusingItemIdRef = useRef("");
	const autoHeightChildRef = useRef<HTMLDivElement>(null);
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

	return (
		<SortableItemContext.Provider value={{ sortableItemRef }}>
			<div
				className="custom-focus z-50 bg-card"
				onBlur={handleOnBlur}
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
								id={id}
								props={props}
								setDeleteClicked={setDeleteClicked}
								SortableItemChild={SortableItemChild}
							/>
						) : (
							<UnfocusedSortableItem
								focusedHeightRef={focusedHeightRef}
								focusingItemIdRef={focusingItemIdRef}
								id={id}
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

	function handleOnBlur(e: React.FocusEvent<HTMLDivElement>) {
		if (deleteClicked) return;
		const focusedElement = e.relatedTarget;
		
		if (e.currentTarget.contains(focusedElement)) return;
		if (focusedElement?.getAttribute("data-addmenu")) {
			if (!autoHeightChildRef.current) return;

			focusedHeightRef.current = autoHeightChildRef.current.clientHeight;
			heightDiffRef.current.shouldScroll = true;
			return;
		}

		if (focusedElement?.getAttribute("data-error")) {
			if (!autoHeightChildRef.current) return;
			focusedHeightRef.current = autoHeightChildRef.current.clientHeight;

			focusingItemIdRef.current = focusedElement?.id ?? "";
			heightDiffRef.current.shouldScroll = true;
		} else {
			heightDiffRef.current.shouldScroll = false;
		}

		blurItem();
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
	props,
	SortableItemChild,
}: {
	focusingItemIdRef: MutableRefObject<string>;
	focusedHeightRef: MutableRefObject<number>;
} & SortableItemProps<T>) {
	const { formItems, heightDiffRef } = useContext(FormBuilderContext);
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
		<div ref={unfocusedSortableItemRef}>
			<SortableItemChild id={id} props={props} isFocused={false} />
		</div>
	);
}

function FocusedSortableItem<T extends propsTypes>({
	className,
	id,
	props,
	setDeleteClicked,
	SortableItemChild,
}: FocusedSortableItemProps<T>) {
	const titleRef = useRef<HTMLTextAreaElement>(null);
	const { debounceRefs } = useContext(FormBuilderContext);

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
			.set("required", handleRequiredChange)
			.set("title", handleTitleChange);
	}, []);

	return (
		<div className={cn("w-full", className)}>
			<CardHeader>
				<div className="flex justify-between">
					<CardTitle>
						<Textarea
							ref={titleRef}
							placeholder="Title"
							defaultValue={props.title}
							onChange={handleTitleChange}
							className="h-[30px] w-[600px] resize-none text-base leading-snug tracking-tight"
							maxLength={500}
						/>
					</CardTitle>
					<DeleteIcon
						className=" mt-[9px] cursor-pointer fill-red-600"
						onClick={handleDeleteClick}
					/>
				</div>
				<div className="flex space-x-2 pt-2">
					<Label htmlFor="required">Required</Label>
					<Checkbox
						id="required"
						onCheckedChange={handleRequiredChange}
						defaultChecked={props.required}
					/>
				</div>
			</CardHeader>
			<SortableItemChild id={id} props={props} isFocused={true} />
		</div>
	);

	function handleDeleteClick() {
		setDeleteClicked(true);
	}
}
