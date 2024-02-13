"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import React, { useContext } from "react";
import { TextInput } from "./form-components/TextInput";
import { FormBuilderContext } from "../contexts/FormBuilderContext";

const FormBuilder = () => {
	const { formItems, setFormItems } = useContext(FormBuilderContext);
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	return (
		<Card className="w-[700px] self-center">
			<CardHeader>
				<CardTitle>Form Title</CardTitle>
			</CardHeader>
			<CardContent>
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragEnd={handleDragEnd}
					modifiers={[restrictToVerticalAxis, restrictToParentElement]}
				>
					<SortableContext
						items={formItems}
						strategy={verticalListSortingStrategy}
					>
						{formItems.map((formItem) => {
							switch (formItem.type) {
								case "text-input":
									return (
										<TextInput
											key={formItem.id}
											id={formItem.id}
											placeholder={formItem.props[
												"placeholder"
											].toString()}
										/>
									);
							}
						})}
					</SortableContext>
				</DndContext>
			</CardContent>
		</Card>
	);

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;

		if (over == null) return;

		const activeIndex = formItems.findIndex(
			(formItem) => formItem.id === active.id
		);
		const overIndex = formItems.findIndex(
			(formItem) => formItem.id === over.id
		);

		if (activeIndex !== overIndex) {
			setFormItems(arrayMove(formItems, activeIndex, overIndex));
		}
	}
};

export default FormBuilder;
