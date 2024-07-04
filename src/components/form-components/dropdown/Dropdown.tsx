import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { FormBuilderContext } from "@/contexts/FormBuilderContext";
import { SortableItemContext } from "@/contexts/SortableItemContext";
import { DropdownProps } from "@/interfaces/form-component-interfaces/dropdown/DropdownProps";
import { FormItemMediaProps } from "formhell-js";
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
import {
	createContext,
	memo,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { SortableItem } from "../SortableItem";
import DropdownItem from "./DropdownItem";

interface DropdownContextInterface {
	checkForEmptyItems: () => void;
	dropdownError: string;
	setDropdownError: (value: string) => void;
}

export const DropdownContext = createContext<DropdownContextInterface>({
	checkForEmptyItems: () => {},
	dropdownError: "",
	setDropdownError: () => {},
});

const Dropdown = memo(function Dropdown({
	id,
	mediaProps,
	props,
}: {
	id: string;
	mediaProps: FormItemMediaProps;
	props: DropdownProps;
}) {
	const [dropdownError, setDropdownError] = useState("");

	useEffect(() => {
		if (props.items.length) checkForEmptyItems();
	}, []);

	return (
		<DropdownContext.Provider
			value={{ checkForEmptyItems, dropdownError, setDropdownError }}
		>
			<SortableItem
				id={id}
				mediaProps={mediaProps}
				props={props}
				SortableItemChild={DropdownWrapper}
			/>
		</DropdownContext.Provider>
	);

	function checkForEmptyItems() {
		for (const item of props.items) {
			if (item.value.trim() === "") {
				setDropdownError("Item cannot be empty");
				return;
			}
		}
		setDropdownError("");
	}
});

const DropdownWrapper = memo(function DropdownWrapper({
	id,
	props,
	isFocused,
}: {
	id: string;
	isFocused: boolean;
	props: DropdownProps;
}) {
	const { sortableItemRef } = useContext(SortableItemContext);
	const { dropdownError } = useContext(DropdownContext);

	useEffect(() => {
		sortableItemRef.current?.setAttribute("data-error", `${!!dropdownError}`);
	}, [dropdownError]);

	return isFocused ? (
		<FocusedDropdown props={props} id={id} />
	) : (
		<UnfocusedDropdown props={props} />
	);
});

const FocusedDropdown = memo(function FocusedDropdown({
	props,
	id,
}: {
	props: DropdownProps;
	id: string;
}) {
	const { checkForEmptyItems, dropdownError, setDropdownError } =
		useContext(DropdownContext);
	const { debounceRefs } = useContext(FormBuilderContext);
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const [hideAdd, setHideAdd] = useState(props.items.length === 10);
	const [hideDelete, setHideDelete] = useState(props.items.length === 1);
	const [itemsState, setItemsState] = useState([...props.items]);

	const contentRef = useRef<HTMLDivElement>(null);

	return (
		<CardContent className="mt-5 pb-4" ref={contentRef} tabIndex={-1}>
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
									hideDelete={hideDelete}
									index={index + 1}
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
				{hideAdd || (
					<Button
						onClick={handleAddItemClick}
						variant={"ghost"}
						className="px-2"
					>
						Add item
					</Button>
				)}
			</div>
			<div className="error">{dropdownError}</div>
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
		if (props.items.length === 10) setHideAdd(true);
		setHideDelete(false);
		setDropdownError("Item cannot be empty");
	}

	function handleDeleteClick(idToDelete: string) {
		const itemIndex = props.items.findIndex((item) => item.id === idToDelete);
		const item = props.items[itemIndex];
		props.items = [
			...props.items.slice(0, itemIndex),
			...props.items.slice(itemIndex + 1),
		];
		setItemsState(props.items);
		setHideAdd(false);
		if (props.items.length === 1) setHideDelete(true);
		if (item.value === "") checkForEmptyItems();
		debounceRefs.delete(`${id}:${item.id}:text`);

		contentRef.current?.focus();
	}
});

const UnfocusedDropdown = memo(function UnfocusedDropdown({
	props,
}: {
	props: DropdownProps;
}) {
	return (
		<CardContent className="space-y-5 [overflow-wrap:anywhere]">
			{props.items.map((item, index) => (
				<p className="flex" key={index + 1}>
					<span className="mr-1 whitespace-nowrap">{index + 1}.</span>
					<span className="flex-1">
						{item.value || `Option ${index + 1}`}
					</span>
				</p>
			))}
		</CardContent>
	);
});

export default Dropdown;
