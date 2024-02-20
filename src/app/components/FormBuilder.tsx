"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
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
import autosize from "autosize";
import { useContext, useEffect, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";
import { constants } from "../constants";
import { FormBuilderContext } from "../contexts/FormBuilderContext";
import TextInputProps from "../interfaces/form-component-interfaces/TextInputProps";
import { TextInput } from "./form-components/TextInput";

const FormBuilder = () => {
	const { formItems, setFormItems, debounceRefs } = useContext(FormBuilderContext);
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const descriptionRef = useRef(null);
	const formTitleRef = useRef(null);

	const handleTitleChange = useDebouncedCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			if (!(formItems[0].props.type === "title")) return;
			formItems[0].props.title = e.target.value;
		},
		constants.debounceWait
	);

	const handleDescriptionChange = useDebouncedCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			if (!(formItems[0].props.type === "title")) return;
			formItems[0].props.description = e.target.value;
		},
		constants.debounceWait
	);

	useEffect(() => {
		if (descriptionRef.current == null) return;
		if (formTitleRef.current == null) return;
		autosize(descriptionRef.current);
		autosize(formTitleRef.current);

		debounceRefs
			.set(`0description`, handleDescriptionChange)
			.set(`0title`, handleTitleChange);
	}, []);

	return (
		<Card className="w-[800px] self-center">
			<CardHeader className="border-b mx-6 px-0">
				<Textarea
					ref={formTitleRef}
					placeholder="Form Title"
					defaultValue={formItems[0].props.title}
					maxLength={100}
					className="text-2xl mb-3 resize-none h-[50px] borderless-input"
				/>
				<div>
					<Textarea
						rows={2}
						ref={descriptionRef}
						placeholder="Description"
						defaultValue={(formItems[0].props.type === "title") ? formItems[0].props.description : ""}
						maxLength={500}
						className="text-base font-thin resize-none"
					/>
				</div>
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
							switch (formItem.props.type) {
								case "text-input":
									return (
										<TextInput
											key={formItem.id}
											props={formItem.props as TextInputProps}
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
