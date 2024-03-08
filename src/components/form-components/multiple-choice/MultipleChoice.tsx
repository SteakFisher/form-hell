import { MultipleChoiceProps } from "@/interfaces/form-component-interfaces/multiple-choice/MultipleChoiceProps";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
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
import { SortableItem } from "../SortableItem";
import MultipleChoiceItem from "./MultipleChoiceItem";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useDebouncedCallback } from "use-debounce";
import { constants } from "@/constants";
import { FormBuilderContext } from "@/contexts/FormBuilderContext";

function MultipleChoice({
	id,
	props,
}: {
	id: number;
	props: MultipleChoiceProps;
}) {
	const { debounceRefs } = useContext(FormBuilderContext);
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);
	
	const [itemsState, setItemsState] = useState([...props.items]);
	const [hasOther, setHasOther] = useState(false);

	const handleCheckboxClick = useDebouncedCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			const target = e.target as HTMLButtonElement;
			props.allowMultiple = target.ariaChecked === "true" ? true : false;
		},
		constants.debounceWait,
	);

	useEffect(() => {
		props.items.forEach((item) => {
			if (item.other) setHasOther(true);
		});
		debounceRefs.set(
			`${id}:checkbox`,
			handleCheckboxClick,
		);
	}, []);
	const nextId = useRef(1);

	

	return (
		<SortableItem id={id} props={props}>
			<CardContent>
				<div className="mb-9 flex space-x-2">
					<Label htmlFor="allow-multiple">Allow multiple selection</Label>
					<Checkbox
						id="allow-multiple"
						defaultChecked={props.allowMultiple}
						onClick={handleCheckboxClick}
					/>
				</div>
				<div>
					<DndContext
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
									<MultipleChoiceItem props={item} key={item.id} />
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
		</SortableItem>
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
			onDelete: handleDeleteClick,
			parentId: id,
			placeholder: "Enter option value",
			value: "",
		};
		hasOther
			? props.items.splice(props.items.length - 1, 0, newItem)
			: props.items.push(newItem);
		setItemsState([...props.items]);
	}

	function handleAddOtherClick() {
		props.items.push({
			parentId: id,
			id: nextId.current,
			other: true,
			onDelete: handleDeleteClick,
			value: "Other",
		});
		nextId.current++;
		setHasOther(true);
		setItemsState([...props.items]);
	}

	function handleDeleteClick(idToDelete: number) {
		const itemIndex = props.items.findIndex((item) => item.id === idToDelete);
		const item = props.items[itemIndex]
		if (item.other) setHasOther(false);
		props.items = [
			...props.items.slice(0, itemIndex),
			...props.items.slice(itemIndex + 1),
		];
		setItemsState(props.items);
		debounceRefs.delete(`${id}:${item.id}:text`);
	}
}

export default MultipleChoice;
