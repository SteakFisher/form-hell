import React, { ReactNode, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TextInput } from "./TextInput";
import Image from "next/image";
import DeleteIcon from "../../../public/icons/delete.svg";
import { FormBuilderContext } from "../contexts/FormBuilderContext";

interface SortableItemProps {
	id: number;
	children: ReactNode;
	title: string;
}

export function SortableItem({ id, children, title }: SortableItemProps) {
	const { formItems, setFormItems } = useContext(FormBuilderContext);

	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div ref={setNodeRef} style={style}>
			<Card className="flex size-full items-stretch overflow-hidden my-5">
				<div className="w-full">
					<CardHeader>
						<CardTitle>{title}</CardTitle>
					</CardHeader>
					{children}
				</div>

				<div
					className="self-start mt-2 mr-1.5 fill-red-600"
					style={{ cursor: "pointer" }}
					onClick={handleDeleteClick}
				>
					<DeleteIcon />
				</div>

				<div className="flex bg-slate-300" {...attributes} {...listeners}>
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

		setFormItems([
			...formItems.slice(0, itemIndex),
			...formItems.slice(itemIndex + 1),
		]);
	}
}
