import { constants } from "@/app/constants";
import TextInputProps from "@/app/interfaces/form-component-interfaces/TextInputProps";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import autosize from "autosize";
import Image from "next/image";
import { ReactNode, useContext, useEffect, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";
import DeleteIcon from "../../../../public/icons/delete.svg";
import { FormBuilderContext } from "../../contexts/FormBuilderContext";

interface SortableItemProps {
	id: number;
	children: ReactNode;
	props: TextInputProps;
}

export function SortableItem({ children, id, props }: SortableItemProps) {
	const { formItems, setFormItems, debounceRefs } =
		useContext(FormBuilderContext);
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: id });
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const titleRef = useRef(null);

	const handleCheckboxClick = useDebouncedCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			const target = e.target as HTMLButtonElement;
			props.required = target.ariaChecked ?? "";
		},
		constants.debounceWait
	);
	const handleTitleChange = useDebouncedCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			props.title = e.target.value;
		},
		constants.debounceWait
	);

	useEffect(() => {
		if (titleRef.current == null) return;
		autosize(titleRef.current);

		debounceRefs
			.set(`${id}checkbox`, handleCheckboxClick)
			.set(`${id}title`, handleTitleChange);
	}, []);

	return (
		<div ref={setNodeRef} style={style}>
			<Card className={"flex overflow-hidden my-5"}>
				<div className="w-full">
					<CardHeader>
						<div className="flex justify-between">
							<CardTitle>
								<Textarea
									ref={titleRef}
									placeholder="Title"
									defaultValue={props.title}
									onChange={handleTitleChange}
									className="flex resize-none w-[600px] h-[38px]"
									maxLength={500}
								/>
							</CardTitle>
							<div
								className=" fill-red-600 mt-[9px]"
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
								defaultValue={props.required}
								onClick={handleCheckboxClick}
							/>
						</div>
					</CardHeader>
					{children}
				</div>

				<div
					className="flex bg-accent rounded-r-xl custom-focus"
					{...attributes}
					{...listeners}
				>
					<Image
						src={"/icons/drag_indicator.svg"}
						alt=""
						width={30}
						height={30}
					/>
				</div>
			</Card>
		</div>
	);

	function handleDeleteClick() {
		const itemIndex = formItems.findIndex((formItem) => formItem.id === id);
		debounceRefs.delete(`${id}checkbox`);
		debounceRefs.delete(`${id}title`);
		switch (props.inputType) {
			case "text-input":
				debounceRefs.delete(`${id}min-length`);
				debounceRefs.delete(`${id}max-length`);
				debounceRefs.delete(`${id}regex`);
		}

		setFormItems([
			...formItems.slice(0, itemIndex),
			...formItems.slice(itemIndex + 1),
		]);
	}
}
