import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { constants } from "@/constants";
import { FormBuilderContext } from "@/contexts/FormBuilderContext";
import { MultipleChoiceProps } from "@/interfaces/form-component-interfaces/multiple-choice/MultipleChoiceProps";
import {
	DndContext,
	DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	closestCenter,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	restrictToParentElement,
	restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
	SortableContext,
	arrayMove,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useContext, useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { SortableItem } from "../SortableItem";
import MultipleChoiceItem from "./MultipleChoiceItem";
import { Textarea } from "@/components/ui/textarea";
import { Cross1Icon } from "@radix-ui/react-icons";

function MultipleChoice({
	id,
	props,
}: {
	id: number;
	props: MultipleChoiceProps;
}) {
	const [isRadio, _setIsRadio] = useState(!props.allowMultiple);

	const setIsRadio = (value: boolean) => _setIsRadio(value);

	return (
		<SortableItem
			id={id}
			props={props}
			UnfocusedSortableItem={() => UnfocusedMultipleChoice(props, isRadio)}
			FocusedSortableItemChild={() =>
				FocusedMultipleChoice(id, isRadio, props, setIsRadio)
			}
		/>
	);
}

function FocusedMultipleChoice(
	id: number,
	isRadio: boolean,
	props: MultipleChoiceProps,
	setIsRadio: (value: boolean) => void,
) {
	const { debounceRefs } = useContext(FormBuilderContext);
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const [hasOther, setHasOther] = useState(props.hasOther);
	const [itemsState, setItemsState] = useState([...props.items]);

	const handleAllowMultipleClick = useDebouncedCallback(
		(isChecked: boolean) => {
			props.allowMultiple = isChecked;
			setIsRadio(!isChecked);
		},
		constants.debounceWait,
	);

	useEffect(() => {
		debounceRefs.set(`${id}:allow-multiple`, handleAllowMultipleClick);
	}, []);
	useEffect(() => {
		contentRef.current?.focus();
	}, [isRadio]);

	const nextId = useRef(props.items.length + 1);
	const contentRef = useRef<HTMLDivElement>(null);

	return (
		<CardContent ref={contentRef} tabIndex={-1}>
			<div className="mb-9 flex space-x-2">
				<Label htmlFor="allow-multiple">Allow multiple selection</Label>
				<Checkbox
					id="allow-multiple"
					defaultChecked={props.allowMultiple}
					onCheckedChange={handleAllowMultipleClick}
				/>
			</div>
			<div>
				<DndContext
					id={`${id}mutliple-choice-context`}
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragEnd={handleDragEnd}
					modifiers={[restrictToVerticalAxis, restrictToParentElement]}
				>
					<SortableContext
						items={itemsState}
						strategy={verticalListSortingStrategy}
					>
						{itemsState.map((item, index) => {
							return (
								<MultipleChoiceItem
									isRadio={isRadio}
									key={item.id}
									onDelete={handleDeleteClick}
									props={item}
								/>
							);
						})}
					</SortableContext>
				</DndContext>
				{hasOther && (
					<MultipleChoiceOtherItem
						isRadio={isRadio}
						onDelete={handleDeleteOtherClick}
					/>
				)}
			</div>
			<div className="flex items-center">
				<Button
					onClick={handleAddItemClick}
					variant={"ghost"}
					className="px-2"
				>
					{`Add Item`}
				</Button>
				{!hasOther && (
					<>
						<span className="px-1 text-sm font-medium">or</span>
						<Button
							variant={"ghost"}
							className="px-2"
							onClick={handleAddOtherClick}
						>{`Add "Other"`}</Button>
					</>
				)}
			</div>
		</CardContent>
	);

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;

		if (over == null) return;

		const activeIndex = itemsState.findIndex((item) => item.id === active.id);
		const overIndex = itemsState.findIndex((item) => item.id === over.id);

		if (activeIndex !== overIndex) {
			props.items = arrayMove(props.items, activeIndex, overIndex);
			setItemsState(props.items);
		}
	}

	function handleAddItemClick() {
		const newItemId = nextId.current;
		nextId.current++;
		const newItem = {
			id: newItemId,
			parentId: id,
			value: "",
		};
		props.items.push(newItem);
		setItemsState([...props.items]);
	}

	function handleAddOtherClick() {
		props.hasOther = true;
		setHasOther(true);
		contentRef.current?.focus();
	}

	function handleDeleteClick(idToDelete: number) {
		const itemIndex = props.items.findIndex((item) => item.id === idToDelete);
		const item = props.items[itemIndex];
		props.items = [
			...props.items.slice(0, itemIndex),
			...props.items.slice(itemIndex + 1),
		];
		setItemsState(props.items);
		debounceRefs.delete(`${id}:${item.id}:text`);

		contentRef.current?.focus();
	}

	function handleDeleteOtherClick() {
		props.hasOther = false;
		setHasOther(false);

		contentRef.current?.focus();
	}
}

function MultipleChoiceOtherItem({
	isRadio,
	onDelete,
}: {
	isRadio: boolean;
	onDelete: () => void;
}) {
	return (
		<div className="mb-3 flex items-center">
			{isRadio ? (
				<div className="ml-2 aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow" />
			) : (
				<Checkbox
					disabled
					className="ml-2 disabled:cursor-default disabled:opacity-100"
				/>
			)}
			<div className="ml-2 flex size-full items-center justify-between">
				<Textarea
					disabled={true}
					value="Other"
					className="h-[36px] resize-none disabled:cursor-default"
				/>
				<Button
					className="ml-2 size-9 px-3"
					variant="ghost"
					size="icon"
					onClick={() => {
						onDelete();
					}}
				>
					<Cross1Icon />
				</Button>
			</div>
		</div>
	);
}

function UnfocusedMultipleChoice(props: MultipleChoiceProps, isRadio: boolean) {
	return (
		<div className="h-min w-full whitespace-pre-wrap leading-snug">
			<CardHeader>
				<CardTitle className="flex leading-snug [overflow-wrap:anywhere]">
					<span>{props.title || "Title"}</span>
					<span>
						{props.required && <sup className="ml-2 text-red-500">*</sup>}
					</span>
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4 [overflow-wrap:anywhere]">
				{props.items.map((item, index) => {
					return (
						<div className="flex min-h-8 items-center" key={index}>
							{isRadio ? (
								<div className="mr-2 aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow" />
							) : (
								<Checkbox
									disabled
									className="mr-2 disabled:cursor-default disabled:opacity-100"
								/>
							)}
							{item.value}
						</div>
					);
				})}
				{props.hasOther && (
					<div className="flex min-h-8 items-center">
						{isRadio ? (
							<div className="mr-2 aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow" />
						) : (
							<Checkbox
								disabled
								className="mr-2 disabled:cursor-default disabled:opacity-100"
							/>
						)}
						<Input
							className="disabled:cursor-default disabled:opacity-100"
							placeholder="Other"
							disabled
						/>
					</div>
				)}
			</CardContent>
		</div>
	);
}

export default MultipleChoice;
