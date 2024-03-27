import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { constants } from "@/constants";
import { FormBuilderContext } from "@/contexts/FormBuilderContext";
import { propsTypes } from "@/interfaces/propsTypes";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import autosize from "autosize";
import {
	memo,
	ReactNode,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { useDebouncedCallback } from "use-debounce";
import DeleteIcon from "../../../public/icons/delete.svg";
import { cn } from "@/lib/utils";

interface FocusedSortableItemProps {
	children: ReactNode;
	className?: string;
	id: number;
	props: propsTypes;
}

interface SortableItemProps extends FocusedSortableItemProps {
	UnfocusedSortableItem: () => ReactNode;
}

export function SortableItem({
	children,
	id,
	props,
	UnfocusedSortableItem,
}: SortableItemProps) {
	const { debounceRefs, focusedIndexRef } = useContext(FormBuilderContext);
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: id });
	const [isFocused, setIsFocused] = useState(false);

	const style = {
		transform: CSS.Translate.toString(transform),
		transition,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			id={id.toString()}
			onFocus={handleOnFocus}
			onBlur={handleOnBlur}
			tabIndex={0}
		>
			<Card className="my-5 flex w-full select-none overflow-hidden pl-3 will-change-contents focus-visible:border-ring focus-visible:outline-none">
				<FocusedSortableItem
					id={id}
					props={props}
					className={isFocused ? "" : "hidden"}
				>
					{children}
				</FocusedSortableItem>
				<div className={cn("w-full", isFocused ? "hidden" : "")}>
					<UnfocusedSortableItem />
				</div>
				<div
					id="drag-handle"
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
	);

	function handleOnBlur(e: React.FocusEvent<HTMLDivElement>) {
		const relatedTarget = e.relatedTarget;
		if (relatedTarget?.id === "drag-handle") return;
		if (e.currentTarget.contains(e.relatedTarget)) return;

		for (const key of debounceRefs.keys()) {
			if (key.startsWith(`${id}:`)) {
				debounceRefs.get(key)?.flush();
			}
		}

		setIsFocused(false);
	}

	function handleOnFocus() {
		focusedIndexRef.current = id;
		setIsFocused(true);
	}
}

const FocusedSortableItem = memo(function FocusedSortableItem({
	children,
	className,
	id,
	props,
}: FocusedSortableItemProps) {
	const titleRef = useRef<HTMLTextAreaElement>(null);
	const { formItems, setFormItems, debounceRefs } =
		useContext(FormBuilderContext);

	const handleCheckboxClick = useDebouncedCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			const target = e.target as HTMLButtonElement;
			props.required = target.ariaChecked === "true" ? true : false;
		},
		constants.debounceWait,
	);
	const handleTitleChange = useDebouncedCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			props.title = e.target.value;
		},
		constants.debounceWait,
	);

	useEffect(() => {
		if (titleRef.current == null) return;
		autosize(titleRef.current);

		debounceRefs
			.set(`${id}:checkbox`, handleCheckboxClick)
			.set(`${id}:title`, handleTitleChange);
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
							className="h-[36px] w-[600px] resize-none font-normal"
							maxLength={500}
						/>
					</CardTitle>
					<div
						className=" mt-[9px] fill-red-600"
						style={{ cursor: "pointer" }}
						onClick={handleDeleteClick}
					>
						<DeleteIcon />
					</div>
				</div>
				<div className="flex space-x-2 pt-2">
					<Label htmlFor="required">Required</Label>
					<Checkbox
						id="required"
						onClick={handleCheckboxClick}
						defaultChecked={props.required}
					/>
				</div>
			</CardHeader>
			{children}
		</div>
	);

	function handleDeleteClick() {
		const itemIndex = formItems.findIndex((formItem) => formItem.id === id);
		for (const key of debounceRefs.keys()) {
			if (key.startsWith(`${id}:`)) debounceRefs.delete(key);
		}

		setFormItems([
			...formItems.slice(0, itemIndex),
			...formItems.slice(itemIndex + 1),
		]);
	}
});
