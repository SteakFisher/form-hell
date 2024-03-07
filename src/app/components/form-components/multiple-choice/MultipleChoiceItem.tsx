import { constants } from "@/app/constants";
import { FormBuilderContext } from "@/app/contexts/FormBuilderContext";
import { MultipleChoiceItemProps } from "@/app/interfaces/form-component-interfaces/multiple-choice/MultipleChoiceItemProps";
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
import { Cross1Icon, DragHandleDots2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

function MultipleChoiceItem({ props }: { props: MultipleChoiceItemProps }) {
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

		debounceRefs.set(
			`${props.parentId}:${props.id}:text`,
			handleTextChange,
		);
	}, []);

	return (
		<div
			ref={setNodeRef}
			style={style}
			id={props.id.toString()}
			className="mb-3 flex items-center"
		>
			{props.other || (
				<div className="custom-focus" {...attributes} {...listeners}>
					<DragHandleDots2Icon className="size-6 text-[hsl(var(--foreground))]" />
				</div>
			)}
			<Checkbox disabled className="ml-2 disabled:cursor-default" />
			<div className="ml-2 flex size-full items-center justify-between">
				<Textarea
					ref={textRef}
					disabled={props.other}
					defaultValue={props.value}
					onChange={handleTextChange}
					className="h-[32px] resize-none disabled:cursor-default"
					maxLength={500}
				/>
				<Button
					className="ml-2 size-9 px-3"
					variant="ghost"
					size="icon"
					onClick={() => {
						props.onDelete(props.id);
					}}
				>
					<Cross1Icon />
				</Button>
			</div>
		</div>
	);
}

export default MultipleChoiceItem;