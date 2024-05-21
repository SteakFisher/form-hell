import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { constants } from "@/constants";
import { FormBuilderContext } from "@/contexts/FormBuilderContext";
import { DropdownItemProps } from "@/interfaces/form-component-interfaces/dropdown/DropdownItemProps";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Cross1Icon, DragHandleDots2Icon } from "@radix-ui/react-icons";
import autosize from "autosize";
import { ChangeEvent, memo, useContext, useEffect, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";

const DropdownItem = memo(function DropdownItem({
	hideDelete,
	index,
	props,
	onDelete,
}: {
	hideDelete: boolean;
	index: number;
	props: DropdownItemProps;
	onDelete: (idToDelete: string) => void;
}) {
	const textRef = useRef<HTMLTextAreaElement>(null);
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

		const refs = debounceRefs.get(props.parentId);
		if (!refs) return;
		refs.set(`${props.id}:text`, handleTextChange);
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
			<div className="ml-2 flex size-full items-center justify-between">
				<Textarea
					ref={textRef}
					defaultValue={props.value}
					onChange={handleTextChange}
					placeholder={`Option ${index}`}
					className="h-[32px] resize-none disabled:cursor-default"
					maxLength={300}
				/>
				{hideDelete || (
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
				)}
			</div>
		</div>
	);
});

export default DropdownItem;
