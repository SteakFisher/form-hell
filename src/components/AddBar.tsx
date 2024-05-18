import { constants } from "@/constants";
import { FormBuilderContext } from "@/contexts/FormBuilderContext";
import FormItem from "@/interfaces/FormItem";
import { FormItemTypes } from "@/interfaces/FormItemTypes";
import { propsTypes } from "@/interfaces/propsTypes";
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
	useContext,
	useEffect,
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

function AddBar({
	focusingItemIdRef,
	id,
}: {
	focusingItemIdRef?: MutableRefObject<string>;
	id: string;
}) {
	const { formItems, focusedItemRef, setFormItems } =
		useContext(FormBuilderContext);
	const [isOpen, setIsOpen] = useState(false);

	const didSelectRef = useRef(false);

	useEffect(() => {
		if (isOpen) {
			didSelectRef.current = false;
		}
	}, [isOpen]);

	return (
		<div className="-z-10 flex h-8 w-full items-center px-2">
			<div className="h-[1px] flex-grow bg-addbar" />
			<DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
				<DropdownMenuTrigger className="custom-focus">
					<PlusCircledIcon className="mx-1.5 size-6 text-addbar" />
				</DropdownMenuTrigger>
				<DropdownMenuContent
					align="center"
					className="w-56"
					data-addmenu
					onCloseAutoFocus={(e) => e.preventDefault()}
					side="bottom"
					sideOffset={9}
				>
					<DropdownMenuItem
						className="h-10 text-sm"
						onPointerLeave={preventPointerEvent}
						onPointerMove={preventPointerEvent}
						onSelect={(e) => {
							handleAddElement(e, "text-input");
						}}
					>
						Text
						<DropdownMenuShortcut>
							<TextIcon className="size-[1.4rem]" />
						</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem
						className="h-10 text-sm"
						onPointerLeave={preventPointerEvent}
						onPointerMove={preventPointerEvent}
						onSelect={(e) => {
							handleAddElement(e, "multiple-choice");
						}}
					>
						Multiple choice
						<DropdownMenuShortcut>
							<CheckCircledIcon className="size-[1.4rem]" />
						</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem
						className="h-10 text-sm"
						onPointerLeave={preventPointerEvent}
						onPointerMove={preventPointerEvent}
						onSelect={(e) => {
							handleAddElement(e, "dropdown");
						}}
					>
						Dropdown
						<DropdownMenuShortcut>
							<DropdownMenuIcon className="size-[1.4rem]" />
						</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem
						className="h-10 text-sm"
						onPointerLeave={preventPointerEvent}
						onPointerMove={preventPointerEvent}
						onSelect={(e) => {
							handleAddElement(e, "range");
						}}
					>
						Range
						<DropdownMenuShortcut>
							<SliderIcon className="size-[1.4rem]" />
						</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem
						className="h-10 text-sm"
						onPointerLeave={preventPointerEvent}
						onPointerMove={preventPointerEvent}
						onSelect={(e) => {
							handleAddElement(e, "multiple-choice-grid");
						}}
					>
						Multiple choice grid
						<DropdownMenuShortcut className="size-[1.4rem] fill-white">
							<MCQGridIcon />
						</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem
						className="h-10 text-sm"
						onPointerLeave={preventPointerEvent}
						onPointerMove={preventPointerEvent}
						onSelect={(e) => {
							handleAddElement(e, "date");
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

	function preventPointerEvent(e: React.PointerEvent<HTMLDivElement>) {
		if (didSelectRef.current) {
			e.preventDefault();
		}
	}

	function handleAddElement(e: Event, type: FormItemTypes) {
		e.preventDefault();
		didSelectRef.current = true;

		const newId = uuidv4();
		if (focusingItemIdRef) focusingItemIdRef.current = newId;

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

		focusedItemRef.current.blurItem();
		setIsOpen(false);
		setFormItems(newFormItems);
	}

	function handleOpenChange(newIsOpen: boolean) {
		if (!newIsOpen) {
			focusedItemRef.current.blurItem();
		}
		setIsOpen(newIsOpen);
	}

	function returnTypeProps(type: FormItemTypes, parentId: string): propsTypes {
		switch (type) {
			case "date":
				return constants.defaultDateProps;
			case "dropdown":
				return {
					...constants.defaultDropdownProps,
					items: new Array({
						id: uuidv4(),
						parentId: parentId,
						value: "Option 1",
					}),
				};
			case "multiple-choice":
				return {
					...constants.defaultMultipleChoiceProps,
					items: new Array({
						id: uuidv4(),
						parentId: parentId,
						value: "Option 1",
					}),
				};
			case "multiple-choice-grid":
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
			case "range":
				return constants.defaultRangeProps;
			case "text-input":
				return constants.defaultTextInputProps;
			case "title":
				return constants.defaultTitleProps;
		}
	}
}

export default AddBar;
