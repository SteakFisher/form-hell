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
import { useContext, useRef } from "react";
import { FormBuilderContext } from "../contexts/FormBuilderContext";
import { TextInput } from "@/components/form-components/TextInput";
import Title from "@/components/form-components/Title";
import Dropdown from "@/components/form-components/dropdown/Dropdown";
import MultipleChoice from "@/components/form-components/multiple-choice/MultipleChoice";
import Range from "./form-components/Range";

const FormBuilder = () => {
	const { formItems, setFormItems } = useContext(FormBuilderContext);
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);
	const formBuilderRef = useRef<HTMLDivElement>(null);

	return (
		<Card className="w-[800px]">
			{formItems[0].props.type === "title" && (
				<Title key={formItems[0].id} props={formItems[0].props} />
			)}
			<CardContent ref={formBuilderRef}>
				<DndContext
				id={"sortable-items-dndcontext"}
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
								case "dropdown":
									return (
										<Dropdown
											key={formItem.id}
											props={formItem.props}
											id={formItem.id}
										/>
									);
								case "range":
									return (
										<Range
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

		document.getElementById(formItems[activeIndex].id.toString())?.focus();

		if (activeIndex !== overIndex) {
			setFormItems(arrayMove(formItems, activeIndex, overIndex));
		}
	}
};

export default FormBuilder;
