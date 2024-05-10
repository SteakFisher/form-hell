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
	RefObject,
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
	accordionOpen?: boolean;
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
	focusedSortableItemRef: RefObject<HTMLDivElement>;
}

export function SortableItem<T extends propsTypes>({
	accordionOpen,
	id,
	SortableItemChild,
	props,
}: SortableItemProps<T>) {
	const { debounceRefs, focusedItemRef, heightDiffRef } =
		useContext(FormBuilderContext);

	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: id });
	const [isFocused, setIsFocused] = useState(false);

	const accordionContentRef = useRef<HTMLDivElement>(null);
	const addMenuRef = useRef<HTMLDivElement>(null);
	const focusedHeightRef = useRef(0);
	const focusingElementIdRef = useRef("");
	const focusedSortableItemRef = useRef<HTMLDivElement>(null);
	const measureDivRef = useRef<HTMLDivElement>(null);
	const sortableItemRef = useRef<HTMLDivElement>(null);

	const style = {
		transform: CSS.Translate.toString(transform),
		transition,
	};

	return (
		<SortableItemContext.Provider
			value={{ accordionContentRef: accordionContentRef }}
		>
			<div
				className="custom-focus z-50"
				data-error="false"
				id={id}
				onBlur={handleOnBlur}
				onFocus={handleOnFocus}
				ref={setNodeRef}
				style={style}
				tabIndex={0}
			>
				<Card
					className={cn(
						"custom-focus flex w-full select-none overflow-hidden pl-3 transition-all",
						isFocused && "border-ring",
					)}
					ref={sortableItemRef}
				>
					<div className="flex w-full" ref={measureDivRef}>
						<AutoHeight
							accordionContentRef={accordionContentRef}
							accordionOpen={accordionOpen}
							isFocused={isFocused}
							sortableItemRef={sortableItemRef}
						>
							{isFocused ? (
								<FocusedSortableItem
									focusedSortableItemRef={focusedSortableItemRef}
									id={id}
									props={props}
									SortableItemChild={SortableItemChild}
								/>
							) : (
								<UnfocusedSortableItem
									focusedHeightRef={focusedHeightRef}
									focusingElementIdRef={focusingElementIdRef}
									id={id}
									props={props}
									SortableItemChild={SortableItemChild}
								/>
							)}
						</AutoHeight>
					</div>
					<div
						className="ml-3 flex cursor-move items-center rounded-r-xl bg-accent focus-visible:opacity-50 focus-visible:outline-none"
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
			<AddBar addMenuRef={addMenuRef} id={id} />
		</SortableItemContext.Provider>
	);

	function handleOnBlur(e: React.FocusEvent<HTMLDivElement>) {
		const focusedElement = e.relatedTarget;
		if (e.currentTarget.contains(focusedElement)) return;
		if (addMenuRef.current?.contains(focusedElement)) return;
		if (focusedElement?.getAttribute("data-addmenu")) return;

		if (focusedElement?.getAttribute("data-error")) {
			if (!measureDivRef.current) return;
			focusedHeightRef.current = measureDivRef.current.clientHeight;

			focusingElementIdRef.current = focusedElement?.id ?? "";
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

	function handleOnFocus(e: React.FocusEvent<HTMLDivElement>) {
		if (addMenuRef.current?.contains(e.target)) return;

		focusedItemRef.current = {
			...focusedItemRef.current,
			id: id,
			blurItem: blurItem,
		};

		setIsFocused(true);
	}
}

function UnfocusedSortableItem<T extends propsTypes>({
	focusingElementIdRef,
	focusedHeightRef,
	id,
	props,
	SortableItemChild,
}: {
	focusingElementIdRef: RefObject<string>;
	focusedHeightRef: RefObject<number>;
} & SortableItemProps<T>) {
	const { formItems, heightDiffRef } = useContext(FormBuilderContext);
	const unfocusedSortableItemRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (
			unfocusedSortableItemRef.current &&
			focusedHeightRef.current &&
			heightDiffRef.current.shouldScroll
		) {
			const shouldScroll = () => {
				for (const formItem of formItems) {
					if (formItem.id === id) return true;
					if (formItem.id === focusingElementIdRef.current) return false;
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
	focusedSortableItemRef,
	id,
	props,
	SortableItemChild,
}: FocusedSortableItemProps<T>) {
	const titleRef = useRef<HTMLTextAreaElement>(null);
	const { formItems, setFormItems, debounceRefs } =
		useContext(FormBuilderContext);

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
		<div className={cn("w-full", className)} ref={focusedSortableItemRef}>
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
		const newFormItems: FormItem[] = [];
		formItems.forEach((formItem) => {
			if (!(formItem.id === id)) newFormItems.push(formItem);
		});
		setFormItems(newFormItems);

		debounceRefs.delete(id);
	}
}
