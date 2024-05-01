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
	MutableRefObject,
	RefObject,
	useContext,
	useRef,
	useState,
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
import { cn } from "@/lib/utils";

function AddBar({
	addMenuRef,
	id,
	isFocused,
	setIsFocused,
}: {
	id: string;
	addMenuRef: RefObject<HTMLDivElement>;
	isFocused: boolean;
	setIsFocused: (value: boolean) => void;
}) {
	const { formItems, setFormItems } = useContext(FormBuilderContext);
	
	// workaround for weird dropdown animation flashing when focused
	const [isFocusedWhenOpen, setIsFocusedWhenOpen] = useState(false);

	return (
		<div className="flex h-8 w-full items-center px-2 -z-10">
			<div className="h-[1px] flex-grow bg-addbar" />
			<DropdownMenu
				onOpenChange={(isOpen) => isOpen && setIsFocusedWhenOpen(isFocused)}
			>
				<DropdownMenuTrigger className="custom-focus">
					<PlusCircledIcon className="mx-1.5 size-6 text-addbar" />
				</DropdownMenuTrigger>
				<DropdownMenuContent
					align="center"
					className={cn(
						"w-56",
						isFocusedWhenOpen && "data-[state=closed]:duration-0",
					)}
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

	function handleAddElement(type: typesEnum) {
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
		setIsFocused(false);
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
