"use client";

import { constants } from "@/constants";
import { FormBuilderContext } from "@/contexts/FormBuilderContext";
import { propsTypes } from "@/interfaces/propsTypes";
import { typesEnum } from "@/misc/typesEnum";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	CalendarIcon,
	CheckboxIcon,
	CheckCircledIcon,
	DropdownMenuIcon,
	SliderIcon,
	TextIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useRef } from "react";
import ToolbarButton from "./ToolbarButton";
import MCQGridIcon from "../../../public/icons/mcq_grid.svg";
import PlusIcon from "../../../public/icons/plus.svg";
import SaveIcon from "../../../public/icons/save.svg";
import { v4 as uuidv4 } from "uuid";

const Toolbar = () => {
	const { formItems, setFormItems, debounceRefs, focusedItemRef } =
		useContext(FormBuilderContext);
	const router = useRouter();

	return (
		<div className="fixed right-3 top-1/2 -translate-y-1/2 transform space-y-2 rounded border-2 bg-black p-2 shadow-md">
			<DropdownMenu>
				<DropdownMenuTrigger className="custom-focus">
					<ToolbarButton className="items-center justify-center">
						<div className="size-7 fill-white opacity-80">
							<PlusIcon />
						</div>
					</ToolbarButton>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					className="w-56"
					side="left"
					align="start"
					sideOffset={9}
				>
					<DropdownMenuItem
						className="h-10 text-sm"
						onSelect={() => {
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
			<ToolbarButton
				onBtnClick={handleSaveClick}
				className="items-center justify-center"
			>
				<div className="size-10 fill-white opacity-80">
					<SaveIcon />
				</div>
			</ToolbarButton>
		</div>
	);

	function handleAddElement(type: typesEnum) {
		const newId = uuidv4();
		const newItem = {
			id: newId,
			props: { ...returnTypeProps(type, newId) },
		};
		setFormItems([...formItems, newItem]);
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

	function handleSaveClick() {
		debounceRefs.get(focusedItemRef.current.id)?.forEach((ref) => {
			ref.flush();
		});

		localStorage.setItem("formItems", JSON.stringify(formItems));

		router.push("../../new-form/save");
	}
};

export default Toolbar;
