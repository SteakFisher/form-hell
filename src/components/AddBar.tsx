import {
	dateConstants,
	dropdownConstants,
	MCGridConstants,
	mediaConstants,
	multipleChoiceConstants,
	rangeConstants,
	textInputConstants,
} from "@/constants";
import { FormBuilderContext } from "@/contexts/FormBuilderContext";
import {
	CalendarIcon,
	CheckCircledIcon,
	DropdownMenuIcon,
	PlusCircledIcon,
	SliderIcon,
	TextIcon,
} from "@radix-ui/react-icons";
import { FormItem, FormItemTypes, propsTypes } from "formhell-js";
import {
	MutableRefObject,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { v4 as uuidv4 } from "uuid";
import MCQGridIcon from "../../public/icons/mcq_grid.svg";
import MediaIcon from "../../public/icons/media.svg";
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
	const { formItems, setFormItems } = useContext(FormBuilderContext);
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
					<DropdownMenuItem
						className="h-10 text-sm"
						onPointerLeave={preventPointerEvent}
						onPointerMove={preventPointerEvent}
						onSelect={(e) => {
							handleAddElement(e, "media");
						}}
					>
						Media
						<DropdownMenuShortcut className="size-[1.3rem] fill-white">
							<MediaIcon />
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

		const newItem: FormItem = {
			id: newId,
			mediaProps: { mediaAltText: "", mediaType: "image", mediaUrl: "" },
			props: { ...returnTypeProps(type, newId) },
		};

		const newFormItems: FormItem[] = [];
		if (id === "0") {
			newFormItems.push(newItem, ...formItems);
		} else {
			formItems.forEach((formItem) => {
				newFormItems.push(formItem);
				if (formItem.id === id) {
					newFormItems.push(newItem);
				}
			});
		}

		setIsOpen(false);
		setFormItems(newFormItems);
	}

	function handleOpenChange(newIsOpen: boolean) {
		setIsOpen(newIsOpen);
	}

	function returnTypeProps(type: FormItemTypes, parentId: string): propsTypes {
		switch (type) {
			case "date":
				return dateConstants.defaultProps;
			case "dropdown":
				return {
					...dropdownConstants.defaultProps,
					items: new Array({
						id: uuidv4(),
						value: "",
					}),
				};
			case "media":
				return mediaConstants.defaultProps;
			case "multiple-choice":
				return {
					...multipleChoiceConstants.defaultProps,
					items: new Array({
						id: uuidv4(),
						value: "",
					}),
				};
			case "multiple-choice-grid":
				return {
					...MCGridConstants.defaultProps,
					columns: new Array({
						id: uuidv4(),
						value: "",
					}),
					rows: new Array({
						id: uuidv4(),
						value: "",
					}),
				};
			case "range":
				return rangeConstants.defaultProps;
			case "text-input":
				return textInputConstants.defaultProps;
		}
	}
}

export default AddBar;
