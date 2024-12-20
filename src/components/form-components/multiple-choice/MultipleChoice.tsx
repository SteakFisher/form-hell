import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { constants } from "@/constants";
import { FormBuilderContext } from "@/contexts/FormBuilderContext";
import { SortableItemContext } from "@/contexts/SortableItemContext";
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
import { CircleIcon, Cross1Icon } from "@radix-ui/react-icons";
import { FormItemMediaProps, MultipleChoiceProps } from "formhell-js";
import {
	createContext,
	memo,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { useDebouncedCallback } from "use-debounce";
import { v4 as uuidv4 } from "uuid";
import { SortableItem } from "../SortableItem";
import MultipleChoiceItem from "./MultipleChoiceItem";

interface MultipleChoiceContextInterface {
	checkForEmptyItems: () => void;
	multipleChoiceError: string;
	setMultipleChoiceError: (value: string) => void;
}

export const MultipleChoiceContext =
	createContext<MultipleChoiceContextInterface>({
		checkForEmptyItems: () => {},
		multipleChoiceError: "",
		setMultipleChoiceError: () => {},
	});

const MultipleChoice = memo(function MultipleChoice({
	id,
	mediaProps,
	props,
}: {
	id: string;
	mediaProps: FormItemMediaProps;
	props: MultipleChoiceProps;
}) {
	const [multipleChoiceError, setMultipleChoiceError] = useState("");

	useEffect(() => {
		if (props.items.length) checkForEmptyItems();
	}, []);

	return (
		<MultipleChoiceContext.Provider
			value={{
				checkForEmptyItems,
				multipleChoiceError,
				setMultipleChoiceError,
			}}
		>
			<SortableItem
				id={id}
				mediaProps={mediaProps}
				props={props}
				SortableItemChild={MultipleChoiceWrapper}
			/>
		</MultipleChoiceContext.Provider>
	);

	function checkForEmptyItems() {
		for (const item of props.items) {
			if (item.value.trim() === "") {
				setMultipleChoiceError("Item cannot be empty");
				return;
			}
		}
		setMultipleChoiceError("");
	}
});

const MultipleChoiceWrapper = memo(function MultipleChoiceWrapper({
	id,
	props,
	isFocused,
}: {
	id: string;
	isFocused: boolean;
	props: MultipleChoiceProps;
}) {
	const [isRadio, setIsRadio] = useState(!props.allowMultiple);

	const { sortableItemRef } = useContext(SortableItemContext);
	const { multipleChoiceError } = useContext(MultipleChoiceContext);

	useEffect(() => {
		sortableItemRef.current?.setAttribute(
			"data-error",
			`${!!multipleChoiceError}`,
		);
	}, [multipleChoiceError]);

	return isFocused ? (
		<FocusedMultipleChoice
			id={id}
			props={props}
			isRadio={isRadio}
			setIsRadio={setIsRadio}
		/>
	) : (
		<UnfocusedMultipleChoice props={props} isRadio={isRadio} />
	);
});

const FocusedMultipleChoice = memo(function FocusedMultipleChoice({
	id,
	isRadio,
	props,
	setIsRadio,
}: {
	id: string;
	isRadio: boolean;
	props: MultipleChoiceProps;
	setIsRadio: (value: boolean) => void;
}) {
	const { debounceRefs } = useContext(FormBuilderContext);
	const { checkForEmptyItems, multipleChoiceError, setMultipleChoiceError } =
		useContext(MultipleChoiceContext);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const [hasOther, setHasOther] = useState(props.hasOther);
	const [hideAdd, setHideAdd] = useState(
		props.items.length + +hasOther === 10,
	);
	const [hideDelete, setHideDelete] = useState(
		props.items.length + +hasOther === 1,
	);
	const [itemsState, setItemsState] = useState([...props.items]);

	const contentRef = useRef<HTMLDivElement>(null);

	const handleAllowMultipleClick = useDebouncedCallback(
		(isChecked: boolean) => {
			props.allowMultiple = isChecked;
			setIsRadio(!isChecked);
		},
		constants.debounceWait,
	);

	useEffect(() => {
		const refs = debounceRefs.get(id);
		if (!refs) return;
		refs.set("allow-multiple", handleAllowMultipleClick);
	}, []);

	return (
		<CardContent className="mt-5 pb-4" ref={contentRef} tabIndex={-1}>
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
									hideDelete={hideDelete}
									index={index + 1}
									isRadio={isRadio}
									key={item.id}
									onDelete={handleDeleteClick}
									parentId={id}
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
				{hideAdd || (
					<>
						<Button
							onClick={handleAddItemClick}
							variant={"ghost"}
							className="px-2"
						>
							Add item
						</Button>
						{hasOther || (
							<>
								<span className="px-1 text-sm font-medium">or</span>
								<Button
									variant={"ghost"}
									className="px-2"
									onClick={handleAddOtherClick}
								>
									{'Add "Other"'}
								</Button>
							</>
						)}
					</>
				)}
			</div>
			<div className="error">{multipleChoiceError}</div>
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
			value: "",
		};
		props.items.push(newItem);
		setHideDelete(false);
		if (props.items.length + +hasOther === 10) setHideAdd(true);
		setItemsState([...props.items]);
		setMultipleChoiceError("Item cannot be empty");
	}

	function handleAddOtherClick() {
		props.hasOther = true;
		setHasOther(true);
		if (props.items.length + +hasOther === 10) setHideAdd(true);
		contentRef.current?.focus();
	}

	function handleDeleteClick(idToDelete: string) {
		const itemIndex = props.items.findIndex((item) => item.id === idToDelete);
		const item = props.items[itemIndex];
		props.items = [
			...props.items.slice(0, itemIndex),
			...props.items.slice(itemIndex + 1),
		];
		setHideAdd(false);
		if (props.items.length === 1) setHideDelete(true);
		setItemsState(props.items);
		if (item.value === "") checkForEmptyItems();
		debounceRefs.delete(`${id}:${item.id}:text`);

		contentRef.current?.focus();
	}

	function handleDeleteOtherClick() {
		props.hasOther = false;
		setHideAdd(false);
		setHasOther(false);

		contentRef.current?.focus();
	}
});

const MultipleChoiceOtherItem = memo(function MultipleChoiceOtherItem({
	isRadio,
	onDelete,
}: {
	isRadio: boolean;
	onDelete: () => void;
}) {
	return (
		<div className="mb-3 flex items-center">
			{isRadio ? (
				<CircleIcon className="ml-2 size-5 shrink-0" />
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
});

const UnfocusedMultipleChoice = memo(function UnfocusedMultipleChoice({
	props,
	isRadio,
}: {
	props: MultipleChoiceProps;
	isRadio: boolean;
}) {
	return (
		<CardContent className="space-y-4 [overflow-wrap:anywhere]">
			{props.items.map((item, index) => {
				return (
					<div className="flex min-h-8 items-center" key={index}>
						{isRadio ? (
							<CircleIcon className="mr-2 size-5 shrink-0" />
						) : (
							<Checkbox
								disabled
								className="mr-2 disabled:cursor-default disabled:opacity-100"
							/>
						)}
						{item.value || `Option ${index + 1}`}
					</div>
				);
			})}
			{props.hasOther && (
				<div className="flex min-h-8 items-center">
					{isRadio ? (
						<CircleIcon className="mr-2 size-5 shrink-0" />
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
	);
});

export default MultipleChoice;
