"use client";

import { constants } from "@/app/constants";
import { FormBuilderContext } from "@/app/contexts/FormBuilderContext";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckboxIcon, PlusIcon, TextIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useRef, useState } from "react";
import ToolbarButton from "./ToolbarButton";
import { typesEnum } from "@/app/misc/typesEnum";
import { propsTypes } from "@/app/interfaces/propsTypes";

const Toolbar = () => {
	const { formItems, setFormItems, debounceRefs } =
		useContext(FormBuilderContext);
	let nextId = useRef(1);
	const router = useRouter();

	return (
		<div className="fixed right-3 top-1/2 -translate-y-1/2 transform rounded border-2 bg-white p-2 shadow-md">
			<DropdownMenu>
				<DropdownMenuTrigger>
					<ToolbarButton className="justify-center">
						<Image
							src={"/icons/plus.svg"}
							alt="Add"
							width={33}
							height={33}
						/>
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
							<TextIcon className="size-5" />
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
							<CheckboxIcon className="size-5" />
						</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<ToolbarButton onBtnClick={handleSaveClick}>
				<Image src={"/icons/save.svg"} alt="Save" width={50} height={50} />
			</ToolbarButton>
		</div>
	);

	function handleAddElement(type: typesEnum) {
		const newFormItems = [
			...formItems,
			{
				id: nextId.current,
				props: { ...returnTypeProps(type) },
			},
		];
		nextId.current ++;
		setFormItems(newFormItems);
	}

	function returnTypeProps(type: typesEnum): propsTypes {
		switch (type) {
			case typesEnum["text-input"]:
				return constants.defaultTextInputProps;
			case typesEnum.title:
				return constants.defaultTitleProps;
			case typesEnum["multiple-choice"]:
				return {...constants.defaultMultipleChoiceProps, items: new Array()};
		}
	}

	function handleSaveClick() {
		debounceRefs.forEach((ref) => {
			ref.flush();
		});

		router.push(`../../new-form/save?formItems=${JSON.stringify(formItems)}`);
	}
};

export default Toolbar;
