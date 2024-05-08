import { constants } from "@/constants";
import { FormBuilderContext } from "@/contexts/FormBuilderContext";
import FormItem from "@/interfaces/FormItem";
import { propsTypes } from "@/interfaces/propsTypes";
import { typesEnum } from "@/misc/typesEnum";
import {
	CalendarIcon,
	CheckCircledIcon,
	DropdownMenuIcon,
	PlusCircledIcon,
	SliderIcon,
	TextIcon,
} from "@radix-ui/react-icons";
import {
	RefObject,
	useContext
} from "react";
import { v4 as uuidv4 } from "uuid";
import MCQGridIcon from "../../public/icons/mcq_grid.svg";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

function AddBar({
	addMenuRef,
	id,
}: {
	id: string;
	addMenuRef?: RefObject<HTMLDivElement>;
}) {
	const { formItems, focusedItemRef, setFormItems} = useContext(FormBuilderContext);

	return (
		<div className="-z-10 flex h-8 w-full items-center px-2">
			<div className="h-[1px] flex-grow bg-addbar" />
			<DropdownMenu onOpenChange={handleOpenChange}>
				<DropdownMenuTrigger className="custom-focus">
					<PlusCircledIcon className="mx-1.5 size-6 text-addbar" />
				</DropdownMenuTrigger>
				<DropdownMenuContent
					align="center"
					className="w-56"
					data-addmenu
					onCloseAutoFocus={(e) => e.preventDefault()}
					ref={addMenuRef}
					side="bottom"
					sideOffset={9}
				>
					<DropdownMenuItem
						className="h-10 text-sm"
						onSelect={(e) => {
							handleAddElement(typesEnum["text-input"]);
						}}
					>
						Text
						<DropdownMenuShortcut>
							<TextIcon className="size-[1.4rem]" />
						</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem
						className="h-10 text-sm"
						onSelect={() => {
							handleAddElement(typesEnum["multiple-choice"]);
						}}
					>
						Multiple choice
						<DropdownMenuShortcut>
							<CheckCircledIcon className="size-[1.4rem]" />
						</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem
						className="h-10 text-sm"
						onSelect={() => {
							handleAddElement(typesEnum["dropdown"]);
						}}
					>
						Dropdown
						<DropdownMenuShortcut>
							<DropdownMenuIcon className="size-[1.4rem]" />
						</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem
						className="h-10 text-sm"
						onSelect={() => {
							handleAddElement(typesEnum["range"]);
						}}
					>
						Range
						<DropdownMenuShortcut>
							<SliderIcon className="size-[1.4rem]" />
						</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem
						className="h-10 text-sm"
						onSelect={() => {
							handleAddElement(typesEnum["multiple-choice-grid"]);
						}}
					>
						Multiple choice grid
						<DropdownMenuShortcut className="size-[1.4rem] fill-white">
							<MCQGridIcon />
						</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem
						className="h-10 text-sm"
						onSelect={() => {
							handleAddElement(typesEnum["date"]);
						}}
					>
						Date
						<DropdownMenuShortcut>
							<CalendarIcon className="size-[1.4rem]" />
						</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<div className="h-[1px] flex-grow bg-addbar" />
		</div>
	);

	async function handleAddElement(type: typesEnum) {
		const newId = uuidv4();
		const newItem = {
			id: newId,
			props: { ...returnTypeProps(type, newId) },
		};

		const newFormItems: FormItem[] = [];
		formItems.forEach((formItem) => {
			newFormItems.push(formItem);
			if (formItem.id === id) {
				newFormItems.push(newItem);
			}
		});

		setFormItems(newFormItems);
	}

	async function handleOpenChange(isOpen: boolean) {
		if (!isOpen) {
			focusedItemRef.current.blurItem();
		}
	}

	function returnTypeProps(type: typesEnum, parentId: string): propsTypes {
		switch (type) {
			case typesEnum["date"]:
				return constants.defaultDateProps;
			case typesEnum["dropdown"]:
				return {
					...constants.defaultDropdownProps,
					items: new Array({
						id: uuidv4(),
						parentId: parentId,
						value: "Option 1",
					}),
				};
			case typesEnum["multiple-choice"]:
				return {
					...constants.defaultMultipleChoiceProps,
					items: new Array({
						id: uuidv4(),
						parentId: parentId,
						value: "Option 1",
					}),
				};
			case typesEnum["multiple-choice-grid"]:
				return {
					...constants.defaultMultipleChoiceGridProps,
					columns: new Array({
						id: uuidv4(),
						parentId: parentId,
						value: "Column 1",
					}),
					rows: new Array({
						id: uuidv4(),
						parentId: parentId,
						value: "Row 1",
					}),
				};
			case typesEnum["range"]:
				return constants.defaultRangeProps;
			case typesEnum["text-input"]:
				return constants.defaultTextInputProps;
			case typesEnum["title"]:
				return constants.defaultTitleProps;
		}
	}
}

export default AddBar;
