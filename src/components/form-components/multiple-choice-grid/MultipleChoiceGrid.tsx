import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MCGridConstants, constants } from "@/constants";
import { FormBuilderContext } from "@/contexts/FormBuilderContext";
import { SortableItemContext } from "@/contexts/SortableItemContext";
import MultipleChoiceGridProps from "@/interfaces/form-component-interfaces/multiple-choice-grid/MultipleChoiceGridProps";
import { FormItemMediaProps } from "@/interfaces/FormItemMediaProps";
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
import { CircleIcon } from "@radix-ui/react-icons";
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
import MultipleChoiceGridItem from "./MultipleChoiceGridItem";

interface MCGridContextInterface {
	checkForEmptyColumns: () => void;
	checkForEmptyRows: () => void;
	MCGridColumnError: string;
	MCGridRowError: string;
	setMCGridColumnError: (value: string) => void;
	setMCGridRowError: (value: string) => void;
}

export const MCGridContext = createContext<MCGridContextInterface>({
	checkForEmptyColumns: () => {},
	checkForEmptyRows: () => {},
	MCGridColumnError: "",
	MCGridRowError: "",
	setMCGridColumnError: () => {},
	setMCGridRowError: () => {},
});

const MultipleChoiceGrid = memo(function MultipleChoiceGrid({
	id,
	mediaProps,
	props,
}: {
	id: string;
	mediaProps: FormItemMediaProps;
	props: MultipleChoiceGridProps;
}) {
	const [MCGridColumnError, setMCGridColumnError] = useState("");
	const [MCGridRowError, setMCGridRowError] = useState("");

	useEffect(() => {
		if (props.columns.length) checkForEmptyColumns();
		if (props.rows.length) checkForEmptyRows();
	}, []);

	return (
		<MCGridContext.Provider
			value={{
				checkForEmptyColumns,
				checkForEmptyRows,
				MCGridColumnError,
				MCGridRowError,
				setMCGridColumnError,
				setMCGridRowError,
			}}
		>
			<SortableItem
				id={id}
				mediaProps={mediaProps}
				props={props}
				SortableItemChild={MultipleChoiceGridWrapper}
			/>
		</MCGridContext.Provider>
	);

	function checkForEmptyColumns() {
		for (const column of props.columns) {
			if (column.value.trim() === "") {
				setMCGridColumnError("Column cannot be empty");
				return;
			}
		}
		setMCGridColumnError("");
	}

	function checkForEmptyRows() {
		for (const row of props.rows) {
			if (row.value.trim() === "") {
				setMCGridRowError("Row cannot be empty");
				return;
			}
		}
		setMCGridRowError("");
	}
});

const MultipleChoiceGridWrapper = memo(function MultipleChoiceGridWrapper({
	id,
	props,
	isFocused,
}: {
	id: string;
	isFocused: boolean;
	props: MultipleChoiceGridProps;
}) {
	const [isRadio, setIsRadio] = useState(!props.allowMultiple);

	const { sortableItemRef } = useContext(SortableItemContext);
	const { MCGridColumnError, MCGridRowError } = useContext(MCGridContext);

	useEffect(() => {
		sortableItemRef.current?.setAttribute(
			"data-error",
			`${!!(MCGridColumnError || MCGridRowError)}`,
		);
	}, [MCGridColumnError, MCGridRowError]);

	return (
		<>
			{isFocused ? (
				<FocusedMultipleChoiceGrid
					id={id}
					props={props}
					setIsRadio={setIsRadio}
				/>
			) : (
				<UnfocusedMultipleChoiceGrid props={props} isRadio={isRadio} />
			)}
		</>
	);
});

