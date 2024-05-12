import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormBuilderContext } from "@/contexts/FormBuilderContext";
import { DropdownProps } from "@/interfaces/form-component-interfaces/dropdown/DropdownProps";
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
import { memo, useContext, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { SortableItem } from "../SortableItem";
import DropdownItem from "./DropdownItem";

function Dropdown({
	id,
	index,
	props,
}: {
	id: string;
	index: number;
	props: DropdownProps;
}) {
	return (
		<SortableItem
			index={index}
			id={id}
			props={props}
			SortableItemChild={DropdownWrapper}
		/>
	);
}

const DropdownWrapper = memo(function DropdownWrapper({
	id,
	props,
	isFocused,
}: {
	id: string;
	isFocused: boolean;
	props: DropdownProps;
}) {
	return (
		<>
			{isFocused ? (
				<FocusedDropdown props={props} id={id} />
			) : (
				<UnfocusedDropdown props={props} />
			)}
		</>
	);
});

function FocusedDropdown({ props, id }: { props: DropdownProps; id: string }) {
	const { debounceRefs } = useContext(FormBuilderContext);
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const [itemsState, setItemsState] = useState([...props.items]);

	const contentRef = useRef<HTMLDivElement>(null);

	return (
		<CardContent ref={contentRef}>
			<div>
				<DndContext
					id={`${id}dropdown-context`}
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
								<DropdownItem
									props={item}
									key={item.id}
									onDelete={handleDeleteClick}
								/>
							);
						})}
					</SortableContext>
				</DndContext>
			</div>
			<div className="flex items-center">
				<Button
					onClick={handleAddItemClick}
					variant={"ghost"}
					className="px-2"
				>
					Add item
				</Button>
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
		const newItem = {
			id: uuidv4(),
			parentId: id,
			value: "",
		};
		props.items.push(newItem);
		setItemsState([...props.items]);
	}

	function handleDeleteClick(idToDelete: string) {
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
}

function UnfocusedDropdown({ props }: { props: DropdownProps }) {
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
			<CardContent className="space-y-5 [overflow-wrap:anywhere]">
				{props.items.map((item, index) => (
					<p className="flex" key={index + 1}>
						<span className="mr-1 whitespace-nowrap">{index + 1}.</span>
						<span className="flex-1">{item.value}</span>
					</p>
				))}
			</CardContent>
		</div>
	);
}

export default Dropdown;
