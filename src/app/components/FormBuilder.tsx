"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { useContext } from "react";
import { FormBuilderContext } from "../contexts/FormBuilderContext";
import TextInputProps from "../interfaces/form-component-interfaces/TextInputProps";
import { TextInput } from "./form-components/TextInput";
import Title from "./form-components/Title";
import TitleProps from "../interfaces/form-component-interfaces/TitleProps";

const FormBuilder = () => {
	const { formItems, setFormItems } = useContext(FormBuilderContext);
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	return (
		<Card className="w-[800px] self-center">
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
								case "title":
									return (
										<Title
											key={formItem.id}
											props={formItem.props}
										></Title>
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
