"use client";

import { Card, CardContent } from "@/components/ui/card";
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
import { useContext, useState } from "react";
import { FormBuilderContext } from "../contexts/FormBuilderContext";
import { TextInput } from "./form-components/TextInput";
import Title from "./form-components/Title";
import MultipleChoice from "./form-components/multiple-choice/MultipleChoice";

const FormBuilder = () => {
	const { formItems, setFormItems } = useContext(FormBuilderContext);
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	return (
		<Card className="w-[800px] self-center">
			{formItems[0].props.type == "title" && (
				<Title key={formItems[0].id} props={formItems[0].props} />
			)}
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
							switch (formItem.props.type) {
								case "text-input":
									return (
										<TextInput
											key={formItem.id}
											props={formItem.props}
											id={formItem.id}
										/>
									);
								case "multiple-choice":
									return (
										<MultipleChoice
											key={formItem.id}
											props={formItem.props}
											id={formItem.id}
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
			(formItem) => formItem.id === active.id,
		);
		const overIndex = formItems.findIndex(
			(formItem) => formItem.id === over.id,
		);

		if (activeIndex !== overIndex) {
			setFormItems(arrayMove(formItems, activeIndex, overIndex));
		}
	}
};

export default FormBuilder;
