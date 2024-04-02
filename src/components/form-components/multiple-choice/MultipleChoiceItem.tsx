import { constants } from "@/constants";
import { FormBuilderContext } from "@/contexts/FormBuilderContext";
import { MultipleChoiceItemProps } from "@/interfaces/form-component-interfaces/multiple-choice/MultipleChoiceItemProps";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useSortable } from "@dnd-kit/sortable";
import autosize from "autosize";
import Image from "next/image";
import React, {
	ChangeEvent,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { DebouncedState, useDebouncedCallback } from "use-debounce";
import { CSS } from "@dnd-kit/utilities";
import { Checkbox } from "@/components/ui/checkbox";
import {
	CircleIcon,
	Cross1Icon,
	DragHandleDots2Icon,
	RadiobuttonIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

function MultipleChoiceItem({
	props,
	isRadio,
	onDelete,
}: {
	props: MultipleChoiceItemProps;
	isRadio: boolean;
	onDelete: (idToDelete: string) => void;
}) {
	const textRef = useRef(null);
	const { debounceRefs } = useContext(FormBuilderContext);
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: props.id });
	const style = {
		transform: CSS.Translate.toString(transform),
		transition,
	};
	const handleTextChange = useDebouncedCallback(
		(e: ChangeEvent<HTMLTextAreaElement>) => {
			props.value = e.target.value;
		},
		constants.debounceWait,
	);

	useEffect(() => {
		if (textRef.current == null) return;
		autosize(textRef.current);

		debounceRefs.set(`${props.parentId}:${props.id}:text`, handleTextChange);
	}, []);

	return (
		<div
			ref={setNodeRef}
			style={style}
			id={props.id}
			className="mb-3 flex items-center"
		>
			<div className="custom-focus" {...attributes} {...listeners}>
				<DragHandleDots2Icon className="size-6 text-[hsl(var(--foreground))]" />
			</div>
			{isRadio ? (
				<CircleIcon className="ml-2 size-5 shrink-0" />
			) : (
				<Checkbox
					disabled
					className="ml-2 disabled:cursor-default disabled:opacity-100"
				/>
			)}
			<div className="ml-2 flex size-full items-center justify-between">
				<Textarea
					ref={textRef}
					defaultValue={props.value}
					onChange={handleTextChange}
					placeholder="Enter option value"
					className="h-[32px] resize-none disabled:cursor-default"
					maxLength={500}
				/>
				<Button
					className="ml-2 size-9 px-3"
					variant="ghost"
					size="icon"
					onClick={() => {
						onDelete(props.id);
					}}
				>
					<Cross1Icon />
				</Button>
			</div>
		</div>
	);
}

export default MultipleChoiceItem;