const FocusedMultipleChoiceGrid = memo(function FocusedMultipleChoiceGrid({
	id,
	props,
	setIsRadio,
}: {
	id: string;
	props: MultipleChoiceGridProps;
	setIsRadio: (value: boolean) => void;
}) {
	const { debounceRefs } = useContext(FormBuilderContext);
	const {
		checkForEmptyColumns,
		checkForEmptyRows,
		MCGridColumnError,
		MCGridRowError,
		setMCGridColumnError,
		setMCGridRowError,
	} = useContext(MCGridContext);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const [rowsState, setRowsState] = useState([...props.rows]);
	const [columnsState, setColumnsState] = useState([...props.columns]);
	const [hideRowDelete, setHideRowDelete] = useState(rowsState.length === 1);
	const [hideColumnDelete, setHideColumnDelete] = useState(
		columnsState.length === 1,
	);
	const [showAddRow, setShowAddRow] = useState(
		rowsState.length < MCGridConstants.maxItems,
	);
	const [showAddColumn, setShowAddColumn] = useState(
		columnsState.length < MCGridConstants.maxItems,
	);

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

	const contentRef = useRef<HTMLDivElement>(null);

	return (
		<CardContent className="mt-5" ref={contentRef} tabIndex={-1}>
			<div className="mb-9 flex space-x-2">
				<Label htmlFor="allow-multiple">Allow multiple selection</Label>
				<Checkbox
					id="allow-multiple"
					defaultChecked={props.allowMultiple}
					onCheckedChange={handleAllowMultipleClick}
				/>
			</div>
			<div className="flex w-full space-x-1.5">
				<div className="w-1/2">
					<span className="ml-[6px] text-sm font-semibold">Rows</span>
					<div className="mt-2">
						<DndContext
							id={`${id}rows-context`}
							sensors={sensors}
							collisionDetection={closestCenter}
							onDragEnd={(e) => handleDragEnd(e, "row")}
							modifiers={[
								restrictToVerticalAxis,
								restrictToParentElement,
							]}
						>
							<SortableContext
								items={rowsState}
								strategy={verticalListSortingStrategy}
							>
								{rowsState.map((item, index) => {
									return (
										<MultipleChoiceGridItem
											hideDelete={hideRowDelete}
											key={item.id}
											onDelete={(idToDelete) =>
												handleDeleteClick(idToDelete, "row")
											}
											placeholder={`Row ${index + 1}`}
											props={item}
											type="row"
										/>
									);
								})}
							</SortableContext>
						</DndContext>
					</div>
					{showAddRow && (
						<div className="flex items-center">
							<Button
								onClick={() => handleAddItemClick("row")}
								variant={"ghost"}
								className="px-2"
							>
								Add row
							</Button>
						</div>
					)}
					<div className="error">{MCGridRowError}</div>
				</div>
				<div className="my-1 w-[1px] bg-white opacity-75" />
				<div className="w-1/2">
					<span className="ml-[6px] text-sm font-semibold">Columns</span>
					<div className="mt-2">
						<DndContext
							id={`${id}columns-context`}
							sensors={sensors}
							collisionDetection={closestCenter}
							onDragEnd={(e) => handleDragEnd(e, "column")}
							modifiers={[
								restrictToVerticalAxis,
								restrictToParentElement,
							]}
						>
							<SortableContext
								items={columnsState}
								strategy={verticalListSortingStrategy}
							>
								{columnsState.map((item, index) => {
									return (
										<MultipleChoiceGridItem
											hideDelete={hideColumnDelete}
											key={item.id}
											onDelete={(idToDelete) =>
												handleDeleteClick(idToDelete, "column")
											}
											placeholder={`Column ${index + 1}`}
											props={item}
											type="column"
										/>
									);
								})}
							</SortableContext>
						</DndContext>
					</div>
					{showAddColumn && (
						<div className="flex items-center">
							<Button
								onClick={() => handleAddItemClick("column")}
								variant={"ghost"}
								className="px-2"
							>
								Add column
							</Button>
						</div>
					)}
					<div className="error">{MCGridColumnError}</div>
				</div>
			</div>
		</CardContent>
	);

	function handleDragEnd(event: DragEndEvent, type: "row" | "column") {
		const { active, over } = event;
		if (over == null) return;

		if (type === "row") {
			const activeIndex = rowsState.findIndex(
				(item) => item.id === active.id,
			);
			const overIndex = rowsState.findIndex((item) => item.id === over.id);

			if (activeIndex !== overIndex) {
				props.rows = arrayMove(props.rows, activeIndex, overIndex);
				setRowsState(props.rows);
			}
		} else {
			const activeIndex = columnsState.findIndex(
				(item) => item.id === active.id,
			);
			const overIndex = columnsState.findIndex(
				(item) => item.id === over.id,
			);

			if (activeIndex !== overIndex) {
				props.columns = arrayMove(props.columns, activeIndex, overIndex);
				setColumnsState(props.columns);
			}
		}
	}

	function handleAddItemClick(type: "row" | "column") {
		const newItem = {
			id: uuidv4(),
			parentId: id,
			value: "",
		};

		if (type === "row") {
			props.rows.push(newItem);
			if (props.rows.length === MCGridConstants.maxItems)
				setShowAddRow(false);
			else setHideRowDelete(false);

			setRowsState([...props.rows]);
			setMCGridRowError("Row cannot be empty");
		} else {
			props.columns.push(newItem);
			if (props.columns.length === MCGridConstants.maxItems)
				setShowAddColumn(false);
			else setHideColumnDelete(false);

			setColumnsState([...props.columns]);
			setMCGridColumnError("Column cannot be empty");
		}
	}

	function handleDeleteClick(idToDelete: string, type: "row" | "column") {
		if (type === "row") {
			for (const [index, row] of props.rows.entries()) {
				if (row.id === idToDelete) {
					props.rows = [
						...props.rows.slice(0, index),
						...props.rows.slice(index + 1),
					];
					setRowsState(props.rows);
					if (row.value === "") checkForEmptyRows();
					debounceRefs.delete(`${id}:${row.id}:text`);
					break;
				}
			}

			if (props.rows.length === 1) setHideRowDelete(true);
			else if (props.rows.length < MCGridConstants.maxItems)
				setShowAddRow(true);
		} else {
			for (const [index, column] of props.columns.entries()) {
				if (column.id === idToDelete) {
					props.columns = [
						...props.columns.slice(0, index),
						...props.columns.slice(index + 1),
					];
					setColumnsState(props.columns);
					if (column.value === "") checkForEmptyColumns();
					debounceRefs.delete(`${id}:${column.id}:text`);
					break;
				}
			}
			if (props.columns.length === 1) setHideColumnDelete(true);
			else if (props.columns.length < MCGridConstants.maxItems)
				setShowAddColumn(true);
		}

		contentRef.current?.focus();
	}
});

const UnfocusedMultipleChoiceGrid = memo(function UnfocusedMultipleChoiceGrid({
	props,
	isRadio,
}: {
	props: MultipleChoiceGridProps;
	isRadio: boolean;
}) {
	return (
		<CardContent className="space-y-4 [overflow-wrap:anywhere]">
			<div className="flex min-h-8 items-center space-x-2">
				<div className="flex-1" />
				{props.columns.map((column, index) => (
					<span key={index} className="flex-1 truncate text-center">
						{column.value || `Column ${index + 1}`}
					</span>
				))}
			</div>
			{props.rows.map((row, index) => {
				return (
					<div className="flex min-h-8 items-center space-x-2" key={index}>
						<span className="flex-1 truncate">
							{row.value || `Row ${index + 1}`}
						</span>
						{props.columns.map((column, index) => (
							<div
								key={index}
								className="flex flex-1 items-center justify-center"
							>
								{isRadio ? (
									<CircleIcon className="size-5 shrink-0" />
								) : (
									<Checkbox
										disabled
										className="disabled:cursor-default disabled:opacity-100"
									/>
								)}
							</div>
						))}
					</div>
				);
			})}
		</CardContent>
	);
});

export default MultipleChoiceGrid;
