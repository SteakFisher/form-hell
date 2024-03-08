import { constants } from "@/constants";
import { propsTypes } from "@/interfaces/propsTypes";
import { typesEnum } from "@/misc/typesEnum";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import autosize from "autosize";
import { ReactNode, useContext, useEffect, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";
import DeleteIcon from "../../../public/icons/delete.svg";
import { FormBuilderContext } from "@/contexts/FormBuilderContext";

interface SortableItemProps {
	id: number;
	children: ReactNode;
	props: propsTypes;
}

export function SortableItem({ children, id, props }: SortableItemProps) {
	const { formItems, setFormItems, debounceRefs } =
		useContext(FormBuilderContext);
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: id });
	const style = {
		transform: CSS.Translate.toString(transform),
		transition,
	};

	const titleRef = useRef(null);

	const handleCheckboxClick = useDebouncedCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			const target = e.target as HTMLButtonElement;
			props.required = target.ariaChecked === "true" ? true : false;
		},
		constants.debounceWait,
	);
	const handleTitleChange = useDebouncedCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			props.title = e.target.value;
		},
		constants.debounceWait,
	);

	useEffect(() => {
		if (titleRef.current == null) return;
		autosize(titleRef.current);

		debounceRefs
			.set(`${id}:checkbox`, handleCheckboxClick)
			.set(`${id}:title`, handleTitleChange);
	}, []);

	return (
		<div ref={setNodeRef} style={style} id={id.toString()}>
			<Card className={"my-5 flex overflow-hidden"}>
				<div className="w-full">
					<div className="mt-2 h-7 justify-center px-5 text-center text-base">
						<u>{returnTitle(typesEnum[props.type])}</u>
					</div>
					<CardHeader>
						<div className="flex justify-between">
							<CardTitle>
								<Textarea
									ref={titleRef}
									placeholder="Title"
									defaultValue={props.title}
									onChange={handleTitleChange}
									className="h-[36px] w-[600px] resize-none font-normal"
									maxLength={500}
								/>
							</CardTitle>
							<div
								className=" mt-[9px] fill-red-600"
								style={{ cursor: "pointer" }}
								onClick={handleDeleteClick}
							>
								<DeleteIcon />
							</div>
						</div>
						<div className="flex space-x-2 pt-2">
							<Label htmlFor="required">Required</Label>
							<Checkbox
								id="required"
								onClick={handleCheckboxClick}
								defaultChecked={props.required}
							/>
						</div>
					</CardHeader>
					{children}
				</div>

				<div
					className="custom-focus flex cursor-move items-center rounded-r-xl bg-accent"
					{...attributes}
					{...listeners}
				>
					<DragHandleDots2Icon className="size-7 text-black" />
				</div>
			</Card>
		</div>
	);

	function returnTitle(type: typesEnum) {
		switch (type) {
			case "text-input":
				return "Text Input";
			case "multiple-choice":
				return "Multiple Choice";
			case "dropdown":
				return "Dropdown";
		}
	}

	function handleDeleteClick() {
		const itemIndex = formItems.findIndex((formItem) => formItem.id === id);
		for (const key of debounceRefs.keys()) {
			if (key.startsWith(`${id}:`)) debounceRefs.delete(key);
		}

		setFormItems([
			...formItems.slice(0, itemIndex),
			...formItems.slice(itemIndex + 1),
		]);
	}
}
