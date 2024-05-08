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
import { Fragment, useContext, useRef } from "react";
import { FormBuilderContext } from "../contexts/FormBuilderContext";
import { TextInput } from "@/components/form-components/TextInput";
import Title from "@/components/form-components/Title";
import Dropdown from "@/components/form-components/dropdown/Dropdown";
import MultipleChoice from "@/components/form-components/multiple-choice/MultipleChoice";
import Range from "./form-components/Range";
import MultipleChoiceGrid from "./form-components/multiple-choice-grid/MultipleChoiceGrid";
import Date from "./form-components/Date";
import AddBar from "./AddBar";

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
		<Card className="w-[800px] [overflow-anchor:none]">
			{formItems[0].props.type === "title" && (
				<Title key={formItems[0].id} props={formItems[0].props} />
			)}
			<CardContent className="pb-0" ref={formBuilderRef}>
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
						<AddBar id={"0"} isFocused={false} setIsFocused={() => {}} />
						{formItems.map((formItem) => {
							switch (formItem.props.type) {
								case "date":
									return (
										<Date
											id={formItem.id}
											key={formItem.id}
											props={formItem.props}
										/>
									);
								case "dropdown":
									return (
										<Dropdown
											id={formItem.id}
											key={formItem.id}
											props={formItem.props}
										/>
									);
								case "multiple-choice":
									return (
										<MultipleChoice
											id={formItem.id}
											key={formItem.id}
											props={formItem.props}
										/>
									);
								case "multiple-choice-grid":
									return (
										<MultipleChoiceGrid
											id={formItem.id}
											key={formItem.id}
											props={formItem.props}
										/>
									);
								case "range":
									return (
										<Range
											id={formItem.id}
											key={formItem.id}
											props={formItem.props}
										/>
									);
								case "text-input":
									return (
										<TextInput
											id={formItem.id}
											key={formItem.id}
											props={formItem.props}
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

		document.getElementById(formItems[activeIndex].id)?.focus();

		if (activeIndex !== overIndex) {
			setFormItems(arrayMove(formItems, activeIndex, overIndex));
		}
	}
};

export default FormBuilder;
